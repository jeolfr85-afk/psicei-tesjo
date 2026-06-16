<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/ai_navigation.php';
require_once __DIR__ . '/ai_commands.php';

function aiNormalize(string $text): string
{
    $text = mb_strtolower(trim($text), 'UTF-8');
    $replacements = [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n'
    ];
    $text = strtr($text, $replacements);
    $text = preg_replace('/\s+/', ' ', $text ?? '');
    return $text ?? '';
}

/**
 * True si el usuario pide un módulo/captura concreta (no la página global de estadísticas).
 */
function aiPhraseTargetsSpecificModule(string $normalized): bool
{
    $modulePhrases = [
        'evaluacion docente', 'evaluacion del docente', 'grafica de evaluacion',
        'grafica evaluacion', 'alumnos en eventos', 'eventos academicos',
        'capacitacion docente', 'capacitacion del docente', 'telecomunicaciones',
        'recursos informaticos', 'servicio social', 'residencia profesional',
        'servicio a la comunidad', 'biblioteca', 'investigacion', 'proyecto de investigacion',
        'centro de computo', 'desarrollo academico', 'difusion', 'actividades extraescolares',
    ];
    return aiContainsAny($normalized, $modulePhrases);
}

function aiContainsAny(string $normalized, array $keywords): bool
{
    if ($normalized === '') {
        return false;
    }

    $tokens = preg_split('/[^a-z0-9_]+/u', $normalized) ?: [];
    $tokens = array_values(array_filter($tokens, static fn($t) => $t !== ''));

    foreach ($keywords as $kw) {
        $k = aiNormalize((string)$kw);
        if ($k === '') {
            continue;
        }

        // Coincidencia directa por frase
        if (str_contains($normalized, $k)) {
            return true;
        }

        // Coincidencia tolerante por token (falta ortográfica)
        foreach ($tokens as $token) {
            similar_text($token, $k, $score);
            if ($score >= 82.0) {
                return true;
            }
        }
    }

    return false;
}

function aiExtractCount(string $normalized, int $default = 5): int
{
    if (preg_match('/\b(\d{1,2})\b/u', $normalized, $m)) {
        return max(1, min(50, (int)$m[1]));
    }

    // Palabras comunes
    $map = [
        'uno' => 1, 'una' => 1, 'dos' => 2, 'tres' => 3, 'cuatro' => 4, 'cinco' => 5,
        'seis' => 6, 'siete' => 7, 'ocho' => 8, 'nueve' => 9, 'diez' => 10
    ];
    foreach ($map as $word => $value) {
        if (str_contains($normalized, $word)) {
            return $value;
        }
    }

    return $default;
}

function aiMemoryPath(): string
{
    return __DIR__ . '/ai_memory.json';
}

function aiLoadMemory(): array
{
    $path = aiMemoryPath();
    if (!is_file($path)) {
        return ['patterns' => []];
    }
    $raw = (string) @file_get_contents($path);
    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || !isset($decoded['patterns']) || !is_array($decoded['patterns'])) {
        return ['patterns' => []];
    }
    return $decoded;
}

function aiSaveMemory(array $memory): void
{
    @file_put_contents(aiMemoryPath(), json_encode($memory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function aiRememberPattern(string $prompt, string $intent, array $result): void
{
    $normalized = aiNormalize($prompt);
    if ($normalized === '') {
        return;
    }

    $memory = aiLoadMemory();
    $updated = false;
    foreach ($memory['patterns'] as &$p) {
        if (($p['phrase'] ?? '') === $normalized && ($p['intent'] ?? '') === $intent) {
            $p['hits'] = (int)($p['hits'] ?? 0) + 1;
            $p['last_updated'] = date('c');
            $p['result'] = $result;
            $updated = true;
            break;
        }
    }
    unset($p);

    if (!$updated) {
        $memory['patterns'][] = [
            'phrase' => $normalized,
            'intent' => $intent,
            'hits' => 1,
            'last_updated' => date('c'),
            'result' => $result
        ];
    }

    // Limitar tamaño de memoria para no crecer indefinidamente
    if (count($memory['patterns']) > 500) {
        usort($memory['patterns'], static fn($a, $b) => (int)($b['hits'] ?? 0) <=> (int)($a['hits'] ?? 0));
        $memory['patterns'] = array_slice($memory['patterns'], 0, 500);
    }

    aiSaveMemory($memory);
}

function aiMemoryMatch(string $prompt): ?array
{
    $normalized = aiNormalize($prompt);
    if ($normalized === '') {
        return null;
    }

    $memory = aiLoadMemory();
    $best = null;
    $bestScore = 0.0;
    foreach ($memory['patterns'] as $p) {
        $phrase = (string)($p['phrase'] ?? '');
        if ($phrase === '') {
            continue;
        }
        similar_text($normalized, $phrase, $score);
        if ($score > $bestScore) {
            $bestScore = $score;
            $best = $p;
        }
    }

    if ($best !== null && $bestScore >= 82.0) {
        return $best;
    }
    return null;
}

function aiBuildFakeValue(string $header, int $rowIdx, string $area): string
{
    $h = aiNormalize($header);
    if (str_contains($h, 'nombre')) return "Registro {$rowIdx}";
    if (str_contains($h, 'apellido')) return "Apellido{$rowIdx}";
    if (str_contains($h, 'correo')) return "usuario{$rowIdx}@tesjo.edu.mx";
    if (str_contains($h, 'usuario')) return "user{$rowIdx}";
    if (str_contains($h, 'telefono') || str_contains($h, 'tel')) return "7121000" . str_pad((string)$rowIdx, 3, '0', STR_PAD_LEFT);
    if (str_contains($h, 'area')) return $area !== '' ? $area : 'Área Institucional';
    if (str_contains($h, 'subarea')) return 'Subárea Operativa';
    if (str_contains($h, 'cantidad')) return (string)random_int(1, 120);
    if (str_contains($h, 'periodo')) return '2026-1';
    if (str_contains($h, 'fecha')) return date('Y-m-d');
    return "Dato {$rowIdx}";
}

function aiGenerateRows(array $headers, int $count, string $area): array
{
    $count = max(1, min(50, $count));
    $rows = [];
    for ($i = 1; $i <= $count; $i++) {
        $row = [];
        foreach ($headers as $header) {
            $key = trim((string)$header);
            if ($key === '') {
                continue;
            }
            $row[$key] = aiBuildFakeValue($key, $i, $area);
        }
        if (!empty($row)) {
            $rows[] = $row;
        }
    }
    return $rows;
}

/**
 * Resuelve intenciones locales (offline) y aprende patrones.
 */
function aiResolveLocal(string $prompt, array $headers, string $area, string $subarea, string $role, array $navigation = []): ?array
{
    $normalized = aiNormalize($prompt);
    if ($normalized === '') {
        return null;
    }

    $nav = aiSanitizeNavigationContext($navigation);

    // 0) Ubicación / módulo actual (prioridad: pantalla visible, no área de sesión)
    if (aiIsLocationQuestion($normalized)) {
        $msg = aiBuildLocationReply($nav, $area, $subarea, $role);
        $result = ['message' => $msg];
        aiRememberPattern($prompt, 'navigation_context', $result);
        return ['intent' => 'navigation_context', 'result' => $result];
    }

    // 1) Comandos de navegación y sistema (antes que memoria, para no confundir módulos con estadísticas)
    $systemCmd = aiResolveSystemCommand($normalized, $role, $nav);
    if ($systemCmd !== null && isset($systemCmd['result'])) {
        $intent = (string)($systemCmd['intent'] ?? 'system_command');
        aiRememberPattern($prompt, $intent, $systemCmd['result']);
        return $systemCmd;
    }

    // 2) Memoria aprendida (omitir open_stats si la frase pide un módulo concreto)
    $memoryHit = aiMemoryMatch($normalized);
    if ($memoryHit && isset($memoryHit['result']) && is_array($memoryHit['result'])) {
        $memIntent = (string)($memoryHit['intent'] ?? '');
        $skipMemory = in_array($memIntent, ['chat_reply', 'navigation_context', 'user_area_context', 'guide'], true)
            && aiIsLocationQuestion($normalized);
        if ($memIntent === 'open_stats' && aiPhraseTargetsSpecificModule($normalized)) {
            $skipMemory = true;
        }
        if (!$skipMemory) {
            return ['intent' => $memIntent !== '' ? $memIntent : 'memory', 'result' => $memoryHit['result']];
        }
    }

    // 2) Acciones directas del sistema
    if (aiContainsAny($normalized, ['dashboard', 'panel principal', 'inicio', 'pantalla principal'])) {
        $result = ['action' => 'open_url', 'url' => '/prueba/prueba/MENU/inicio.php'];
        aiRememberPattern($prompt, 'open_dashboard', $result);
        return ['intent' => 'open_dashboard', 'result' => $result];
    }
    if (
        aiContainsAny($normalized, ['estadisticas', 'estadistica', 'metricas', 'indicadores'])
        || (
            aiContainsAny($normalized, ['graficas', 'grafica', 'reportes', 'reporte'])
            && !aiPhraseTargetsSpecificModule($normalized)
        )
    ) {
        $statsUrl = '/prueba/prueba/MENU/estadisticas.php';
        if ($role === 'admin' && $area !== '' && isAllowedInstitutionalArea($area)) {
            $statsUrl .= '?area=' . rawurlencode($area);
        }
        $result = [
            'action' => 'open_url',
            'url' => $statsUrl,
            'message' => 'Abriendo estadísticas' . ($area !== '' ? " de {$area}" : '') . '…',
        ];
        aiRememberPattern($prompt, 'open_stats', $result);
        return ['intent' => 'open_stats', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['contactos', 'agenda', 'directorio', 'lista de contactos'])) {
        $result = ['action' => 'open_url', 'url' => '/prueba/prueba/MENU/contactos.php'];
        aiRememberPattern($prompt, 'open_contacts', $result);
        return ['intent' => 'open_contacts', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['graficas contactos', 'estadisticas contactos', 'grafica contactos'])) {
        $result = ['action' => 'open_url', 'url' => '/prueba/prueba/MENU/contactos_stats.php'];
        aiRememberPattern($prompt, 'open_contacts_stats', $result);
        return ['intent' => 'open_contacts_stats', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['historial', 'historial de registros', 'ver registros', 'mis registros', 'registros guardados'])) {
        $result = ['action' => 'open_url', 'url' => '/prueba/prueba/MENU/records_history.php'];
        aiRememberPattern($prompt, 'open_records_history', $result);
        return ['intent' => 'open_records_history', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['guardar', 'guarda', 'save', 'almacena', 'grabar', 'resguarda'])) {
        $result = ['action' => 'save'];
        aiRememberPattern($prompt, 'save', $result);
        return ['intent' => 'save', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['pdf', 'descargar pdf', 'imprimir', 'bajame pdf', 'exporta pdf'])) {
        $result = ['action' => 'download_pdf'];
        aiRememberPattern($prompt, 'download_pdf', $result);
        return ['intent' => 'download_pdf', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['excel', 'xlsx', 'descargar excel', 'bajame excel', 'exporta excel'])) {
        $result = ['action' => 'download_excel'];
        aiRememberPattern($prompt, 'download_excel', $result);
        return ['intent' => 'download_excel', 'result' => $result];
    }
    if (aiContainsAny($normalized, ['limpiar', 'borra', 'borrar tabla', 'clear', 'cancelar', 'reinicia tabla'])) {
        $result = ['action' => 'clear'];
        aiRememberPattern($prompt, 'clear', $result);
        return ['intent' => 'clear', 'result' => $result];
    }

    // 3) Generación de registros local
    if (!empty($headers) && aiContainsAny($normalized, ['registro', 'registros', 'fila', 'filas', 'genera', 'crear', 'arma', 'llenar'])) {
        $count = aiExtractCount($normalized, 5);
        $rows = aiGenerateRows($headers, $count, $area);
        aiRememberPattern($prompt, 'generate_rows', $rows);
        return ['intent' => 'generate_rows', 'result' => $rows];
    }

    // 4) Small talk (conversación natural)
    if (aiContainsAny($normalized, ['hola', 'buenas', 'que tal', 'como estas', 'como te va', 'gracias', 'platicar', 'conversar', 'cuentame'])) {
        if (aiContainsAny($normalized, ['como estas', 'como te va', 'que tal'])) {
            $result = ['message' => "¡Muy bien, gracias por preguntar! ¿Y tú cómo estás? Si quieres, también te ayudo con cualquier tarea del sistema."];
            aiRememberPattern($prompt, 'small_talk_how_are_you', $result);
            return ['intent' => 'small_talk_how_are_you', 'result' => $result];
        }
        if (aiContainsAny($normalized, ['hola', 'buenas'])) {
            $result = ['message' => "¡Hola! Qué gusto saludarte. ¿En qué te ayudo hoy?"];
            aiRememberPattern($prompt, 'small_talk_hello', $result);
            return ['intent' => 'small_talk_hello', 'result' => $result];
        }
        $result = ['message' => "Me encanta platicar contigo. Si quieres, seguimos conversando o hacemos algo del sistema."];
        aiRememberPattern($prompt, 'small_talk_generic', $result);
        return ['intent' => 'small_talk_generic', 'result' => $result];
    }

    // 5) Preguntas de contexto del usuario (área de perfil vs módulo visible)
    if (aiContainsAny($normalized, ['que area es esta', 'cual es mi area', 'en que area estoy', 'que subarea tengo', 'cual es mi subarea'])) {
        $module = trim((string)($nav['module_name'] ?? ''));
        if ($module !== '') {
            $msg = "En esta pantalla estás en el módulo: {$module}.";
            if (($nav['section_name'] ?? '') !== '') {
                $msg .= ' Sección: ' . $nav['section_name'] . '.';
            }
            $msg .= " Tu área de usuario asignada en el sistema es: {$area}.";
        } else {
            $msg = "Tu área de usuario asignada es: {$area}.";
        }
        if ($subarea !== '') {
            $msg .= " Tu subárea es: {$subarea}.";
        }
        $result = ['message' => $msg];
        aiRememberPattern($prompt, 'user_area_context', $result);
        return ['intent' => 'user_area_context', 'result' => $result];
    }

    // 6) Guía del sistema local (sin disparar por 'como estas')
    if (aiContainsAny($normalized, ['ayuda', 'guia', 'sistema', 'modulo', 'que puedo hacer', 'no entiendo', 'explicame', 'como hago un registro', 'como le hago'])) {
        $module = trim((string)($nav['module_name'] ?? ''));
        if ($module !== '') {
            $message = "Estás en {$module}. ";
            if (($nav['description'] ?? '') !== '') {
                $message .= $nav['description'] . ' ';
            }
        } else {
            $message = "Te apoyo en tu área: {$area}" . ($subarea !== '' ? " / {$subarea}" : '') . '. ';
        }
        $message .= 'Puedo generar registros, ayudarte a editarlos, guardar en BD y descargar PDF/Excel. '
            . "Escribe por ejemplo: 'genera 5 registros', 'guarda los datos', 'descarga excel'.";
        $result = ['message' => $message];
        aiRememberPattern($prompt, 'guide', $result);
        return ['intent' => 'guide', 'result' => $result];
    }

    // 7) Restricción de área (no admin)
    if ($role !== 'admin' && aiContainsAny($normalized, ['todas las areas', 'global', 'admin', 'otro departamento', 'otra area'])) {
        $result = ['message' => "Solo puedo ayudarte dentro de tu área asignada: {$area}."];
        aiRememberPattern($prompt, 'area_restriction', $result);
        return ['intent' => 'area_restriction', 'result' => $result];
    }

    return null;
}
