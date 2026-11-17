const listaHistorico = document.getElementById('lista-historico');

function mostrarHistorico() {
  const nome = document.getElementById('filtro-produto').value.trim().toLocaleLowerCase('pt-BR');
  const tipo = document.getElementById('filtro-tipo').value;
  const itens = carregarMovimentacoes()
    .filter(movimentacao => movimentacao.produtoNome.toLocaleLowerCase('pt-BR').includes(nome) && (!tipo || movimentacao.tipo === tipo))
    .sort((primeiro, segundo) => new Date(segundo.data) - new Date(primeiro.data));

  listaHistorico.innerHTML = itens.length
    ? itens.map(movimentacao => `<tr><td>${formatarData(movimentacao.data)}</td><td>${escaparHtml(movimentacao.produtoNome)}</td><td><span class="tipo ${eSaida(movimentacao.tipo) ? 'tipo-saida' : 'tipo-entrada'}">${escaparHtml(movimentacao.tipo)}</span></td><td>${formatarNumero(movimentacao.quantidade)} ${escaparHtml(movimentacao.unidade)}</td><td>${escaparHtml(movimentacao.usuario)}</td><td>${escaparHtml(movimentacao.observacao || '—')}</td></tr>`).join('')
    : '<tr><td colspan="6" class="vazio">Nenhuma movimentação encontrada.</td></tr>';
}

document.getElementById('filtro-produto').addEventListener('input', mostrarHistorico);
document.getElementById('filtro-tipo').addEventListener('change', mostrarHistorico);
mostrarHistorico();
