function usuarioLogado() { return lerDados(CHAVES.usuario, null); }

function sair() {
  localStorage.removeItem(CHAVES.usuario);
  window.location.href = 'index.html';
}

function configurarAcesso() {
  const formulario = document.getElementById('login-form');
  if (formulario) {
    if (usuarioLogado()) window.location.href = 'dashboard.html';
    formulario.addEventListener('submit', evento => {
      evento.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const senha = document.getElementById('senha').value;
      const mensagem = document.getElementById('mensagem-login');
      if (nome.length < 2) {
        mensagem.textContent = 'Informe seu nome para continuar.';
        return;
      }
      if (senha !== 'recanto2026') {
        mensagem.textContent = 'Senha incorreta.';
        document.getElementById('senha').focus();
        return;
      }
      if (!salvarDados(CHAVES.usuario, { nome })) {
        mensagem.textContent = 'Não foi possível guardar a identificação neste navegador.';
        return;
      }
      window.location.href = 'dashboard.html';
    });
    return;
  }

  const usuario = usuarioLogado();
  if (!usuario?.nome) {
    window.location.href = 'index.html';
    return;
  }
  const destino = document.getElementById('nome-usuario');
  if (destino) destino.textContent = usuario.nome;
}

configurarAcesso();
