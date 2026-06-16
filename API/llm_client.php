<?php

require_once __DIR__ . '/config.php';

function aiSetLastProviderError(string $provider, string $error): void
{
    $GLOBALS['ai_provider_last_error'] = [
        'provider' => $provider,
        'error' => $error,
    ];
}

function aiGetLastProviderError(string $provider): string
{
    $last = $GLOBALS['ai_provider_last_error'] ?? null;
    if (!is_array($last) || ($last['provider'] ?? '') !== $provider) {
        return '';
    }
    return trim((string)($last['error'] ?? ''));
}

function aiCachePath(): string
{
    return __DIR__ . '/ai_chat_cache.json';
}

function aiCacheLoad(): array
{
    $path = aiCachePath();
    if (!is_file($path)) return ['items' => []];
    $raw = (string)@file_get_contents($path);
    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || !isset($decoded['items']) || !is_array($decoded['items'])) return ['items' => []];
    return $decoded;
}

function aiCacheSave(array $cache): void
{
    @file_put_contents(aiCachePath(), json_encode($cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function aiCacheGet(string $key): ?string
{
    $cache = aiCacheLoad();
    $now = time();
    foreach ($cache['items'] as $item) {
        if (($item['key'] ?? '') === $key) {
            $ttl = (int)($item['ttl'] ?? 0);
            $ts = (int)($item['ts'] ?? 0);
            if ($ttl > 0 && ($now - $ts) <= $ttl) {
                $val = trim((string)($item['value'] ?? ''));
                return $val !== '' ? $val : null;
            }
        }
    }
    return null;
}

function aiCacheSet(string $key, string $value, int $ttlSeconds = 600): void
{
    $cache = aiCacheLoad();
    $cache['items'][] = [
        'key' => $key,
        'value' => $value,
        'ttl' => $ttlSeconds,
        'ts' => time()
    ];
    // límite
    if (count($cache['items']) > 250) {
        $cache['items'] = array_slice($cache['items'], -250);
    }
    aiCacheSave($cache);
}

function aiHistoryToText(array $history): string
{
    $lines = [];
    foreach ($history as $item) {
        $role = (string)($item['role'] ?? 'user');
        $text = trim((string)($item['text'] ?? ''));
        if ($text === '') {
            continue;
        }
        $lines[] = strtoupper($role) . ': ' . $text;
    }
    return implode("\n", $lines);
}

function aiTryOllamaChat(string $systemPrompt, string $userPrompt, array $history): ?string
{
    aiSetLastProviderError('ollama', '');
    $url = rtrim(OLLAMA_URL, '/') . '/api/chat';

    $messages = [
        ['role' => 'system', 'content' => $systemPrompt],
    ];

    // Solo últimos 4 turnos para velocidad
    $tail = array_slice($history, -8);
    foreach ($tail as $h) {
        $r = (string)($h['role'] ?? '');
        $t = trim((string)($h['text'] ?? ''));
        if ($t === '' || ($r !== 'user' && $r !== 'assistant')) continue;
        $messages[] = ['role' => $r, 'content' => $t];
    }

    $messages[] = ['role' => 'user', 'content' => $userPrompt];

    $payload = [
        'model' => OLLAMA_MODEL,
        'messages' => $messages,
        'stream' => false,
        'keep_alive' => '10m',
        'options' => [
            // Menos tokens = más rápido
            'num_predict' => 220,
            // Menos contexto = más rápido
            'num_ctx' => 2048,
            'temperature' => 0.7,
            'top_p' => 0.9
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
        // En Windows (primer respuesta) Ollama puede tardar >20s al cargar modelo
        CURLOPT_TIMEOUT => 90,
    ]);
    $response = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = (string)curl_error($ch);
    curl_close($ch);

    if ($curlError !== '' || $httpCode !== 200 || !$response) {
        aiSetLastProviderError('ollama', "http={$httpCode}; curl={$curlError}");
        return null;
    }

    $data = json_decode((string)$response, true);
    $text = trim((string)($data['message']['content'] ?? ''));
    if ($text === '') {
        aiSetLastProviderError('ollama', 'Respuesta vacía del modelo.');
    }
    return $text !== '' ? $text : null;
}

function aiTryGeminiChat(string $systemPrompt, string $userPrompt, array $history): ?string
{
    aiSetLastProviderError('gemini', '');
    $apiKey = trim((string)GEMINI_API_KEY);
    if ($apiKey === '') {
        aiSetLastProviderError('gemini', 'GEMINI_API_KEY vacía.');
        return null;
    }

    $configuredModel = trim((string)GEMINI_MODEL) !== '' ? trim((string)GEMINI_MODEL) : 'gemini-2.0-flash';
    $modelCandidates = array_values(array_unique([
        $configuredModel,
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
    ]));

    $contents = [];
    $tail = array_slice($history, -8);
    foreach ($tail as $h) {
        $r = (string)($h['role'] ?? '');
        $t = trim((string)($h['text'] ?? ''));
        if ($t === '' || ($r !== 'user' && $r !== 'assistant')) {
            continue;
        }
        $contents[] = [
            'role' => $r === 'assistant' ? 'model' : 'user',
            'parts' => [
                ['text' => $t],
            ],
        ];
    }

    $contents[] = [
        'role' => 'user',
        'parts' => [
            ['text' => $userPrompt],
        ],
    ];

    $payload = [
        'systemInstruction' => [
            'parts' => [
                ['text' => $systemPrompt],
            ],
        ],
        'contents' => $contents,
        'generationConfig' => [
            'temperature' => 0.7,
            'topP' => 0.9,
            'maxOutputTokens' => 320,
        ],
    ];

    $errors = [];
    foreach ($modelCandidates as $model) {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/'
            . rawurlencode($model)
            . ':generateContent?key='
            . rawurlencode($apiKey);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_TIMEOUT => max(10, AI_HTTP_TIMEOUT_SECONDS),
        ]);
        $response = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = (string)curl_error($ch);
        curl_close($ch);

        if ($curlError !== '' || !$response) {
            $errors[] = "{$model}: curl={$curlError}";
            continue;
        }

        $data = json_decode((string)$response, true);
        if ($httpCode !== 200) {
            $apiError = trim((string)($data['error']['message'] ?? 'HTTP ' . $httpCode));
            $errors[] = "{$model}: http={$httpCode}; {$apiError}";
            continue;
        }

        $parts = $data['candidates'][0]['content']['parts'] ?? null;
        if (!is_array($parts)) {
            $errors[] = "{$model}: respuesta sin contenido.";
            continue;
        }

        $chunks = [];
        foreach ($parts as $part) {
            $text = trim((string)($part['text'] ?? ''));
            if ($text !== '') {
                $chunks[] = $text;
            }
        }

        $final = trim(implode("\n", $chunks));
        if ($final !== '') {
            return $final;
        }
        $errors[] = "{$model}: texto vacío.";
    }

    aiSetLastProviderError('gemini', implode(' | ', array_slice($errors, 0, 3)));
    return null;
}

function aiConversationalReply(string $prompt, string $area, string $subarea, string $role, array $history, array $navigation = []): string
{
    require_once __DIR__ . '/ai_navigation.php';
    $nav = aiSanitizeNavigationContext($navigation);
    $navBlock = aiNavigationSystemBlock($nav, $area, $subarea, $role);

    $systemPrompt = "Eres un asistente institucional humano y claro (español) para PSICEI del TESJo.
Habla natural, directo y amable. Evita respuestas genéricas incorrectas.
{$navBlock}
Seguridad: si NO es admin, no des detalles operativos de otras áreas.";

    $moduleKey = aiNormalize((string)($nav['module_name'] ?? '')) . '|' . aiNormalize((string)($nav['pathname'] ?? ''));
    $cacheKey = sha1(aiNormalize($prompt) . '|' . aiNormalize($area) . '|' . aiNormalize($subarea) . '|' . aiNormalize($role) . '|' . $moduleKey);
    $cached = aiCacheGet($cacheKey);
    if ($cached !== null) {
        return $cached;
    }

    $provider = strtolower(trim((string)AI_CHAT_PROVIDER));

    if ($provider === 'ollama') {
        $ollama = aiTryOllamaChat($systemPrompt, $prompt, $history);
        if ($ollama !== null) {
            aiCacheSet($cacheKey, $ollama, 900);
            return $ollama;
        }
        $detail = aiGetLastProviderError('ollama');
        return "El asistente IA (Ollama) no está disponible en este momento. "
            . "Verifica OLLAMA_URL/OLLAMA_MODEL en el servidor o cambia a Gemini para hosting compartido."
            . ($detail !== '' ? " Detalle técnico: {$detail}" : '');
    } elseif ($provider === 'gemini' || $provider === 'google' || $provider === 'google-gemini') {
        $geminiKey = trim((string)GEMINI_API_KEY);
        $geminiKeyUpper = strtoupper($geminiKey);
        if (
            $geminiKey === ''
            || str_contains($geminiKeyUpper, 'TU_GEMINI_API_KEY')
            || str_contains($geminiKeyUpper, 'YOUR_GEMINI_API_KEY')
            || str_contains($geminiKeyUpper, 'CHANGEME')
        ) {
            return "El asistente IA está configurado para Gemini, pero falta la clave API. "
                . "Configura GEMINI_API_KEY en el archivo .env del servidor para habilitar respuestas inteligentes.";
        }
        $gemini = aiTryGeminiChat($systemPrompt, $prompt, $history);
        if ($gemini !== null) {
            aiCacheSet($cacheKey, $gemini, 900);
            return $gemini;
        }
        $detail = aiGetLastProviderError('gemini');
        return "No pude conectar con Gemini en este momento. "
            . "Revisa que la GEMINI_API_KEY sea válida y que el hosting tenga salida HTTPS a Google APIs."
            . ($detail !== '' ? " Detalle técnico: {$detail}" : '');
    }

    // Fallback natural (si no hay modelo local disponible)
    return "Buena pregunta. Te respondo de forma directa: " . $prompt . ". "
        . "Si quieres, lo aterrizamos a una acción concreta dentro del sistema y lo resolvemos juntos paso a paso.";
}
