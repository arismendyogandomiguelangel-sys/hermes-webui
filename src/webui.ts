/**
 * WebUI nativa para AliHas (Amo de Llaves)
 * Incluye Navegación Dual con 2 Pestañas:
 *   1. 💬 Hermes WebUI (Chat 3-Paneles + HUD + Controles de Voz AhíSentido + Real API LLM)
 *   2. 📊 ContextALL Observability (Dashboard Live + Grafos + Métricas)
 */

export const ALIHAS_WEBUI_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AliHas OS — Amo de Llaves</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #f4f4f5; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .larimar-glow { box-shadow: 0 0 25px rgba(56, 232, 198, 0.25); }
    .larimar-text { color: #38e8c6; }
    .larimar-bg { background-color: #38e8c6; }
    .larimar-border { border-color: rgba(56, 232, 198, 0.3); }
    .node-module { background-color: #a855f7; }
    .node-file { background-color: #06b6d4; }
    .node-table { background-color: #f97316; }
    .node-agent { background-color: #22c55e; }
  </style>
</head>
<body class="h-screen flex flex-col overflow-hidden bg-zinc-950 text-zinc-200">

  <!-- TOP HEADER & TAB NAVIGATION -->
  <header class="h-14 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 flex items-center justify-between z-20">
    <div class="flex items-center gap-3">
      <div class="w-3 h-3 rounded-full larimar-bg animate-pulse shadow-[0_0_12px_#38e8c6]"></div>
      <div>
        <h1 class="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
          AliHas OS <span class="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded font-mono">v2.0 Amo de Llaves</span>
        </h1>
        <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Inteligencia Humana Aumentada · ALiHaneD</p>
      </div>
    </div>

    <!-- TABS BUTTONS -->
    <nav class="flex items-center gap-1 bg-zinc-950 p-1 border border-zinc-800 rounded-lg">
      <button id="tab-hermes-btn" onclick="switchTab('hermes')" class="px-4 py-1.5 rounded-md text-xs font-medium transition-all bg-zinc-800 text-white shadow-sm flex items-center gap-2">
        <span>💬</span> <span>Hermes WebUI (Alfred)</span>
      </button>
      <button id="tab-contextall-btn" onclick="switchTab('contextall')" class="px-4 py-1.5 rounded-md text-xs font-medium transition-all text-zinc-400 hover:text-white flex items-center gap-2">
        <span>📊</span> <span>ContextALL Observability</span>
      </button>
    </nav>

    <!-- STATUS & SYSTEM INFO -->
    <div class="flex items-center gap-3 text-xs">
      <div class="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="text-zinc-400 font-mono text-[11px]">Jarvis Armor: ON</span>
      </div>
      <div class="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
        <span class="text-zinc-400 font-mono text-[11px]">Dokploy Live</span>
      </div>
    </div>
  </header>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 relative overflow-hidden">

    <!-- ==================== PESTAÑA 1: HERMES WEBUI ==================== -->
    <section id="tab-hermes" class="h-full flex">
      <!-- PANEL IZQUIERDO: SESIONES & NAVEGACIÓN -->
      <aside class="w-64 border-r border-zinc-800 bg-zinc-900/40 p-3 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">Sesiones & Proyectos</div>
          <button onclick="newSession()" class="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium text-left flex items-center justify-between border border-zinc-700/50">
            <span>+ Nueva Sesión</span>
            <span class="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400">Ctrl+N</span>
          </button>
          
          <div class="space-y-1">
            <div class="p-2 bg-zinc-800/60 rounded-md border border-zinc-700/40 text-xs text-white flex items-center gap-2 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="truncate">Junta Directiva & Ecosistema</span>
            </div>
            <div class="p-2 hover:bg-zinc-800/30 rounded-md text-xs text-zinc-400 flex items-center gap-2 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-zinc-600"></span>
              <span class="truncate">Auditoría SmartERP</span>
            </div>
            <div class="p-2 hover:bg-zinc-800/30 rounded-md text-xs text-zinc-400 flex items-center gap-2 cursor-pointer">
              <span class="w-2 h-2 rounded-full bg-zinc-600"></span>
              <span class="truncate">Configuración Draimer</span>
            </div>
          </div>
        </div>

        <!-- ROLES Y MODELOS FOOTER -->
        <div class="pt-3 border-t border-zinc-800 space-y-2 text-xs">
          <div class="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Traje / Modelo Profesional</div>
          <select id="role-select" class="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-xs text-zinc-300">
            <option value="auto">👔 Auto (Agent Tor)</option>
            <option value="asistente">🤵 Asistente Personal</option>
            <option value="estrategia">🧠 Estratega de Negocio</option>
            <option value="fullstack">⚡ Full Stack Developer</option>
            <option value="arquitecto">🏗️ Arquitecto de Software</option>
            <option value="cloud">☁️ Cloud Engineer (Oracle/AWS)</option>
            <option value="contador">📊 Contador / Finanzas</option>
          </select>
        </div>
      </aside>

      <!-- PANEL CENTRAL: CHAT CON ALIAS (ALFRED) -->
      <main class="flex-1 flex flex-col bg-zinc-950">
        <!-- CHAT MESSAGES CONTAINER -->
        <div id="chat-messages" class="flex-1 p-6 overflow-y-auto space-y-4">
          <!-- WELCOME MESSAGE CARD -->
          <div class="max-w-2xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                🎩
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">AliHas — Amo de Llaves</h3>
                <p class="text-xs text-zinc-400">Representante Digital de Miguel A. Arismendy</p>
              </div>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">
              Saludos. Estoy listo como tu Amo de Llaves. Tengo la armadura de Neurogestor conectada, monitoreo live con ContextALL y entrada sensorial con AhíSentido. ¿En qué te asisto hoy?
            </p>
          </div>
        </div>

        <!-- CHAT INPUT COMPOSER WITH CONTROLS -->
        <div class="p-4 border-t border-zinc-800 bg-zinc-900/50 space-y-3">
          <div class="flex items-center gap-2">
            <input id="user-input" type="text" placeholder="Escribe un mensaje a AliHas o ejecuta /zumo, /corredor..." 
                   onkeydown="if(event.key==='Enter') sendChatMessage()"
                   class="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors">
            
            <button id="send-btn" onclick="sendChatMessage()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-1">
              <span>Enviar</span>
            </button>
          </div>

          <!-- AUDIO & SENSORY CONTROLS (AHÍSENTIDO / LIVEKIT) -->
          <div class="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <div class="flex items-center gap-3">
              <button onclick="alert('Conectando canal de voz de AhíSentido...')" class="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded flex items-center gap-1.5 border border-zinc-700/50">
                <span>🎙️</span> <span>AhíSentido Voz Live</span>
              </button>
              <button onclick="alert('Captura de pantalla activa.')" class="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded flex items-center gap-1.5 border border-zinc-700/50">
                <span>👁️</span> <span>Visión Pantalla</span>
              </button>
            </div>
            <div class="mono text-[10px] text-zinc-500" id="token-counter">
              Tokens: 1,420 / 128,000 (Ring OK)
            </div>
          </div>
        </div>
      </main>

      <!-- PANEL DERECHO: EXPLORADOR DE WORKSPACE & ARCHIVOS -->
      <aside class="w-72 border-l border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
        <div class="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase border-b border-zinc-800 pb-2">
          Workspace Files & Context
        </div>
        <div class="space-y-2 text-xs">
          <div class="p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-[11px] text-zinc-300 hover:border-emerald-500 cursor-pointer">
            📄 ALIHAS_IDENTITY.md
          </div>
          <div class="p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-[11px] text-zinc-300 hover:border-emerald-500 cursor-pointer">
            📄 alihaned-matriz-herramientas-agentes.md
          </div>
          <div class="p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-[11px] text-zinc-300 hover:border-emerald-500 cursor-pointer">
            📄 ROADMAP_MAESTRO_2026H2.md
          </div>
        </div>
      </aside>
    </section>

    <!-- ==================== PESTAÑA 2: CONTEXTALL OBSERVABILITY ==================== -->
    <section id="tab-contextall" class="h-full flex flex-col bg-zinc-950 p-6 space-y-6 hidden">
      <!-- HEADER CONTEXTALL -->
      <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📊</span> <span>ContextALL Observability — Radiografía Live</span>
          </h2>
          <p class="text-xs text-zinc-400">Inspección de proyectos, telemetría y grafos del ecosistema ALiHaneD</p>
        </div>
        <div class="flex gap-2">
          <button onclick="runProjectInspection()" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-md transition-all">
            🔍 inspect_project()
          </button>
          <button onclick="alert('Grafo exportado a Obsidian Canvas (.canvas)')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-md border border-zinc-700">
            📤 Exportar a Obsidian
          </button>
        </div>
      </div>

      <!-- METRIC CARDS GRID -->
      <div class="grid grid-cols-5 gap-4">
        <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Tokens In/Out</div>
          <div class="text-xl font-bold text-white font-mono" id="live-tokens">42,850</div>
          <div class="text-[10px] text-emerald-400">↑ 1.2k / min</div>
        </div>

        <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Agentes Activos</div>
          <div class="text-xl font-bold text-emerald-400 font-mono">4 Agentes</div>
          <div class="text-[10px] text-zinc-400">ALIAS, Spirit, Tutor, Tony</div>
        </div>

        <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Latencia Promedio</div>
          <div class="text-xl font-bold text-cyan-400 font-mono">118 ms</div>
          <div class="text-[10px] text-emerald-400">Estable</div>
        </div>

        <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Archivos & Módulos</div>
          <div class="text-xl font-bold text-purple-400 font-mono">128 Archivos</div>
          <div class="text-[10px] text-zinc-400">12 Módulos</div>
        </div>

        <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <div class="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Tablas & BD</div>
          <div class="text-xl font-bold text-orange-400 font-mono">24 Tablas</div>
          <div class="text-[10px] text-zinc-400">Supabase & pgvector</div>
        </div>
      </div>

      <!-- VISUAL GRAPH REPRESENTATION PANEL -->
      <div class="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-3">
          <span class="font-bold text-white uppercase tracking-wider">Grafo de Conocimiento del Proyecto (AST & Relaciones)</span>
          <div class="flex items-center gap-4 text-[11px]">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full node-module"></span> Módulo</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full node-file"></span> Archivo</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full node-table"></span> Tabla DB</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full node-agent"></span> Agente Live</span>
          </div>
        </div>

        <!-- GRAPH SIMULATION CONTENT -->
        <div class="flex-1 flex items-center justify-center p-8">
          <div class="grid grid-cols-4 gap-6 w-full max-w-4xl">
            <div class="p-4 bg-purple-950/40 border border-purple-800/60 rounded-xl text-center space-y-2">
              <div class="w-8 h-8 rounded-full node-module mx-auto flex items-center justify-center text-white text-xs font-bold">M</div>
              <div class="text-xs font-bold text-purple-200">AMO_DE_LLAVES</div>
              <div class="text-[10px] text-purple-400 font-mono">Alihas Core</div>
            </div>

            <div class="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-center space-y-2">
              <div class="w-8 h-8 rounded-full node-file mx-auto flex items-center justify-center text-white text-xs font-bold">F</div>
              <div class="text-xs font-bold text-cyan-200">ALIHAS_IDENTITY.md</div>
              <div class="text-[10px] text-cyan-400 font-mono">System Prompt</div>
            </div>

            <div class="p-4 bg-orange-950/40 border border-orange-800/60 rounded-xl text-center space-y-2">
              <div class="w-8 h-8 rounded-full node-table mx-auto flex items-center justify-center text-white text-xs font-bold">T</div>
              <div class="text-xs font-bold text-orange-200">gestor_memory</div>
              <div class="text-[10px] text-orange-400 font-mono">pgvector tables</div>
            </div>

            <div class="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center space-y-2">
              <div class="w-8 h-8 rounded-full node-agent mx-auto flex items-center justify-center text-white text-xs font-bold">A</div>
              <div class="text-xs font-bold text-emerald-200">Neurogestor Armor</div>
              <div class="text-[10px] text-emerald-400 font-mono">MCP Active</div>
            </div>
          </div>
        </div>

        <div class="text-right text-[10px] text-zinc-500 font-mono">
          ContextALL Engine v1.1.0 · Actualizado hace 2s
        </div>
      </div>
    </section>

  </div>

  <!-- JAVASCRIPT FOR TAB SWITCHING & REAL API INTERACTIVITY -->
  <script>
    let chatHistory = [];

    function switchTab(tabName) {
      const hermesSec = document.getElementById('tab-hermes');
      const contextallSec = document.getElementById('tab-contextall');
      const hermesBtn = document.getElementById('tab-hermes-btn');
      const contextallBtn = document.getElementById('tab-contextall-btn');

      if (tabName === 'hermes') {
        hermesSec.classList.remove('hidden');
        contextallSec.classList.add('hidden');
        hermesBtn.className = 'px-4 py-1.5 rounded-md text-xs font-medium transition-all bg-zinc-800 text-white shadow-sm flex items-center gap-2';
        contextallBtn.className = 'px-4 py-1.5 rounded-md text-xs font-medium transition-all text-zinc-400 hover:text-white flex items-center gap-2';
      } else {
        hermesSec.classList.add('hidden');
        contextallSec.classList.remove('hidden');
        contextallBtn.className = 'px-4 py-1.5 rounded-md text-xs font-medium transition-all bg-purple-900/60 text-white border border-purple-700/50 shadow-sm flex items-center gap-2';
        hermesBtn.className = 'px-4 py-1.5 rounded-md text-xs font-medium transition-all text-zinc-400 hover:text-white flex items-center gap-2';
      }
    }

    async function sendChatMessage() {
      const input = document.getElementById('user-input');
      const text = input.value.trim();
      if (!text) return;

      const roleSelect = document.getElementById('role-select');
      const selectedRole = roleSelect.value;
      const messagesDiv = document.getElementById('chat-messages');
      const sendBtn = document.getElementById('send-btn');

      // Add User Message
      const userBubble = document.createElement('div');
      userBubble.className = 'max-w-xl ml-auto bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-4 text-xs text-emerald-100 shadow-md';
      userBubble.textContent = text;
      messagesDiv.appendChild(userBubble);

      input.value = '';
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>Pensando...</span>';
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      // Loading Indicator
      const loadingBubble = document.createElement('div');
      loadingBubble.className = 'max-w-xl mr-auto bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 animate-pulse';
      loadingBubble.innerHTML = '🎩 <i>AliHas está procesando tu solicitud...</i>';
      messagesDiv.appendChild(loadingBubble);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            role: selectedRole,
            history: chatHistory
          })
        });

        const data = await res.json();
        messagesDiv.removeChild(loadingBubble);

        if (data.error) {
          throw new Error(data.error);
        }

        // Add to history
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'assistant', content: data.reply });

        // Add AI Response
        const botBubble = document.createElement('div');
        botBubble.className = 'max-w-xl mr-auto bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-200 space-y-2 shadow-md';
        
        const formattedReply = data.reply
          .replace(/\\n/g, '<br>')
          .replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');

        botBubble.innerHTML = \`
          <div class="font-bold text-emerald-400 text-[11px] flex items-center justify-between border-b border-zinc-800 pb-1 mb-2">
            <span>🎩 AliHas (Alfred)</span>
            <span class="text-[9px] text-zinc-500 font-mono">[\${data.model || 'Gemini'}]</span>
          </div>
          <div class="leading-relaxed">\${formattedReply}</div>
        \`;
        messagesDiv.appendChild(botBubble);
      } catch (err) {
        messagesDiv.removeChild(loadingBubble);
        const errBubble = document.createElement('div');
        errBubble.className = 'max-w-xl mr-auto bg-red-950/60 border border-red-800/60 rounded-xl p-4 text-xs text-red-200';
        errBubble.textContent = 'Error conectando con AliHas: ' + (err.message || 'Sin respuesta');
        messagesDiv.appendChild(errBubble);
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Enviar</span>';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }

    function newSession() {
      chatHistory = [];
      const messagesDiv = document.getElementById('chat-messages');
      messagesDiv.innerHTML = \`
        <div class="max-w-2xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">🎩</div>
            <div>
              <h3 class="text-sm font-bold text-white">AliHas — Amo de Llaves</h3>
              <p class="text-xs text-zinc-400">Nueva sesión iniciada</p>
            </div>
          </div>
          <p class="text-xs text-zinc-300">¿En qué puedo asistirte en esta nueva sesión?</p>
        </div>
      \`;
    }

    function runProjectInspection() {
      fetch('/api/corredor')
        .then(r => r.json())
        .then(data => {
          alert('Inspección de Corredor MCP Neurogestor:\\n' + JSON.stringify(data, null, 2));
        })
        .catch(e => alert('Error inspeccionando: ' + e.message));
    }
  </script>
</body>
</html>`;
