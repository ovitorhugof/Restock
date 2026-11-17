const listaProdutos = document.getElementById('lista-produtos');
const modal = document.getElementById('modal-produto');
const formulario = document.getElementById('form-produto');
const mensagem = document.getElementById('mensagem-produto');
const erroFormulario = document.getElementById('erro-form-produto');

function statusProduto(produto) {
  return Number(produto.quantidade) <= Number(produto.estoqueMinimo)
    ? '<span class="status status-baixo">Atenção</span>'
    : '<span class="status status-normal">Regular</span>';
}

function mostrarProdutos() {
  const busca = document.getElementById('busca').value.trim().toLocaleLowerCase('pt-BR');
  const produtos = carregarProdutos().filter(produto =>
    produto.nome.toLocaleLowerCase('pt-BR').includes(busca) || produto.categoria.toLocaleLowerCase('pt-BR').includes(busca)
  );
  listaProdutos.innerHTML = produtos.length
    ? produtos.map(produto => `<tr><td>${escaparHtml(produto.nome)}</td><td>${escaparHtml(produto.categoria)}</td><td>${escaparHtml(produto.unidade)}</td><td>${formatarNumero(produto.quantidade)}</td><td>${formatarNumero(produto.estoqueMinimo)}</td><td>${statusProduto(produto)}</td><td><div class="acoes"><button class="acao-link" data-acao="editar" data-id="${produto.id}">Editar</button><button class="acao-link excluir" data-acao="excluir" data-id="${produto.id}">Excluir</button></div></td></tr>`).join('')
    : '<tr><td colspan="7" class="vazio">Nenhum produto encontrado.</td></tr>';
}

function abrirModal(produto) {
  formulario.reset();
  erroFormulario.textContent = '';
  document.getElementById('produto-id').value = produto?.id || '';
  document.getElementById('titulo-modal').textContent = produto ? 'Editar produto' : 'Novo produto';
  if (produto) {
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-categoria').value = produto.categoria;
    document.getElementById('produto-unidade').value = produto.unidade;
    document.getElementById('produto-quantidade').value = produto.quantidade;
    document.getElementById('produto-minimo').value = produto.estoqueMinimo;
  }
  modal.classList.remove('escondido');
  document.getElementById('produto-nome').focus();
}

function fecharModal() { modal.classList.add('escondido'); }

function excluirProduto(id) {
  const produtos = carregarProdutos();
  const produto = produtos.find(item => item.id === id);
  if (!produto) return;
  if (carregarMovimentacoes().some(movimentacao => movimentacao.produtoId === id)) {
    mensagem.className = 'mensagem erro';
    mensagem.textContent = 'Este produto possui movimentações registradas e não pode ser excluído.';
    return;
  }
  if (!window.confirm(`Excluir “${produto.nome}”?`)) return;
  if (!salvarProdutos(produtos.filter(item => item.id !== id))) {
    mensagem.className = 'mensagem erro';
    mensagem.textContent = 'Não foi possível excluir o produto.';
    return;
  }
  mensagem.className = 'mensagem';
  mensagem.textContent = 'Produto removido.';
  mostrarProdutos();
}

document.getElementById('novo-produto').addEventListener('click', () => abrirModal());
document.getElementById('fechar-modal').addEventListener('click', fecharModal);
document.getElementById('cancelar-modal').addEventListener('click', fecharModal);
document.getElementById('busca').addEventListener('input', mostrarProdutos);
listaProdutos.addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === 'editar') abrirModal(carregarProdutos().find(produto => produto.id === id));
  if (botao.dataset.acao === 'excluir') excluirProduto(id);
});
modal.addEventListener('click', evento => { if (evento.target === modal) fecharModal(); });
document.addEventListener('keydown', evento => { if (evento.key === 'Escape') fecharModal(); });

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const nome = document.getElementById('produto-nome').value.trim();
  const categoria = document.getElementById('produto-categoria').value.trim();
  const unidade = document.getElementById('produto-unidade').value;
  const quantidade = Number(document.getElementById('produto-quantidade').value);
  const estoqueMinimo = Number(document.getElementById('produto-minimo').value);
  const id = Number(document.getElementById('produto-id').value);
  const produtos = carregarProdutos();
  const duplicado = produtos.some(produto => produto.id !== id && produto.nome.trim().toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR'));

  if (!nome || !categoria || !unidade || !Number.isFinite(quantidade) || !Number.isFinite(estoqueMinimo) || quantidade < 0 || estoqueMinimo < 0) {
    erroFormulario.textContent = 'Preencha os campos obrigatórios com valores válidos.';
    return;
  }
  if (duplicado) {
    erroFormulario.textContent = 'Já existe um produto com este nome.';
    return;
  }
  const produto = { id: id || proximoId(produtos), nome, categoria, unidade, quantidade, estoqueMinimo };
  const indice = produtos.findIndex(item => item.id === id);
  if (indice >= 0) produtos[indice] = produto;
  else produtos.push(produto);
  if (!salvarProdutos(produtos)) {
    erroFormulario.textContent = 'Não foi possível salvar o produto neste navegador.';
    return;
  }
  fecharModal();
  mensagem.className = 'mensagem';
  mensagem.textContent = id ? 'Produto atualizado.' : 'Produto cadastrado.';
  mostrarProdutos();
});

mostrarProdutos();
