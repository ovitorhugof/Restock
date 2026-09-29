function usuarioLogado() { return JSON.parse(localStorage.getItem(CHAVES.usuario)); }
function sair() { localStorage.removeItem(CHAVES.usuario); window.location.href = 'index.html'; }

if (document.getElementById('login-form')) {
  if (usuarioLogado()) window.location.href = 'dashboard.html';
  document.getElementById('login-form').addEventListener('submit', function (evento) {
    evento.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const mensagem = document.getElementById('mensagem-login');
    if (!email || !senha) { mensagem.textContent = 'Preencha e-mail e senha para continuar.'; return; }
    localStorage.setItem(CHAVES.usuario, JSON.stringify({ nome: 'Administrador', email: email, tipo: 'administrador' }));
    window.location.href = 'dashboard.html';
  });
} else {
  const usuario = usuarioLogado();
  if (!usuario) window.location.href = 'index.html';
  const nome = document.getElementById('nome-usuario');
  if (nome && usuario) nome.textContent = usuario.nome;
}
