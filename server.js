"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const raiz = __dirname;
const porta = 3030;
const tipos = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };

function iniciarTerminal() {
  const arquivoTerminal = path.join(raiz, "terminal", "mesas.js");
  const ambiente = { ...process.env, RESTOCK_CORES: "1", TERM: "xterm" };
  delete ambiente.NO_COLOR;
  spawn("cmd.exe", ["/d", "/c", `start cmd.exe /k node ${arquivoTerminal}`], { windowsHide: false, detached: true, stdio: "ignore", env: ambiente }).unref();
}

function paginaTerminal() {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Abrindo terminal</title></head><body><script>window.close();</script></body></html>';
}

http.createServer((requisicao, resposta) => {
  const endereco = new URL(requisicao.url, `http://${requisicao.headers.host}`);
  if (endereco.pathname === "/terminal") {
    iniciarTerminal();
    resposta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    resposta.end(paginaTerminal());
    return;
  }
  const caminhoRelativo = endereco.pathname === "/" ? "index.html" : decodeURIComponent(endereco.pathname).replace(/^\/+/, "");
  const arquivo = path.resolve(raiz, caminhoRelativo);
  if (!arquivo.startsWith(`${raiz}${path.sep}`)) { resposta.writeHead(403); resposta.end(); return; }
  fs.readFile(arquivo, (erro, conteudo) => {
    if (erro) { resposta.writeHead(404); resposta.end("Página não encontrada."); return; }
    resposta.writeHead(200, { "Content-Type": tipos[path.extname(arquivo).toLowerCase()] || "application/octet-stream" });
    resposta.end(conteudo);
  });
}).on("error", erro => {
  if (erro.code !== "EADDRINUSE") console.error(`Não foi possível iniciar o servidor: ${erro.message}`);
}).listen(porta, "127.0.0.1", () => console.log(`Sistema disponível em http://127.0.0.1:${porta}`));
