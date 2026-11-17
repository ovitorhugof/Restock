"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const arquivoMesas = path.join(__dirname, "mesas.json");
const capacidades = [4, 4, 2, 4, 6, 4, 4, 2, 4, 6, 4, 4, 2, 4, 6, 4, 4, 2, 4, 6, 4];
const entrada = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = texto => new Promise(resolve => entrada.question(texto, resolve));
const cores = process.env.RESTOCK_CORES === '1' || (!process.env.NO_COLOR && (process.stdout.isTTY || Boolean(process.env.WT_SESSION)));
const pintar = (codigo, texto) => cores ? `\x1b[${codigo}m${texto}\x1b[0m` : texto;
const dourado = texto => pintar('33', texto);
const verde = texto => pintar('32', texto);
const vermelho = texto => pintar('31', texto);
const discreto = texto => pintar('90', texto);
const negrito = texto => pintar('1', texto);
const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));
function limparTela() {
  if (process.stdout.isTTY) process.stdout.write('\x1b[2J\x1b[H');
}

function criarMesas() { return capacidades.map((capacidade, indice) => ({ numero: indice + 1, capacidade, ocupada: false, pessoas: 0, horarioOcupacao: null })); }
function dadosValidos(mesas) { return Array.isArray(mesas) && mesas.length === capacidades.length && mesas.every((mesa, indice) => mesa && mesa.numero === indice + 1 && mesa.capacidade === capacidades[indice] && typeof mesa.ocupada === "boolean" && Number.isInteger(mesa.pessoas)); }
function salvarMesas(mesas) { fs.writeFileSync(arquivoMesas, `${JSON.stringify(mesas, null, 2)}\n`, "utf8"); }

function carregarMesas() {
  try {
    if (!fs.existsSync(arquivoMesas)) { const mesas = criarMesas(); salvarMesas(mesas); return mesas; }
    const mesas = JSON.parse(fs.readFileSync(arquivoMesas, "utf8"));
    if (!dadosValidos(mesas)) throw new Error("estrutura inválida");
    return mesas;
  } catch (erro) {
    throw new Error(`Não foi possível abrir ${arquivoMesas}: ${erro.message}. Os dados foram preservados.`);
  }
}

function numeroMesa(numero) { return String(numero).padStart(2, "0"); }
function tempoOcupacao(inicio) { const minutos = Math.max(0, Math.floor((Date.now() - new Date(inicio).getTime()) / 60000)); const horas = Math.floor(minutos / 60); return horas ? `${horas}h ${String(minutos % 60).padStart(2, "0")}min` : `${minutos} min`; }
function resumo(mesas) { const ocupadas = mesas.filter(mesa => mesa.ocupada); return { ocupadas, livres: mesas.length - ocupadas.length, pessoas: ocupadas.reduce((total, mesa) => total + mesa.pessoas, 0) }; }

function mostrarPainel(mesas) {
  const dados = resumo(mesas);
  limparTela();
  const largura = Math.max(32, Math.min(process.stdout.columns || 80, 100));
  const colunas = Math.max(1, Math.min(4, Math.floor((largura - 2) / 19)));
  const divisoria = discreto('─'.repeat(largura - 2));
  console.log(`\n  ${pintar('1;33', 'RECANTO SABOR DE MINAS')}  ${discreto('/  RECEPÇÃO')}`);
  console.log(`  ${discreto('GERENCIAMENTO DE MESAS')}`);
  console.log(`\n  ${divisoria}`);
  console.log(`  ${verde(`LIVRES ${dados.livres}`)}    ${vermelho(`OCUPADAS ${dados.ocupadas.length}`)}    CLIENTES ${dados.pessoas}    TOTAL ${mesas.length}`);
  console.log(`  ${divisoria}\n`);
  console.log(`  ${negrito('MAPA DO SALÃO')}\n`);
  for (let inicio = 0; inicio < mesas.length; inicio += colunas) {
    const grupo = mesas.slice(inicio, inicio + colunas);
    console.log(`  ${grupo.map(mesa => {
      const numero = `MESA ${numeroMesa(mesa.numero)}`;
      const estado = mesa.ocupada ? vermelho('OCUPADA') : verde('LIVRE  ');
      return `${negrito(numero)}  ${estado}  `;
    }).join('')}`);
    console.log(`  ${grupo.map(mesa => discreto((mesa.ocupada ? `${mesa.pessoas} pessoa(s)` : `${mesa.capacidade} lugares`).padEnd(19))).join('')}`);
    console.log('');
  }
  console.log(`\n  ${divisoria}`);
  console.log(`  ${dourado('[1]')} Ocupar    ${dourado('[2]')} Liberar    ${dourado('[3]')} Resumo    ${dourado('[0]')} Sair`);
  console.log(`  ${discreto('Digite o número da opção e pressione Enter.')}`);
}

async function abertura() {
  if (!process.stdout.isTTY) return carregarMesas();
  limparTela();
  const largura = process.stdout.columns || 80;
  let nome = ['RECANTO'];
  try {
    const linhasNome = fs.readFileSync(path.join(__dirname, 'nome.txt'), 'utf8').split(/\r?\n/).map(linha => linha.trimEnd());
    while (linhasNome.length && !linhasNome[0].trim()) linhasNome.shift();
    while (linhasNome.length && !linhasNome[linhasNome.length - 1].trim()) linhasNome.pop();
    if (linhasNome.length) nome = linhasNome;
  } catch (erro) { if (erro.code !== 'ENOENT') console.error('Não foi possível carregar o nome:', erro.message); }
  let arte = [];
  try {
    arte = fs.readFileSync(path.join(__dirname, 'arte.txt'), 'utf8').split(/\r?\n/);
    while (arte.length && !arte[0].trim()) arte.shift();
    while (arte.length && !arte[arte.length - 1].trim()) arte.pop();
    const linhas = arte.map(linha => linha.trimEnd());
    const margem = Math.min(...linhas.filter(linha => linha.trim()).map(linha => linha.search(/\S/)));
    arte = linhas.map(linha => linha.slice(margem));
  } catch (erro) { if (erro.code !== 'ENOENT') console.error('Não foi possível carregar a arte:', erro.message); }

  const nomeGrande = largura >= Math.max(...nome.map(linha => linha.length)) + 32;
  const marca = nomeGrande ? nome : ['RECANTO'];
  const esquerda = [
    '', '', ...marca, '', 'S A B O R  D E  M I N A S', '',
    'RECEPÇÃO', 'Gerenciamento de mesas', '', 'Preparando o salão...'
  ];
  const coluna = nomeGrande ? Math.max(...nome.map(linha => linha.length)) + 2 : 28;
  const espacoArte = Math.max(0, largura - coluna - 4);
  const maiorLinha = Math.max(0, ...arte.map(linha => linha.length));
  if (espacoArte >= 18 && maiorLinha > espacoArte) {
    const passo = Math.ceil(maiorLinha / espacoArte);
    arte = arte.map(linha => Array.from(linha).filter((_, indice) => indice % passo === 0).join(''));
  } else if (espacoArte < 18) {
    arte = [];
  }
  console.log('');
  const total = Math.max(esquerda.length, arte.length);
  for (let indice = 0; indice < total; indice++) {
    const texto = esquerda[indice] || '';
    const destaque = indice >= 2 && indice < 2 + marca.length || texto === 'S A B O R  D E  M I N A S';
    const bloco = texto.padEnd(coluna);
    console.log(`  ${destaque ? dourado(bloco) : discreto(bloco)}${arte[indice] || ''}`);
  }
  const mesas = carregarMesas();
  await esperar(1800);
  return mesas;
}

async function escolherMesa(mesas, somenteOcupadas) {
  const numero = Number((await perguntar("Número da mesa: ")).trim());
  const mesa = mesas.find(item => item.numero === numero);
  if (!mesa) { console.log("Mesa não encontrada."); return null; }
  if (somenteOcupadas && !mesa.ocupada) { console.log("Essa mesa já está livre."); return null; }
  if (!somenteOcupadas && mesa.ocupada) { console.log("Essa mesa já está ocupada."); return null; }
  return mesa;
}

async function ocuparMesa(mesas) {
  const mesa = await escolherMesa(mesas, false);
  if (!mesa) return;
  const pessoas = Number((await perguntar(`Quantidade de pessoas (máximo ${mesa.capacidade}): `)).trim());
  if (!Number.isInteger(pessoas) || pessoas < 1 || pessoas > mesa.capacidade) { console.log("Quantidade inválida para esta mesa."); return; }
  mesa.ocupada = true; mesa.pessoas = pessoas; mesa.horarioOcupacao = new Date().toISOString(); salvarMesas(mesas);
  console.log(`Mesa ${numeroMesa(mesa.numero)} ocupada.`);
}

async function liberarMesa(mesas) {
  const mesa = await escolherMesa(mesas, true);
  if (!mesa) return;
  if ((await perguntar(`Liberar mesa ${numeroMesa(mesa.numero)}? [S/N] `)).trim().toUpperCase() !== "S") { console.log("Liberação cancelada."); return; }
  mesa.ocupada = false; mesa.pessoas = 0; mesa.horarioOcupacao = null; salvarMesas(mesas);
  console.log(`Mesa ${numeroMesa(mesa.numero)} liberada.`);
}

function mostrarResumo(mesas) {
  const dados = resumo(mesas); const taxa = Math.round((dados.ocupadas.length / mesas.length) * 100);
  console.log(`\nResumo: ${dados.ocupadas.length} ocupada(s), ${dados.livres} livre(s), ${dados.pessoas} cliente(s), ocupação de ${taxa}%.`);
  if (dados.ocupadas.length) console.log(dados.ocupadas.map(mesa => `Mesa ${numeroMesa(mesa.numero)}: ${mesa.pessoas} pessoa(s), há ${tempoOcupacao(mesa.horarioOcupacao)}`).join("\n"));
}

async function executar() {
  const mesas = await abertura();
  while (true) {
    mostrarPainel(mesas);
    const opcao = (await perguntar("Escolha uma opção: ")).trim();
    if (opcao === "0") break;
    if (opcao === "1") await ocuparMesa(mesas);
    else if (opcao === "2") await liberarMesa(mesas);
    else if (opcao === "3") mostrarResumo(mesas);
    else console.log("Opção inválida.");
    await perguntar("\nPressione Enter para continuar.");
  }
  entrada.close();
}

executar().catch(erro => { console.error(`Erro no terminal de mesas: ${erro.message}`); entrada.close(); process.exitCode = 1; });
