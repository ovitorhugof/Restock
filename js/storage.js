const CHAVES = { produtos: 'restock_produtos', movimentacoes: 'restock_movimentacoes', usuario: 'restock_usuario' };

function dadosIniciais() {
  if (localStorage.getItem(CHAVES.produtos) === null) {
    const produtos = [
      { id: 1, nome: 'Arroz', categoria: 'Grãos', unidade: 'kg', quantidade: 18, estoqueMinimo: 10 },
      { id: 2, nome: 'Feijão', categoria: 'Grãos', unidade: 'kg', quantidade: 6, estoqueMinimo: 8 },
      { id: 3, nome: 'Óleo de soja', categoria: 'Mercearia', unidade: 'L', quantidade: 12, estoqueMinimo: 6 },
      { id: 4, nome: 'Carne bovina', categoria: 'Carnes', unidade: 'kg', quantidade: 7, estoqueMinimo: 10 },
      { id: 5, nome: 'Frango', categoria: 'Carnes', unidade: 'kg', quantidade: 15, estoqueMinimo: 8 },
      { id: 6, nome: 'Refrigerante', categoria: 'Bebidas', unidade: 'L', quantidade: 24, estoqueMinimo: 12 },
      { id: 7, nome: 'Batata', categoria: 'Hortifruti', unidade: 'kg', quantidade: 20, estoqueMinimo: 8 },
      { id: 8, nome: 'Detergente', categoria: 'Limpeza', unidade: 'un', quantidade: 5, estoqueMinimo: 3 }
    ];
    salvarProdutos(produtos);
  }
  if (localStorage.getItem(CHAVES.movimentacoes) === null) {
    salvarMovimentacoes([
      { id: 101, produtoId: 1, produtoNome: 'Arroz', tipo: 'Entrada', quantidade: 10, unidade: 'kg', usuario: 'Administrador', observacao: 'Compra semanal', data: '2026-09-25T10:30:00' },
      { id: 102, produtoId: 4, produtoNome: 'Carne bovina', tipo: 'Saída', quantidade: 5, unidade: 'kg', usuario: 'Administrador', observacao: 'Uso no almoço', data: '2026-09-26T11:45:00' },
      { id: 103, produtoId: 6, produtoNome: 'Refrigerante', tipo: 'Entrada', quantidade: 12, unidade: 'L', usuario: 'Administrador', observacao: 'Reposição', data: '2026-09-27T09:15:00' }
    ]);
  }
}
function carregarProdutos() { return JSON.parse(localStorage.getItem(CHAVES.produtos)) || []; }
function salvarProdutos(produtos) { localStorage.setItem(CHAVES.produtos, JSON.stringify(produtos)); }
function carregarMovimentacoes() { return JSON.parse(localStorage.getItem(CHAVES.movimentacoes)) || []; }
function salvarMovimentacoes(movimentacoes) { localStorage.setItem(CHAVES.movimentacoes, JSON.stringify(movimentacoes)); }
function formatarNumero(numero) { return Number(numero).toLocaleString('pt-BR', { maximumFractionDigits: 2 }); }
dadosIniciais();
