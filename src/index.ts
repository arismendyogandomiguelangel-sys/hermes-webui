/**
 * Alihas Telegram Bridge & WebUI — El Amo de Llaves (Hermes alihanetizado)
 *
 * Sirve:
 *   1. Interfaz WebUI Dual (Hermes WebUI + ContextALL) en http://localhost:8080/
 *   2. REST API /api/chat para interacción con la WebUI
 *   3. Endpoint JSON /health y /api/health para Dokploy
 *   4. Grammy Telegram Bot Bridge
 */

import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Bot, Context, session, SessionFlavor } from "grammy";
import {
  routeMessage,
  type RoutedResponse,
  getRoleById,
  resolveModelForRole,
  formatRoleList,
} from "./agent-tor.js";
import { searchZumo } from "./zumo.js";
import { diagnoseNeurogestorCorridor } from "./neurogestor.js";
import { ALIHAS_WEBUI_HTML } from "./webui.js";

interface SessionData {
  currentRole?: string;
  history: { role: "user" | "assistant"; content: string }[];
}

type BotContext = Context & SessionFlavor<SessionData>;

const telegramToken = (process.env.HERMES_TELEGRAM_TOKEN || "").trim();

// Guard Anti-Crash para Telegram Bot
let bot: Bot<BotContext> | null = null;

if (telegramToken) {
  try {
    bot = new Bot<BotContext>(telegramToken);

    bot.use(
      session({
        initial: (): SessionData => ({
          currentRole: undefined,
          history: [],
        }),
      })
    );

    function currentOutfit(ctx: BotContext): string {
      if (!ctx.session.currentRole) return "detección automática (Agent Tor elige el traje)";
      const role = getRoleById(ctx.session.currentRole);
      const resolved = resolveModelForRole(ctx.session.currentRole);
      return `${role?.icon || "👔"} ${role?.label || ctx.session.currentRole} (${resolved?.modelName || "?"})`;
    }

    bot.command("start", async (ctx) => {
      await ctx.reply(
        `**Alihas — Amo de Llaves**\n\n` +
        `Soy tu identidad digital ALiHaNeD. Puedo:\n\n` +
        `  • Gestionar tu vida personal y negocios\n` +
        `  • Vestirme del profesional que la tarea requiera\n` +
        `  • Consultar el Zumo de Conocimiento\n` +
        `  • Coordinar con el ecosistema (Neurogestor, laboratorio)\n\n` +
        `Vestimenta actual: *${currentOutfit(ctx)}*\n\n` +
        `Mi closet de roles:\n${formatRoleList()}\n` +
        `  /vestir <rol> — Cambiarme de traje\n` +
        `  /auto — Volver a detección automática\n` +
        `  /zumo <tema> — Buscar conocimiento\n` +
        `  /ayuda — Ver ayuda`,
        { parse_mode: "Markdown" }
      );
    });

    bot.command(["vestir", "modelo"], async (ctx) => {
      const key = ctx.match?.trim().toLowerCase();
      const role = key ? getRoleById(key) : undefined;
      if (!key || !role) {
        await ctx.reply(
          `**Closet de roles**\n${formatRoleList()}\n` +
          `Vestimenta actual: *${currentOutfit(ctx)}*\n` +
          `Usa /vestir <rol> para cambiarme de traje, o /auto para que yo elija.`,
          { parse_mode: "Markdown" }
        );
        return;
      }
      ctx.session.currentRole = role.id;
      const resolved = resolveModelForRole(role.id);
      await ctx.reply(
        `Me he vestido de ${role.icon} *${role.label}* (${resolved?.modelName || "modelo por defecto"}).\nA tu servicio con este traje.`,
        { parse_mode: "Markdown" }
      );
    });

    bot.command(["auto", "modelos"], async (ctx) => {
      ctx.session.currentRole = undefined;
      await ctx.reply(
        `Detección automática activada: Agent Tor elegirá el traje según cada mensaje.\n\n` +
        `Closet disponible:\n${formatRoleList()}`,
        { parse_mode: "Markdown" }
      );
    });

    bot.command("zumo", async (ctx) => {
      const query = ctx.match;
      if (!query) {
        await ctx.reply("Uso: /zumo <tema a buscar>");
        return;
      }
      await ctx.reply("Buscando en el Zumo de Conocimiento...");
      const results = await searchZumo(query);
      if (results.length === 0) {
        await ctx.reply("No encontré nada en el Zumo sobre ese tema.");
      } else {
        await ctx.reply(`**Zumo — ${query}**\n\n${results.slice(0, 3).join("\n\n")}`, { parse_mode: "Markdown" });
      }
    });

    bot.command(["corredor", "neurogestor"], async (ctx) => {
      await ctx.reply("Consultando el Corredor NeuroAgentico mediante el MCP NeuroGestor...");
      try {
        const diagnostic = await diagnoseNeurogestorCorridor();
        await ctx.reply(`Diagnóstico MCP NeuroGestor:\n\n${JSON.stringify(diagnostic, null, 2)}`);
      } catch (error) {
        console.error("[NeuroGestor MCP] Error:", error);
        await ctx.reply("No pude conectar con el MCP NeuroGestor remoto. No se modificó ningún semáforo.");
      }
    });

    bot.command("ayuda", async (ctx) => {
      await ctx.reply(
        `**Alihas — Comandos**\n\n` +
        `/start — Presentación\n` +
        `/vestir <rol> — Cambiar traje profesional\n` +
        `/auto — Detección automática de rol\n` +
        `/zumo <tema> — Buscar conocimiento\n` +
        `/corredor — Diagnosticar el corredor mediante MCP NeuroGestor\n` +
        `/ayuda — Esta lista`,
        { parse_mode: "Markdown" }
      );
    });

    bot.on("message:text", async (ctx) => {
      const userMessage = ctx.message.text;
      console.log(`[Alihas] Mensaje de ${ctx.from.first_name}: "${userMessage.slice(0, 80)}..."`);
      await ctx.api.sendChatAction(ctx.chat.id, "typing");

      try {
        const response: RoutedResponse = await routeMessage(userMessage, {
          forceRole: ctx.session.currentRole,
          history: ctx.session.history,
        });

        ctx.session.history.push({ role: "user", content: userMessage });
        ctx.session.history.push({ role: "assistant", content: response.reply });

        if (ctx.session.history.length > 20) {
          ctx.session.history = ctx.session.history.slice(-20);
        }

        console.log(`[Alihas] Rol: ${response.role} · Modelo: ${response.model}`);
        await ctx.reply(response.reply, { parse_mode: "Markdown" });
      } catch (error) {
        console.error("[Alihas] Error:", error);
        await ctx.reply("Lo siento, hubo un error procesando tu mensaje. Intenta de nuevo.");
      }
    });
  } catch (err) {
    console.error("[Telegram Bot] Error inicializando bot:", err);
  }
} else {
  console.log("[Alihas] HERMES_TELEGRAM_TOKEN no configurado. Modo WebUI Solo activo.");
}

// Servidor HTTP con WebUI & REST API (SIEMPRE INICIA)
const PORT = parseInt(process.env.PORT || "8080");
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || "/";

  // Health Checks
  if (url === "/health" || url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ 
      status: "ok", 
      service: "alihas-amo-de-llaves", 
      telegramActive: !!bot,
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // REST API: POST /api/chat (Interactúa directamente con AliHas LLMs)
  if (req.method === "POST" && url === "/api/chat") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");
        const userMessage = data.message || "";
        const role = data.role && data.role !== "auto" ? data.role : undefined;
        const history = Array.isArray(data.history) ? data.history : [];

        if (!userMessage.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Mensaje vacío" }));
          return;
        }

        console.log(`[WebUI API] Procesando mensaje con AliHas: "${userMessage.slice(0, 60)}..."`);
        const response: RoutedResponse = await routeMessage(userMessage, {
          forceRole: role,
          history: history,
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (err: any) {
        console.error("[WebUI API] Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err?.message || "Error interno del servidor" }));
      }
    });
    return;
  }

  // REST API: GET /api/corredor
  if (url === "/api/corredor") {
    diagnoseNeurogestorCorridor()
      .then(diagnostic => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", diagnostic }));
      })
      .catch(err => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err?.message || "Error conectando con MCP Neurogestor" }));
      });
    return;
  }

  // Sirve la WebUI nativa para cualquier solicitud navegable
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(ALIHAS_WEBUI_HTML);
});

server.listen(PORT, () => {
  console.log(`[AliHas OS] WebUI e API HTTP corriendo en puerto ${PORT}`);
});

// Iniciar Telegram Bot si se configuró exitosamente
if (bot) {
  console.log("=== Alihas (Amo de Llaves) — Telegram Bridge & WebUI ===");
  bot.start({
    onStart: (botInfo) => {
      console.log(`[Telegram] Bot @${botInfo.username} iniciado como Alihas`);
    },
  });
}
