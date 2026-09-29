function mostrarHistorico() {
  const nome = document.getElementById('filtro-produto').value.toLowerCase(), tipo = document.getElementById('filtro-tipo').value;
  const itens = carregarMovimentacoes().filter(m => m.produtoNome.toLowerCase().includes(nome) && (!tipo || m.tipo === tipo)).sort((a,b) => new Date(b.data) - new Date(a.data));
  document.getElementById('lista-historico').innerHTML = itens.length ? itens.map(m => `<tr><td>${new Date(m.data).toLocaleString('pt-BR')}</td><td>${m.produtoNome}</td><td><span class="tipo ${m.tipo === 'Entrada' ? 'tipo-entrada' : 'tipo-saida'}">${m.tipo}</span></td><td>${formatarNumero(m.quantidade)} ${m.unidade}</td><td>${m.usuario}</td><td>${m.observacao || '-'}</td></tr>`).join('') : '<tr><td colspan="6" class="vazio">Nenhuma movimentação encontrada.</td></tr>';
}
document.getElementById('filtro-produto').addEventListener('input', mostrarHistorico); document.getElementById('filtro-tipo').addEventListener('change', mostrarHistorico); mostrarHistorico();
