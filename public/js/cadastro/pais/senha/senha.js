document.addEventListener('DOMContentLoaded', () => {
  function bindToggleSenha(btnId, inputId, iconId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (btn && input && icon) {
      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.toggle('bi-eye-slash', !isPassword);
        icon.classList.toggle('bi-eye', isPassword);
      });
    }
  }

  bindToggleSenha('toggleSenha', 'senha', 'iconSenha');
  bindToggleSenha('toggleConfirmar', 'confirmar_senha', 'iconConfirmar');
});