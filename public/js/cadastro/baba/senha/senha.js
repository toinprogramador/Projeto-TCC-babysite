const account = JSON.parse(sessionStorage.getItem('babysite_baba') || '{}');
document.getElementById('sitterPasswordForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const password = document.getElementById('senha').value;
  const confirmation = document.getElementById('confirmar_senha').value;
  const error = document.getElementById('passwordError');
  error.textContent = '';
  if (password.length < 8) { error.textContent = 'A senha deve ter pelo menos 8 caracteres.'; return; }
  if (password !== confirmation) { error.textContent = 'As senhas não conferem.'; return; }
  account.senha = password;
  localStorage.setItem('babysite_baba', JSON.stringify(account));
  sessionStorage.removeItem('babysite_baba');
  window.location.href = '../../../../baba/home-baba.html';
});
