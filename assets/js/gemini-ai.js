/**
 * PSICEI - Asistente virtual institucional (v3)
 * Chat conversacional, contexto de navegación, voz STT/TTS (Web Speech API).
 * Recomendado: Chrome o Edge. Para voz en local, usar localhost con conexión a internet.
 */
(function () {
    'use strict';

    const API_URL = '/prueba/prueba/API/gemini_proxy.php';
    const RECORDS_API_URL = '/prueba/prueba/API/records.php';
    const USER_CONTEXT_URL = '/prueba/prueba/API/user_context.php';
    const CHAT_HISTORY_URL = '/prueba/prueba/API/chat_history.php';
    const CLEAR_CHAT_URL = '/prueba/prueba/API/clear_chat.php';
    const CSS_URL = '/prueba/prueba/assets/css/ai-assistant.css';
    const FAB_ID = 'ai-fab';
    const PANEL_ID = 'ai-panel';
    const TTS_STORAGE_KEY = 'psicei_voice_tts';
    const AUTO_SEND_VOICE_KEY = 'psicei_voice_auto_send';

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sttSupported = !!SpeechRecognitionCtor;
    const ttsSupported = typeof window.speechSynthesis !== 'undefined';

    let recognition = null;
    let micStream = null;
    let isListening = false;
    let voiceFinalTranscript = '';
    let voiceInterimTranscript = '';
    let ttsEnabled = true;
    let voiceControlsInitialized = false;
    let micPermissionGranted = false;
    let voiceRetryCount = 0;
    let listenMaxTimerId = null;
    let silenceTimerId = null;
    let typingEl = null;
    let lastVoiceErrorShown = 0;
    let voiceSendOnEnd = false;
    let voiceFinalizing = false;
    let assistantState = 'idle';

    const SILENCE_MS = 4500;
    const INITIAL_SPEECH_WAIT_MS = 9000;
    const MAX_LISTEN_MS = 90000;
    const VOICE_RETRY_MAX = 3;
    const RESTART_DELAY_MS = 220;
    const SOUNDS_KEY = 'psicei_voice_sounds';

    function getCookie(name) {
        try {
            const parts = document.cookie ? document.cookie.split('; ') : [];
            for (const part of parts) {
                const eqIdx = part.indexOf('=');
                if (eqIdx === -1) continue;
                if (part.slice(0, eqIdx) === name) {
                    return decodeURIComponent(part.slice(eqIdx + 1));
                }
            }
        } catch (_) {}
        return '';
    }

    function storageKey() {
        const sid = (getCookie('PHPSESSID') || '').trim();
        const u = (document.body?.dataset?.userName || '').trim();
        return `psicei_chat_${sid || u || 'anon'}`;
    }

    function loadLocalHistory() {
        try {
            const raw = localStorage.getItem(storageKey());
            const data = raw ? JSON.parse(raw) : null;
            return Array.isArray(data) ? data : [];
        } catch (_) {
            return [];
        }
    }

    function saveLocalHistory(items) {
        try {
            localStorage.setItem(storageKey(), JSON.stringify(items.slice(-40)));
        } catch (_) {}
    }

    function loadTtsEnabled() {
        try {
            const v = localStorage.getItem(TTS_STORAGE_KEY);
            if (v === '0') return false;
        } catch (_) {}
        return true;
    }

    function saveTtsEnabled(on) {
        try {
            localStorage.setItem(TTS_STORAGE_KEY, on ? '1' : '0');
        } catch (_) {}
    }

    function prepareTextForTts(text) {
        return String(text || '')
            .replace(/\n+/g, '. ')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/https?:\/\/\S+/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function pickSpanishVoice() {
        if (!ttsSupported) return null;
        const voices = window.speechSynthesis.getVoices();
        return voices.find((v) => v.lang && v.lang.startsWith('es-MX'))
            || voices.find((v) => v.lang && v.lang.startsWith('es-ES'))
            || voices.find((v) => v.lang && v.lang.startsWith('es'))
            || null;
    }

    function loadSoundsEnabled() {
        try { return localStorage.getItem(SOUNDS_KEY) !== '0'; } catch (_) { return true; }
    }

    function playSoftTone(kind) {
        if (!loadSoundsEnabled()) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = kind === 'start' ? 520 : 380;
            gain.gain.value = 0.06;
            osc.start();
            osc.stop(ctx.currentTime + (kind === 'start' ? 0.08 : 0.1));
            setTimeout(() => ctx.close(), 200);
        } catch (_) {}
    }

    function speakText(text) {
        if (!ttsSupported || !ttsEnabled) return;
        const clean = prepareTextForTts(text);
        if (!clean) return;
        window.speechSynthesis.cancel();
        const parts = clean.split(/(?<=[.!?])\s+/).filter((p) => p.length > 2);
        const chunks = parts.length ? parts : [clean];
        const voice = pickSpanishVoice();
        let i = 0;
        const speakNext = () => {
            if (i >= chunks.length) return;
            const utterance = new SpeechSynthesisUtterance(chunks[i]);
            utterance.lang = 'es-MX';
            utterance.rate = 0.92;
            utterance.pitch = 1.02;
            if (voice) utterance.voice = voice;
            utterance.onend = () => { i += 1; setTimeout(speakNext, 180); };
            window.speechSynthesis.speak(utterance);
        };
        speakNext();
    }

    function setAssistantState(state) {
        assistantState = state;
        const panel = document.getElementById(PANEL_ID);
        if (panel) {
            panel.classList.remove('ai-state-listening', 'ai-state-processing', 'ai-state-thinking');
            if (state === 'listening') panel.classList.add('ai-state-listening');
            if (state === 'processing') panel.classList.add('ai-state-processing');
            if (state === 'thinking') panel.classList.add('ai-state-thinking');
        }
    }

    function scrollMessagesToBottom() {
        const container = document.getElementById('ai-messages');
        if (container) {
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
    }

    function updateContextChip() {
        const chip = document.getElementById('ai-context-chip');
        if (!chip) return;
        const nav = getNavigationContext();
        const label = nav.screen_summary || nav.module_name || nav.page_title || 'Sistema PSICEI';
        chip.textContent = label.length > 42 ? label.slice(0, 42) + '…' : label;
        chip.title = [nav.module_name, nav.section_name, nav.active_tab].filter(Boolean).join(' · ') || nav.description || label;
    }

    function showListeningBar(visible, statusText) {
        const bar = document.getElementById('ai-listening-bar');
        const label = document.getElementById('ai-listening-text');
        if (!bar) return;
        bar.classList.toggle('is-visible', visible);
        if (label && statusText) label.textContent = statusText;
    }

    function setListeningUi(active, statusText) {
        const voiceBtn = document.getElementById('ai-voice');
        const panel = document.getElementById(PANEL_ID);
        const input = document.getElementById('ai-input');
        if (voiceBtn) voiceBtn.classList.toggle('ai-listening', active);
        if (panel) panel.classList.toggle('ai-listening', active);
        if (input) input.classList.toggle('ai-listening', active);
        if (active) {
            setAssistantState('listening');
            showListeningBar(true, statusText || 'Escuchando… Habla con naturalidad');
        } else if (assistantState === 'listening') {
            showListeningBar(false);
            setAssistantState('idle');
        }
    }

    function clearSilenceTimer() {
        if (silenceTimerId) {
            clearTimeout(silenceTimerId);
            silenceTimerId = null;
        }
    }

    function clearListenMaxTimer() {
        if (listenMaxTimerId) {
            clearTimeout(listenMaxTimerId);
            listenMaxTimerId = null;
        }
    }

    function resetSilenceTimer() {
        clearSilenceTimer();
        if (!isListening) return;
        silenceTimerId = setTimeout(() => {
            if (isListening) stopListening(true);
        }, SILENCE_MS);
    }

    function releaseMicStream() {
        if (micStream) {
            micStream.getTracks().forEach((t) => t.stop());
            micStream = null;
        }
    }

    function updateTtsToggleUi() {
        const btn = document.getElementById('ai-voice-toggle');
        if (!btn) return;
        btn.classList.toggle('ai-tts-off', !ttsEnabled);
        btn.title = ttsEnabled ? 'Desactivar voz de respuestas' : 'Activar voz de respuestas';
        btn.setAttribute('aria-pressed', ttsEnabled ? 'true' : 'false');
    }

    async function ensureMicPermission() {
        if (micStream && micStream.active) {
            micPermissionGranted = true;
            return true;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            return sttSupported;
        }
        try {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });
            micPermissionGranted = true;
            return true;
        } catch (err) {
            const name = err?.name || '';
            if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
                addMessage('error', 'Permiso de micrófono denegado. Actívalo en el candado de la barra de direcciones.', { persist: false });
            } else if (name === 'NotFoundError') {
                addMessage('error', 'No se detectó micrófono. Conecta uno e intenta de nuevo.', { persist: false });
            }
            return false;
        }
    }

    function createRecognitionInstance() {
        if (!sttSupported) return null;
        const rec = new SpeechRecognitionCtor();
        rec.lang = 'es-MX';
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 3;

        rec.onresult = (event) => {
            let interim = '';
            let finalText = '';
            for (let i = 0; i < event.results.length; i++) {
                const piece = event.results[i][0]?.transcript || '';
                if (event.results[i].isFinal) {
                    finalText += piece;
                } else {
                    interim += piece;
                }
            }
            voiceFinalTranscript = finalText;
            voiceInterimTranscript = interim;
            const input = document.getElementById('ai-input');
            const combined = (finalText + interim).trim();
            if (input) input.value = combined;
            if (combined) {
                resetSilenceTimer();
                setListeningUi(true, 'Escuchando…');
            }
        };

        rec.onspeechstart = () => {
            resetSilenceTimer();
            setListeningUi(true, 'Escuchando…');
        };

        rec.onspeechend = () => {
            setListeningUi(true, 'Procesando audio…');
        };

        rec.onerror = (event) => handleRecognitionError(event);
        rec.onend = () => handleRecognitionEnd();

        return rec;
    }

    function handleRecognitionError(event) {
        const code = event?.error || '';
        if (code === 'aborted') return;

        if (code === 'no-speech' && isListening) {
            setListeningUi(true, 'Sigo escuchando…');
            setTimeout(() => {
                if (isListening) startRecognitionEngine(true);
            }, RESTART_DELAY_MS);
            return;
        }

        const now = Date.now();
        if ((code === 'network' || code === 'service-not-allowed') && voiceRetryCount < VOICE_RETRY_MAX && isListening) {
            voiceRetryCount += 1;
            setListeningUi(true, `Reconectando (${voiceRetryCount}/${VOICE_RETRY_MAX})…`);
            recognition = null;
            setTimeout(() => {
                if (isListening) startRecognitionEngine(true);
            }, 700 + voiceRetryCount * 300);
            return;
        }

        if (!isListening) return;

        isListening = false;
        clearSilenceTimer();
        clearListenMaxTimer();
        setListeningUi(false);
        releaseMicStream();

        if (now - lastVoiceErrorShown < 3500) return;
        lastVoiceErrorShown = now;

        const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(window.location.origin);
        let msg = '';
        if (code === 'not-allowed') {
            msg = 'Permiso de micrófono denegado.';
            micPermissionGranted = false;
        } else if (code === 'network') {
            msg = isLocal
                ? 'Voz: necesitas internet y Chrome/Edge. También puedes escribir tu mensaje.'
                : 'Sin conexión al servicio de voz. Revisa tu internet.';
        } else if (code === 'audio-capture') {
            msg = 'No se capturó audio. Revisa el micrófono.';
        } else {
            msg = 'Problema con el micrófono. Intenta de nuevo o escribe el mensaje.';
        }
        addMessage('system', msg, { persist: false });
    }

    function handleRecognitionEnd() {
        if (isListening) {
            setListeningUi(true, 'Sigo escuchando…');
            setTimeout(() => {
                if (!isListening) return;
                try {
                    recognition.start();
                } catch (_) {
                    startRecognitionEngine(true);
                }
            }, RESTART_DELAY_MS);
            return;
        }
        finalizeVoiceInput(voiceSendOnEnd);
    }

    function finalizeVoiceInput(shouldSend) {
        if (voiceFinalizing) return;
        voiceFinalizing = true;
        setTimeout(() => { voiceFinalizing = false; }, 500);

        isListening = false;
        clearSilenceTimer();
        clearListenMaxTimer();
        setListeningUi(false);
        releaseMicStream();
        voiceRetryCount = 0;
        const send = voiceSendOnEnd;
        voiceSendOnEnd = false;

        const input = document.getElementById('ai-input');
        const text = (voiceFinalTranscript + voiceInterimTranscript).trim() || (input?.value || '').trim();
        voiceFinalTranscript = '';
        voiceInterimTranscript = '';

        if (input && text) input.value = text;

        if (send && text) {
            playSoftTone('end');
            setAssistantState('processing');
            showListeningBar(true, 'Procesando…');
            setTimeout(() => {
                showListeningBar(false);
                sendMessage(text);
            }, 280);
        }
    }

    function startRecognitionEngine(isRetry) {
        if (!sttSupported || !isListening) return;
        if (!recognition || isRetry) {
            try {
                if (recognition) {
                    try { recognition.abort(); } catch (_) {}
                }
            } catch (_) {}
            recognition = createRecognitionInstance();
        }
        if (!recognition) return;

        try {
            recognition.start();
        } catch (err) {
            if (String(err).includes('already started')) return;
            setTimeout(() => {
                if (!isListening) return;
                try { recognition.start(); } catch (_) {
                    isListening = false;
                    setListeningUi(false);
                }
            }, RESTART_DELAY_MS);
        }
    }

    async function startListening() {
        if (isListening) return;
        const sendBtn = document.getElementById('ai-send');
        if (sendBtn?.disabled) return;

        if (!sttSupported) {
            addMessage('system', 'Usa Chrome o Edge para reconocimiento de voz.', { persist: false });
            return;
        }

        const ok = await ensureMicPermission();
        if (!ok) return;

        voiceFinalTranscript = '';
        voiceInterimTranscript = '';
        voiceRetryCount = 0;
        voiceSendOnEnd = false;
        const input = document.getElementById('ai-input');
        if (input) input.value = '';

        isListening = true;
        playSoftTone('start');
        setListeningUi(true, 'Escuchando… Habla con naturalidad');
        startRecognitionEngine(false);

        clearListenMaxTimer();
        listenMaxTimerId = setTimeout(() => {
            if (isListening) stopListening(true);
        }, MAX_LISTEN_MS);

        clearSilenceTimer();
        silenceTimerId = setTimeout(() => {
            if (isListening && !(voiceFinalTranscript + voiceInterimTranscript).trim()) {
                setListeningUi(true, 'No te escuché. Sigue hablando…');
            }
        }, INITIAL_SPEECH_WAIT_MS);
    }

    function stopListening(shouldSend) {
        voiceSendOnEnd = !!shouldSend;
        if (!isListening && !shouldSend) return;

        isListening = false;
        clearSilenceTimer();
        clearListenMaxTimer();
        setListeningUi(false);

        if (recognition) {
            try {
                recognition.stop();
            } catch (_) {
                finalizeVoiceInput(shouldSend);
            }
        } else {
            finalizeVoiceInput(shouldSend);
        }
    }

    function toggleListening() {
        if (isListening) {
            stopListening(true);
        } else {
            startListening();
        }
    }

    function initVoiceControls() {
        if (voiceControlsInitialized) return;
        voiceControlsInitialized = true;

        ttsEnabled = loadTtsEnabled();
        updateTtsToggleUi();

        if (ttsSupported) {
            const loadVoices = () => pickSpanishVoice();
            window.speechSynthesis.getVoices();
            window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        }

        const toggleBtn = document.getElementById('ai-voice-toggle');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                ttsEnabled = !ttsEnabled;
                saveTtsEnabled(ttsEnabled);
                updateTtsToggleUi();
                if (!ttsEnabled && ttsSupported) window.speechSynthesis.cancel();
            };
        }

        const voiceBtn = document.getElementById('ai-voice');
        if (!voiceBtn) return;

        if (!sttSupported) {
            voiceBtn.disabled = true;
            voiceBtn.title = 'Voz no disponible en este navegador';
            return;
        }

        voiceBtn.title = 'Toca para hablar · Vuelve a tocar para enviar · O espera unos segundos en silencio';
        voiceBtn.setAttribute('aria-label', 'Micrófono');
        voiceBtn.onclick = (e) => {
            e.preventDefault();
            toggleListening();
        };
    }

    function linkStylesheet() {
        if (document.querySelector(`link[href="${CSS_URL}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CSS_URL;
        document.head.appendChild(link);
    }

    function createWidget() {
        const existingFab = document.getElementById(FAB_ID);
        const existingPanel = document.getElementById(PANEL_ID);
        if (existingFab && existingPanel) return;

        if (existingFab && !existingPanel) existingFab.remove();
        if (!existingFab && existingPanel) existingPanel.remove();

        voiceControlsInitialized = false;
        linkStylesheet();

        const fab = document.createElement('button');
        fab.id = FAB_ID;
        fab.type = 'button';
        fab.className = 'ai-fab-pulse';
        fab.setAttribute('aria-label', 'Abrir asistente');
        fab.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v1.1A7.002 7.002 0 0 0 5 12.1V14a2 2 0 0 0 2 2h1v2.9a2 2 0 0 0 3.45 1.4L13 18h2l1.55 2.3A2 2 0 0 0 20 18.9V16h1a2 2 0 0 0 2-2v-1.9A7.002 7.002 0 0 0 15 6.1V5a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v1.2l.4.1A5 5 0 0 1 17 12.1V14h-1v3.1l-1.2-1.8-.3-.3H9.5l-.3.3L8 17.1V14H7v-1.9a5 5 0 0 1 3.6-4.7l.4-.1V5a1 1 0 0 1 1-1z"/></svg>`;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Asistente PSICEI');
        panel.innerHTML = `
            <div id="ai-panel-header">
                <div class="ai-header-top">
                    <div class="ai-header-brand">
                        <div class="ai-header-avatar" aria-hidden="true">🎓</div>
                        <div>
                            <div class="ai-header-title">Asistente PSICEI</div>
                            <div class="ai-header-sub">TESJo · Asistente institucional</div>
                        </div>
                    </div>
                    <div class="ai-header-actions">
                        <button type="button" id="ai-voice-toggle" class="ai-header-btn" title="Voz de respuestas" aria-label="Alternar voz">🔊</button>
                        <button type="button" id="ai-min" class="ai-header-btn" title="Minimizar" aria-label="Minimizar">−</button>
                        <button type="button" id="ai-close" class="ai-header-btn" title="Cerrar chat" aria-label="Cerrar">×</button>
                    </div>
                </div>
                <div id="ai-context-chip" title="Módulo actual">Sistema PSICEI</div>
            </div>
            <div id="ai-listening-bar">
                <div class="ai-voice-waves" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
                <span class="ai-listening-label" id="ai-listening-text">Escuchando…</span>
            </div>
            <div id="ai-messages" role="log" aria-live="polite"></div>
            <div id="ai-input-area">
                <textarea id="ai-input" rows="1" placeholder="Escribe o usa el micrófono…"></textarea>
                <button type="button" id="ai-voice" class="ai-voice-btn" aria-label="Micrófono">🎤</button>
                <button type="button" id="ai-send">Enviar</button>
            </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        panel.style.display = 'none';

        fab.onclick = () => {
            const open = panel.style.display === 'flex';
            panel.style.display = open ? 'none' : 'flex';
            if (!open) {
                updateContextChip();
                document.getElementById('ai-input')?.focus();
            }
        };

        document.getElementById('ai-min').onclick = () => { panel.style.display = 'none'; };
        document.getElementById('ai-close').onclick = () => clearChat(panel);

        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        sendBtn.onclick = () => sendMessage();
        initVoiceControls();
        updateContextChip();

        (async () => {
            await hydrateContextFromServer();
            updateContextChip();
            const restored = await restoreChatHistory();
            if (!restored) {
                showWelcomeMessage();
            }
        })();
    }

    function showWelcomeMessage() {
        const nav = getNavigationContext();
        const module = nav.module_name || 'el sistema';
        let text = `Hola, soy tu asistente institucional de PSICEI.\n\n`;
        if (nav.module_name) {
            text += `Estás en **${nav.module_name}**`;
            if (nav.section_name && nav.section_name !== nav.module_name) {
                text += `, dentro de ${nav.section_name}`;
            }
            text += '. ';
            if (nav.active_tab) text += `Pestaña activa: ${nav.active_tab}. `;
            if (nav.description) text += nav.description.split('Pestaña activa')[0].trim() + '\n\n';
            else text += '\n\n';
        }
        text += `Puedo ayudarte con:\n• Saber en qué pantalla estás\n• Abrir módulos ("ir a servicio social")\n• Ver historial de registros\n• Descargar PDF o Excel\n• Generar y guardar datos\n\nDi un comando o usa el micrófono. ¿En qué te ayudo?`;
        addMessage('bot', text.replace(/\*\*/g, ''));
    }

    function ensureWidgetPresence() {
        if (!document.getElementById(FAB_ID) || !document.getElementById(PANEL_ID)) {
            createWidget();
        }
    }

    let fabObserverStarted = false;
    function startFabObserver() {
        if (fabObserverStarted || !document.body) return;
        fabObserverStarted = true;
        if (typeof MutationObserver === 'undefined') return;
        new MutationObserver(() => ensureWidgetPresence()).observe(document.body, { childList: true, subtree: true });
    }

    function addMessage(type, text, options = {}) {
        const container = document.getElementById('ai-messages');
        if (!container) return null;

        const row = document.createElement('div');
        row.className = `ai-msg-row ${type === 'user' ? 'user' : type}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        bubble.textContent = String(text || '');
        row.appendChild(bubble);
        container.appendChild(row);
        scrollMessagesToBottom();

        if (options.persist !== false) {
            const role = type === 'user' ? 'user' : 'assistant';
            const history = loadLocalHistory();
            history.push({ role, text: String(text || '') });
            saveLocalHistory(history);
        }

        return row;
    }

    function showTypingIndicator(label) {
        hideTypingIndicator();
        setAssistantState('thinking');
        showListeningBar(true, label || 'Pensando…');
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'ai-msg-row bot';
        row.id = 'ai-typing-row';
        row.innerHTML = `<div class="ai-typing-bubble" aria-label="${(label || 'Pensando').replace(/"/g, '')}"><span></span><span></span><span></span></div>`;
        container.appendChild(row);
        typingEl = row;
        scrollMessagesToBottom();
    }

    function hideTypingIndicator() {
        if (typingEl) {
            typingEl.remove();
            typingEl = null;
        }
        document.getElementById('ai-typing-row')?.remove();
        showListeningBar(false);
        if (assistantState === 'thinking') setAssistantState('idle');
    }

    function getTableHeaders() {
        const headers = [];
        document.querySelectorAll('table th').forEach((th) => {
            const t = th.textContent.trim();
            if (t && th.colSpan <= 1 && !['Datos', 'Cantidad', 'Actualizar'].includes(t)) {
                headers.push(t);
            }
        });
        return [...new Set(headers)];
    }

    const MODULE_PATH_CATALOG = [
        { match: 'alumnoseventos', module: 'Alumnos en eventos académicos', section: 'Departamento de Desarrollo Académico', description: 'Registro de participación estudiantil en eventos académicos por programa.' },
        { match: 'evaluaciond', module: 'Evaluación Docente', section: 'Departamento de Desarrollo Académico', description: 'Registro, seguimiento y reporte del desempeño docente por programa académico.' },
        { match: 'capacitadoc', module: 'Capacitación personal docente', section: 'Departamento de Desarrollo Académico', description: 'Registro de cursos, diplomados y capacitación del personal docente.' },
        { match: 'telehard', module: 'Telecomunicaciones de hardware', section: 'Centro de Cómputo', description: 'Inventario de equipos y hardware de telecomunicaciones.' },
        { match: 'telesof', module: 'Telecomunicaciones de software', section: 'Centro de Cómputo', description: 'Licencias de software usado y desarrollado.' },
        { match: 'recursos', module: 'Recursos informáticos', section: 'Centro de Cómputo', description: 'Control de recursos informáticos institucionales.' },
        { match: 'proyinv', module: 'Proyecto de investigación', section: 'Investigación en Ciencias y Tecnología', description: 'Seguimiento de proyectos de investigación institucional.' },
        { match: 'plantinv', module: 'Plantilla de investigadores S20-F21', section: 'Investigación en Ciencias y Tecnología', description: 'Docentes-investigadores y horas asignadas a investigación.' },
        { match: 'activdep', module: 'Actividades deportivas', section: 'Actividades Extraescolares', description: 'Inscripción y participación en talleres y selecciones deportivas.' },
        { match: 'activcul', module: 'Actividades culturales', section: 'Actividades Extraescolares', description: 'Talleres culturales y expresión artística estudiantil.' },
        { match: 'cursoseducacioncontinua', module: 'Cursos de educación continua', section: 'Educación Continua y a Distancia', description: 'Cursos cortos, diplomados, seminarios y talleres.' },
        { match: 'proyectosvinculacion', module: 'Proyecto de vinculación', section: 'Educación Continua y a Distancia', description: 'Proyectos de vinculación con sectores productivos y sociales.' },
        { match: 'capacitaciondoc', module: 'Capacitación de personal docente', section: 'Coordinación de Difusión', description: 'Capacitación docente coordinada por Difusión.' },
        { match: 'personaldirectivo', module: 'Capacitación personal directivo y administrativo', section: 'Coordinación de Difusión', description: 'Capacitación del personal directivo y administrativo.' },
        { match: 'residenciaprofesional', module: 'Residencia Profesional', section: 'Servicio Social y Residencia Profesional', description: 'Seguimiento y captura de información de residencias profesionales.' },
        { match: 'serviciosocial', module: 'Servicio Social', section: 'Servicio Social y Residencia Profesional', description: 'Gestión de registros y reportes de servicio social.' },
        { match: 'serviciocomunidad', module: 'Servicio a la Comunidad', section: 'Servicio Social y Residencia Profesional', description: 'Actividades de servicio a la comunidad.' },
        { match: 'deptoser', module: 'Departamento de Servicio Social y Residencia Profesional', section: 'Dirección de Vinculación y Extensión', description: 'Acceso al departamento y subáreas.' },
        { match: '135unibiblioteca', module: 'Biblioteca', section: 'Dirección de Vinculación y Extensión', description: 'Información y capturas de biblioteca.' },
        { match: 'coordinaciondifucion', module: 'Coordinación de Difusión', section: 'Dirección de Vinculación y Extensión', description: 'Difusión y comunicación institucional.' },
        { match: '131deptodesacad', module: 'Departamento de Desarrollo Académico', section: 'Dirección Académica', description: 'Evaluación docente, eventos académicos y capacitación docente.' },
        { match: '132deptocencomp', module: 'Centro de Cómputo', section: 'Dirección Académica', description: 'Telecomunicaciones, hardware, software y recursos informáticos.' },
        { match: '133deptoinvcientec', module: 'Departamento de Investigación en Ciencias y Tecnología', section: 'Dirección Académica', description: 'Proyectos de investigación, plantilla SNII e innovación.' },
        { match: 'subdireccionextencion', module: 'Subdirección de Extensión', section: 'Dirección de Vinculación y Extensión', description: 'Actividades extraescolares y educación continua.' },
        { match: 'portal.php', module: 'Menú principal', section: 'Portal', description: 'Navegación central del sistema.' },
        { match: 'home.php', module: 'Inicio', section: 'Bienvenida', description: 'Pantalla de bienvenida.' },
        { match: 'admin_home.php', module: 'Panel administrador', section: 'Administración', description: 'Gestión de usuarios.' },
        { match: 'dashboard.php', module: 'Resumen general', section: 'Consultas', description: 'Estadísticas de tu área.' },
        { match: 'records_history.php', module: 'Historial de registros', section: 'Consultas', description: 'Registros guardados.' },
        { match: 'contactos.php', module: 'Contactos', section: 'Consultas', description: 'Directorio de contactos.' },
        { match: 'estadisticas.php', module: 'Estadísticas', section: 'Consultas', description: 'Gráficas e indicadores.' }
    ];

    function normalizePathKey(path) {
        return String(path || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    }

    function pathSegments(pathname) {
        return String(pathname || '')
            .toLowerCase()
            .split('/')
            .map((part) => part.replace(/[^a-z0-9]+/g, ''))
            .filter(Boolean);
    }

    function resolveModuleFromPath(pathname) {
        const key = normalizePathKey(pathname);
        const segments = pathSegments(pathname);
        let best = null;
        let bestScore = -1;
        for (const entry of MODULE_PATH_CATALOG) {
            const mk = normalizePathKey(entry.match);
            if (!mk) continue;
            let score = -1;
            segments.forEach((seg, idx) => {
                if (seg === mk) score = Math.max(score, 100000 + (idx * 1000) + mk.length);
                else if (seg.includes(mk)) score = Math.max(score, 50000 + (idx * 1000) + mk.length);
            });
            if (score < 0 && key.includes(mk)) score = mk.length;
            if (score > bestScore) {
                best = entry;
                bestScore = score;
            }
        }
        if (!best) return { module_name: '', section_name: '', description: '' };
        return { module_name: best.module, section_name: best.section, description: best.description };
    }

    function getActiveSidebarLabel() {
        return document.querySelector('.ed-aside__link.is-active span')?.textContent?.trim()
            || document.querySelector('.sidebar-link.is-active span')?.textContent?.trim()
            || '';
    }

    function getActiveTabLabel() {
        return document.querySelector('.ed-tab.is-active')?.textContent?.replace(/\s+/g, ' ').trim() || '';
    }

    function getVisiblePageHeading() {
        if (window.ED_CONFIG?.title) return String(window.ED_CONFIG.title).trim();
        return document.querySelector('.ed-header__info h1')?.textContent?.trim()
            || document.querySelector('.portal-main-header h1')?.textContent?.trim()
            || document.querySelector('.module-hero h1')?.textContent?.trim()
            || document.querySelector('.ps-hero h1, .ps-hero h2, .hero h1')?.textContent?.trim()
            || document.querySelector('.left-panel h1')?.textContent?.trim()
            || '';
    }

    function getModernUiContext() {
        const cfg = window.ED_CONFIG || {};
        const h1 = document.querySelector('.ed-header__info h1')?.textContent?.trim();
        const subtitle = cfg.subtitle
            || document.querySelector('.ed-header__info p')?.textContent?.trim()
            || '';
        const breadcrumbRaw = cfg.breadcrumb
            || document.querySelector('.ed-breadcrumb')?.textContent?.trim()
            || '';
        const parts = breadcrumbRaw.split('/').map((s) => s.trim()).filter(Boolean);
        if (!h1 && !cfg.title) return null;
        return {
            module_name: cfg.title || h1,
            section_name: parts[0] || '',
            department: parts[0] || '',
            description: subtitle,
            active_tab: getActiveTabLabel(),
            ui_type: 'modulo_sicei_moderno'
        };
    }

    function buildBreadcrumb() {
        const crumbs = [];
        const edCrumb = document.querySelector('.ed-breadcrumb')?.textContent?.trim();
        if (edCrumb) {
            edCrumb.split('/').forEach((part) => {
                const t = part.trim();
                if (t && !crumbs.includes(t)) crumbs.push(t);
            });
        }
        const active = getActiveSidebarLabel();
        if (active && !crumbs.includes(active)) crumbs.push(active);
        document.querySelectorAll('.sidebar-section-title').forEach((el) => {
            const t = el.textContent?.trim();
            if (t && !crumbs.includes(t)) crumbs.unshift(t);
        });
        const sec = document.body?.dataset?.currentSection;
        if (sec && !crumbs.includes(sec)) crumbs.unshift(sec);
        return crumbs;
    }

    function getNavigationContext() {
        const pathname = window.location.pathname || '';
        const fromPath = resolveModuleFromPath(pathname);
        const body = document.body?.dataset || {};
        const modern = getModernUiContext();
        const sidebarActive = getActiveSidebarLabel();
        const visibleHeading = getVisiblePageHeading();
        const activeTab = getActiveTabLabel();

        let moduleName = modern?.module_name || body.currentModule || visibleHeading || sidebarActive || fromPath.module_name;
        moduleName = String(moduleName || (document.title || '').replace(/\s*(—|-)\s*SICEI.*$/i, '').trim()).trim();

        let sectionName = modern?.section_name || body.currentSection || fromPath.section_name || '';
        if (!sectionName && modern?.department) sectionName = modern.department;

        let description = modern?.description || body.currentModuleDescription || fromPath.description || '';
        if (activeTab) description = (description ? description + ' ' : '') + `Pestaña activa: ${activeTab}.`;

        return {
            pathname,
            url: window.location.href || '',
            page_title: (document.title || '').replace(/\s*(—|-)\s*SICEI.*$/i, '').trim(),
            module_name: moduleName,
            section_name: String(sectionName).trim(),
            department: modern?.department || String(sectionName).trim(),
            description: String(description).trim(),
            sidebar_active: sidebarActive || moduleName,
            active_tab: activeTab,
            ui_type: modern?.ui_type || (document.querySelector('.ed-app') ? 'modulo_sicei_moderno' : 'portal'),
            breadcrumb: buildBreadcrumb(),
            screen_summary: [
                moduleName,
                sectionName,
                activeTab ? `pestaña ${activeTab}` : ''
            ].filter(Boolean).join(' · ')
        };
    }

    function getPageContext() {
        const n = getNavigationContext();
        return n.module_name || n.page_title || document.title;
    }

    function getUserContext() {
        const body = document.body || {};
        return {
            area: body.dataset?.userArea || '',
            subarea: body.dataset?.userSubarea || '',
            role: body.dataset?.userRole || 'user',
            usuario: body.dataset?.userName || ''
        };
    }

    async function hydrateContextFromServer() {
        const ctx = getUserContext();
        if (ctx.area && ctx.role) return ctx;
        try {
            const res = await fetch(USER_CONTEXT_URL, { credentials: 'same-origin' });
            const data = await res.json();
            if (!data.error) {
                document.body.dataset.userArea = data.area || '';
                document.body.dataset.userSubarea = data.subarea || '';
                document.body.dataset.userRole = data.role || 'user';
                document.body.dataset.userName = data.usuario || '';
            }
        } catch (_) {}
        return getUserContext();
    }

    async function restoreChatHistory() {
        const local = loadLocalHistory();
        if (local.length) {
            const container = document.getElementById('ai-messages');
            if (container) container.innerHTML = '';
            local.forEach((h) => addMessage(h.role === 'user' ? 'user' : 'bot', h.text, { persist: false }));
            return true;
        }
        try {
            const res = await fetch(CHAT_HISTORY_URL, { credentials: 'same-origin' });
            const data = await res.json();
            if (data?.history?.length) {
                const container = document.getElementById('ai-messages');
                if (container) container.innerHTML = '';
                data.history.forEach((h) => addMessage(h.role === 'user' ? 'user' : 'bot', h.text, { persist: false }));
                saveLocalHistory(data.history.map((h) => ({ role: h.role, text: h.text })));
                return true;
            }
        } catch (_) {}
        return false;
    }

    async function clearChat(panel) {
        if (ttsSupported) window.speechSynthesis.cancel();
        if (isListening) stopListening(false);
        releaseMicStream();
        try { localStorage.removeItem(storageKey()); } catch (_) {}
        try { await fetch(CLEAR_CHAT_URL, { method: 'POST', credentials: 'same-origin' }); } catch (_) {}
        const container = document.getElementById('ai-messages');
        if (container) container.innerHTML = '';
        if (panel) panel.style.display = 'none';
    }

    function fillTable(data, mode = 'append') {
        const tbody = document.getElementById('tbody') || document.querySelector('tbody#tablaCuerpo') || document.querySelector('tbody');
        if (!tbody) {
            addMessage('error', 'No se encontró tabla para llenar.');
            return 0;
        }
        if (mode === 'replace') tbody.innerHTML = '';
        let count = 0;
        if (Array.isArray(data)) {
            data.forEach((row) => {
                const tr = document.createElement('tr');
                const values = typeof row === 'object' && !Array.isArray(row) ? Object.values(row) : (Array.isArray(row) ? row : [row]);
                values.forEach((val) => {
                    const td = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = val || '';
                    input.style.cssText = 'width:100%;padding:6px;border:1px solid #ddd;border-radius:6px;';
                    td.appendChild(input);
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
                count++;
            });
        }
        return count;
    }

    function executeAction(payload) {
        const action = typeof payload === 'string' ? payload : (payload?.action || '');
        const url = payload?.url || '';
        const mod = payload?.module || '';

        if (action === 'clear') {
            const tbody = document.getElementById('tbody') || document.querySelector('tbody');
            if (tbody) { tbody.innerHTML = ''; return Promise.resolve(true); }
            return Promise.resolve(false);
        }
        if (action === 'save') return saveCurrentTable();
        if (action === 'download_excel') return downloadRecords('excel', mod);
        if (action === 'download_pdf') return downloadRecords('pdf', mod);
        if ((action === 'open_url' || url) && url) {
            window.location.href = url;
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    function extractTableRows() {
        const rows = [];
        document.querySelectorAll('tbody tr').forEach((tr) => {
            const row = {};
            const inputs = tr.querySelectorAll('input, select, textarea');
            if (inputs.length) {
                inputs.forEach((el, idx) => { row[`col_${idx + 1}`] = el.value ?? ''; });
            } else {
                tr.querySelectorAll('td').forEach((td, idx) => { row[`col_${idx + 1}`] = td.textContent?.trim() || ''; });
            }
            if (Object.keys(row).length) rows.push(row);
        });
        return rows;
    }

    async function saveCurrentTable() {
        const rows = extractTableRows();
        if (!rows.length) return false;
        const res = await fetch(`${RECORDS_API_URL}?action=save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module: getPageContext(), rows })
        });
        const data = await res.json();
        if (data.error) { addMessage('error', data.error); return false; }
        return true;
    }

    function downloadRecords(type, moduleOverride) {
        const area = encodeURIComponent(getUserContext().area || '');
        const module = encodeURIComponent(moduleOverride || getPageContext());
        window.open(`${RECORDS_API_URL}?action=export&type=${type}&area=${area}&module=${module}`, '_blank');
        return Promise.resolve(true);
    }

    async function sendMessage(textOverride) {
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const voiceBtn = document.getElementById('ai-voice');
        const panel = document.getElementById(PANEL_ID);
        const prompt = (typeof textOverride === 'string' ? textOverride : (input?.value || '')).trim();

        if (isListening) stopListening(false);
        if (!prompt) return;

        updateContextChip();
        addMessage('user', prompt);
        if (input) { input.value = ''; input.style.height = 'auto'; }

        sendBtn.disabled = true;
        if (voiceBtn) voiceBtn.disabled = true;
        if (panel) panel.classList.add('ai-panel-busy');

        setAssistantState('processing');
        showListeningBar(true, 'Procesando…');
        showTypingIndicator('Pensando…');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    headers: getTableHeaders(),
                    page_context: getPageContext(),
                    navigation_context: getNavigationContext(),
                    user_context: getUserContext()
                })
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data.error) {
                addMessage('error', data.message ? `${data.error}\n${data.message}` : data.error);
                return;
            }

            const result = data.result;

            if (result?.action || result?.url) {
                const payload = result;
                if (result.message) {
                    addMessage('bot', result.message);
                    speakText(result.message);
                }
                const success = await executeAction(payload);
                if (!result.message) {
                    if (success && result.url) {
                        addMessage('success', 'Te llevo al módulo solicitado…');
                    } else {
                        const label = typeof result.action === 'string' ? result.action : 'acción';
                        addMessage(success ? 'success' : 'error', success ? `Listo: ${label} ejecutada.` : `No se pudo completar la acción.`);
                    }
                }
                return;
            }

            if (result?.message) {
                addMessage('bot', result.message);
                speakText(result.message);
                return;
            }

            if (Array.isArray(result)) {
                const lower = prompt.toLowerCase();
                const replaceMode = lower.includes('editar') || lower.includes('reemplaza');
                const count = fillTable(result, replaceMode ? 'replace' : 'append');
                addMessage('success', `${replaceMode ? 'Se reemplazaron' : 'Se agregaron'} ${count} fila(s) en la tabla.`);
            } else if (result) {
                addMessage('bot', JSON.stringify(result));
            }
        } catch (err) {
            hideTypingIndicator();
            addMessage('error', 'Error de conexión: ' + err.message);
        } finally {
            sendBtn.disabled = false;
            if (voiceBtn) voiceBtn.disabled = !sttSupported;
            if (panel) panel.classList.remove('ai-panel-busy');
            if (input) input.focus();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createWidget();
            ensureWidgetPresence();
            startFabObserver();
        });
    } else {
        createWidget();
        ensureWidgetPresence();
        startFabObserver();
    }
})();
