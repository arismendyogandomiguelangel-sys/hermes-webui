import { spawn } from "node:child_process";

type JsonRpcResponse = {
  id?: number;
  result?: { content?: { type: string; text?: string }[] };
  error?: { message?: string };
};

const MCP_SERVER = process.env.NEUROGESTOR_MCP_SERVER || "/opt/neurogestor-mcp/neurogestor-mcp-server.js";

function request(child: ReturnType<typeof spawn>, id: number, method: string, params: Record<string, unknown> = {}) {
  return new Promise<JsonRpcResponse>((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(() => reject(new Error(`MCP timeout: ${method}`)), 20_000);

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const message = JSON.parse(line) as JsonRpcResponse;
          if (message.id !== id) continue;
          clearTimeout(timeout);
          child.stdout?.off("data", onData);
          resolve(message);
          return;
        } catch {
          // El servidor solo debe emitir JSON por stdout; ignoramos líneas inválidas.
        }
      }
    };

    child.stdout?.on("data", onData);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`MCP server exited with code ${code}`));
      }
    });
    child.stdin?.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
}

export async function diagnoseNeurogestorCorridor(): Promise<unknown> {
  const child = spawn("node", [MCP_SERVER], {
    stdio: ["pipe", "pipe", "pipe"],
    env: process.env,
  });

  child.stderr?.on("data", (chunk) => {
    console.error(`[NeuroGestor MCP] ${chunk.toString().trim()}`);
  });

  try {
    const initialized = await request(child, 1, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "alihas-hermes-core", version: "1.0.0" },
    });
    if (initialized.error) throw new Error(initialized.error.message || "MCP initialize failed");

    child.stdin?.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })}\n`);
    const response = await request(child, 2, "tools/call", {
      name: "diagnose_semaphore",
      arguments: {},
    });
    if (response.error) throw new Error(response.error.message || "MCP diagnose failed");

    const text = response.result?.content?.find((item) => item.type === "text")?.text;
    return text ? JSON.parse(text) : response.result;
  } finally {
    child.kill();
  }
}
