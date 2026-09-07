const screenNames = {
  inicio: 'INÍCIO',
  perfil: 'PERFIL',
  conversas: 'CONVERSAS',
  entrevistas: 'ENTREVISTAS',
  configuracoes: 'CONFIGURAÇÕES'
};

function showScreen(screen) {
  document.querySelectorAll('.side-link').forEach((item) => item.classList.toggle('active', item.dataset.screen === screen));
  document.querySelectorAll('[data-screen-content]').forEach((item) => item.classList.toggle('active-screen', item.dataset.screenContent === screen));
  document.getElementById('breadcrumbName').textContent = screenNames[screen];
  document.getElementById('screenTitle').textContent = screenNames[screen].charAt(0) + screenNames[screen].slice(1).toLowerCase();
  document.body.classList.remove('sidebar-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2800);
}

function bindActions() {
  document.querySelectorAll('.side-link').forEach((item) => {
    item.addEventListener('click', () => showScreen(item.dataset.screen));
  });

  document.querySelectorAll('[data-screen-target]').forEach((item) => {
    item.addEventListener('click', () => showScreen(item.dataset.screenTarget));
  });

  document.querySelectorAll('[data-toast]').forEach((item) => {
    item.addEventListener('click', () => showToast(item.dataset.toast || 'Ação concluída.'));
  });

  document.querySelectorAll('.conversation').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.chat;
      document.getElementById('chatName').textContent = name;
      document.getElementById('chatNameFull').textContent = name;
      document.querySelectorAll('.conversation').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('messageInput');
    if (!input.value.trim()) return;
    const message = document.createElement('div');
    message.className = 'message sent';
    message.textContent = input.value.trim();
    document.getElementById('messages').appendChild(message);
    input.value = '';
    showToast('Mensagem enviada.');
  });

  document.getElementById('messageFormFull').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('messageInputFull');
    if (!input.value.trim()) return;
    const message = document.createElement('div');
    message.className = 'message sent';
    message.textContent = input.value.trim();
    document.querySelector('.large-messages').appendChild(message);
    input.value = '';
    showToast('Mensagem enviada.');
  });

}

document.addEventListener('DOMContentLoaded', bindActions);
