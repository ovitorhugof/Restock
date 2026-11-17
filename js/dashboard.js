const produtosDashboard = carregarProdutos();
const movimentacoesDashboard = carregarMovimentacoes();
const baixos = produtosDashboard.filter(produto => Number(produto.quantidade) <= Number(produto.estoqueMinimo));

document.getElementById('total-produtos').textContent = produtosDashboard.length;
document.getElementById('estoque-baixo').textContent = baixos.length;
document.getElementById('total-entradas').textContent = movimentacoesDashboard.filter(movimentacao => !eSaida(movimentacao.tipo)).length;
document.getElementById('total-saidas').textContent = movimentacoesDashboard.filter(movimentacao => eSaida(movimentacao.tipo)).length;

document.getElementById('lista-baixo').innerHTML = baixos.length
  ? baixos.map(produto => `<tr><td>${escaparHtml(produto.nome)}</td><td>${escaparHtml(produto.categoria)}</td><td>${formatarNumero(produto.quantidade)} ${escaparHtml(produto.unidade)}</td><td>${formatarNumero(produto.estoqueMinimo)} ${escaparHtml(produto.unidade)}</td><td><span class="status status-baixo">Atenção</span></td></tr>`).join('')
  : '<tr><td colspan="5" class="vazio">Nenhum item precisa de reposição.</td></tr>';
