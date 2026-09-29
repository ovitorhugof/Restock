const produtosDashboard = carregarProdutos();
const movimentacoesDashboard = carregarMovimentacoes();
const baixos = produtosDashboard.filter(p => Number(p.quantidade) <= Number(p.estoqueMinimo));
document.getElementById('total-produtos').textContent = produtosDashboard.length;
document.getElementById('estoque-baixo').textContent = baixos.length;
document.getElementById('total-entradas').textContent = movimentacoesDashboard.filter(m => m.tipo === 'Entrada').length;
document.getElementById('total-saidas').textContent = movimentacoesDashboard.filter(m => m.tipo === 'Saída').length;
document.getElementById('lista-baixo').innerHTML = baixos.length ? baixos.map(p => `<tr><td>${p.nome}</td><td>${p.categoria}</td><td>${formatarNumero(p.quantidade)} ${p.unidade}</td><td>${formatarNumero(p.estoqueMinimo)} ${p.unidade}</td><td><span class="status status-baixo">Estoque baixo</span></td></tr>`).join('') : '<tr><td colspan="5" class="vazio">Nenhum produto com estoque baixo.</td></tr>';
