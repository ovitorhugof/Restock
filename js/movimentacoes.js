const seletorProduto = document.getElementById('mov-produto');
const produtosMovimentacao = carregarProdutos();
seletorProduto.innerHTML = '<option value="">Selecione um produto</option>' + produtosMovimentacao.map(p => `<option value="${p.id}">${p.nome} (${formatarNumero(p.quantidade)} ${p.unidade})</option>`).join('');
document.getElementById('form-movimentacao').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const id = Number(seletorProduto.value), tipo = document.getElementById('mov-tipo').value, quantidade = Number(document.getElementById('mov-quantidade').value), observacao = document.getElementById('mov-observacao').value.trim();
  const mensagem = document.getElementById('mensagem-movimentacao'); mensagem.className = 'mensagem erro';
  const produtos = carregarProdutos(), produto = produtos.find(p => p.id === id);
  if (!produto || quantidade <= 0) { mensagem.textContent = 'Selecione um produto e informe uma quantidade válida.'; return; }
  if (tipo === 'Saída' && quantidade > Number(produto.quantidade)) { mensagem.textContent = 'Quantidade insuficiente em estoque.'; return; }
  produto.quantidade = tipo === 'Entrada' ? Number(produto.quantidade) + quantidade : Number(produto.quantidade) - quantidade;
  salvarProdutos(produtos);
  const usuario = usuarioLogado(); const movimentacoes = carregarMovimentacoes();
  movimentacoes.push({ id: Date.now(), produtoId: produto.id, produtoNome: produto.nome, tipo, quantidade, unidade: produto.unidade, usuario: usuario.nome, observacao, data: new Date().toISOString() });
  salvarMovimentacoes(movimentacoes); mensagem.className = 'mensagem'; mensagem.textContent = 'Movimentação registrada com sucesso.'; this.reset();
  seletorProduto.innerHTML = '<option value="">Selecione um produto</option>' + carregarProdutos().map(p => `<option value="${p.id}">${p.nome} (${formatarNumero(p.quantidade)} ${p.unidade})</option>`).join('');
});
