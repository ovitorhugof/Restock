const listaProdutos = document.getElementById('lista-produtos');
const modal = document.getElementById('modal-produto');
const formProduto = document.getElementById('form-produto');

function mostrarProdutos() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const produtos = carregarProdutos().filter(p => p.nome.toLowerCase().includes(busca) || p.categoria.toLowerCase().includes(busca));
  listaProdutos.innerHTML = produtos.length ? produtos.map(p => `<tr><td>${p.nome}</td><td>${p.categoria}</td><td>${p.unidade}</td><td>${formatarNumero(p.quantidade)}</td><td>${formatarNumero(p.estoqueMinimo)}</td><td><div class="acoes"><button class="acao-link" onclick="editarProduto(${p.id})">Editar</button><button class="acao-link excluir" onclick="excluirProduto(${p.id})">Excluir</button></div></td></tr>`).join('') : '<tr><td colspan="6" class="vazio">Nenhum produto encontrado.</td></tr>';
}
function abrirModal(produto) {
  formProduto.reset(); document.getElementById('erro-form-produto').textContent = '';
  document.getElementById('titulo-modal').textContent = produto ? 'Editar produto' : 'Novo produto';
  if (produto) { document.getElementById('produto-id').value = produto.id; document.getElementById('produto-nome').value = produto.nome; document.getElementById('produto-categoria').value = produto.categoria; document.getElementById('produto-unidade').value = produto.unidade; document.getElementById('produto-quantidade').value = produto.quantidade; document.getElementById('produto-minimo').value = produto.estoqueMinimo; }
  modal.classList.remove('escondido'); document.getElementById('produto-nome').focus();
}
function fecharModal() { modal.classList.add('escondido'); }
function editarProduto(id) { abrirModal(carregarProdutos().find(p => p.id === id)); }
function excluirProduto(id) {
  const produto = carregarProdutos().find(p => p.id === id);
  if (!confirm(`Excluir o produto "${produto.nome}"?`)) return;
  salvarProdutos(carregarProdutos().filter(p => p.id !== id));
  document.getElementById('mensagem-produto').textContent = 'Produto excluído com sucesso.'; mostrarProdutos();
}
document.getElementById('novo-produto').addEventListener('click', () => abrirModal());
document.getElementById('fechar-modal').addEventListener('click', fecharModal);
document.getElementById('cancelar-modal').addEventListener('click', fecharModal);
document.getElementById('busca').addEventListener('input', mostrarProdutos);
formProduto.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const nome = document.getElementById('produto-nome').value.trim(), categoria = document.getElementById('produto-categoria').value.trim(), unidade = document.getElementById('produto-unidade').value;
  const quantidade = Number(document.getElementById('produto-quantidade').value), estoqueMinimo = Number(document.getElementById('produto-minimo').value);
  const erro = document.getElementById('erro-form-produto');
  if (!nome || !categoria || !unidade || quantidade < 0 || estoqueMinimo < 0) { erro.textContent = 'Preencha todos os campos com valores válidos.'; return; }
  const produtos = carregarProdutos(), id = Number(document.getElementById('produto-id').value);
  const produto = { id: id || Date.now(), nome, categoria, unidade, quantidade, estoqueMinimo };
  const indice = produtos.findIndex(p => p.id === id); if (indice >= 0) produtos[indice] = produto; else produtos.push(produto);
  salvarProdutos(produtos); fecharModal(); document.getElementById('mensagem-produto').textContent = id ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.'; mostrarProdutos();
});
mostrarProdutos();
