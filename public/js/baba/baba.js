const screenNames = {
  inicio: 'INÍCIO',
  perfil: 'PERFIL',
  documentos: 'CERTIDÃO',
  entrevistas: 'ENTREVISTAS',
  conversas: 'CONVERSAS'
};

function showScreen(screen) {
  document.querySelectorAll('.side-link').forEach((item) => item.classList.toggle('active', item.dataset.screen === screen));
  document.querySelectorAll('[data-screen-content]').forEach((item) => item.classList.toggle('active-screen', item.dataset.screenContent === screen));
  document.getElementById('breadcrumbName').textContent = screenNames[screen];
  document.getElementById('screenTitle').textContent = screen === 'inicio' ? 'Visão geral' : screenNames[screen].charAt(0) + screenNames[screen].slice(1).toLowerCase();
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
      document.querySelectorAll('.conversation').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  document.getElementById('profileForm').addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Perfil profissional atualizado.');
  });

  document.getElementById('profileEditForm').addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Dados do perfil salvos.');
  });

  document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('messageInput');
    if (!input.value.trim()) return;
    const message = document.createElement('div');
    message.className = 'message sent';
    message.textContent = input.value.trim();
    document.querySelector('.messages').appendChild(message);
    input.value = '';
    showToast('Mensagem enviada.');
  });

  const pdfInput = document.getElementById('pdfUpload');
  if (pdfInput) {
    pdfInput.addEventListener('change', () => {
      const file = pdfInput.files[0];
      const fileName = document.getElementById('fileName');
      const fileStatus = document.getElementById('fileStatus');
      if (file) {
        fileName.innerHTML = `${file.name}<br><small>Documento selecionado</small>`;
        fileStatus.textContent = 'Documento pronto para análise';
        fileStatus.style.color = '#a3721b';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', bindActions);
