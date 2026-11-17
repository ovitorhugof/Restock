const seletorProduto = document.getElementById('mov-produto');
const seletorTipo = document.getElementById('mov-tipo');
const infoEstoque = document.getElementById('info-estoque');
const formularioMovimentacao = document.getElementById('form-movimentacao');
const mensagemMovimentacao = document.getElementById('mensagem-movimentacao');

function preencherProdutos() {
  const produtos = carregarProdutos();
  seletorProduto.innerHTML = '<option value="">Selecione um produto</option>' + produtos.map(produto => `<option value="${produto.id}">${escaparHtml(produto.nome)} — ${formatarNumero(produto.quantidade)} ${escaparHtml(produto.unidade)}</option>`).join('');
  document.getElementById('registrar-movimentacao').disabled = produtos.length === 0;
}

function atualizarInfoEstoque() {
  const produto = carregarProdutos().find(item => item.id === Number(seletorProduto.value));
  if (!produto) {
    infoEstoque.className = 'info-estoque';
    infoEstoque.textContent = '';
    return;
  }
  const saida = eSaida(seletorTipo.value);
  infoEstoque.className = `info-estoque visivel ${saida ? 'saida' : 'entrada'}`;
  infoEstoque.textContent = `${saida ? 'Saída' : 'Entrada'}: estoque atual de ${formatarNumero(produto.quantidade)} ${produto.unidade}.`;
}

preencherProdutos();
seletorProduto.addEventListener('change', atualizarInfoEstoque);
seletorTipo.addEventListener('change', atualizarInfoEstoque);
formularioMovimentacao.addEventListener('reset', () => window.setTimeout(atualizarInfoEstoque, 0));

formularioMovimentacao.addEventListener('submit', evento => {
  evento.preventDefault();
  const id = Number(seletorProduto.value);
  const tipo = seletorTipo.value;
  const quantidade = Number(document.getElementById('mov-quantidade').value);
  const observacao = document.getElementById('mov-observacao').value.trim();
  const produtos = carregarProdutos();
  const produto = produtos.find(item => item.id === id);
  mensagemMovimentacao.className = 'mensagem erro';

  if (!produto || !['Entrada', 'Saída'].includes(tipo) || !Number.isFinite(quantidade) || quantidade <= 0) {
    mensagemMovimentacao.textContent = 'Selecione um produto e informe uma quantidade maior que zero.';
    return;
  }
  if (eSaida(tipo) && quantidade > Number(produto.quantidade)) {
    mensagemMovimentacao.textContent = `Saldo insuficiente. Há ${formatarNumero(produto.quantidade)} ${produto.unidade} disponível(is).`;
    return;
  }
  produto.quantidade = eSaida(tipo) ? Number(produto.quantidade) - quantidade : Number(produto.quantidade) + quantidade;
  const movimentacoes = carregarMovimentacoes();
  const usuario = usuarioLogado();
  movimentacoes.push({ id: proximoId(movimentacoes), produtoId: produto.id, produtoNome: produto.nome, tipo, quantidade, unidade: produto.unidade, usuario: usuario.nome, observacao, data: new Date().toISOString() });

  if (!salvarProdutos(produtos) || !salvarMovimentacoes(movimentacoes)) {
    mensagemMovimentacao.textContent = 'Não foi possível registrar a movimentação. Tente novamente.';
    return;
  }
  mensagemMovimentacao.className = 'mensagem';
  mensagemMovimentacao.textContent = `${tipo} registrada para ${produto.nome}.`;
  formularioMovimentacao.reset();
  preencherProdutos();
});
