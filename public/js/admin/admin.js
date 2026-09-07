const screenNames = {
  inicio: 'INÍCIO',
  usuarios: 'USUÁRIOS',
  certidoes: 'CERTIDÕES',
  denuncias: 'DENÚNCIAS',
  relatorios: 'RELATÓRIOS',
  configuracoes: 'CONFIGURAÇÕES'
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
  document.querySelectorAll('.side-link').forEach((item) => item.addEventListener('click', () => showScreen(item.dataset.screen)));
  document.querySelectorAll('[data-screen-target]').forEach((item) => item.addEventListener('click', () => showScreen(item.dataset.screenTarget)));
  document.querySelectorAll('[data-toast]').forEach((item) => item.addEventListener('click', () => showToast(item.dataset.toast)));
  document.querySelectorAll('[data-ban]').forEach((item) => item.addEventListener('click', () => {
    const row = item.closest('tr');
    row.classList.add('row-muted');
    row.querySelector('.status').className = 'status';
    row.querySelector('.status').textContent = 'Banido';
    item.remove();
    showToast('Conta desativada e removida da rede.');
  }));
  document.querySelectorAll('[data-approve]').forEach((item) => item.addEventListener('click', () => {
    const card = item.closest('.document-card');
    card.querySelector('.status').className = 'status approved';
    card.querySelector('.status').textContent = 'Aprovado';
    item.remove();
    showToast('Certidão aprovada com sucesso.');
  }));
  document.querySelectorAll('[data-reject]').forEach((item) => item.addEventListener('click', () => {
    item.closest('.document-card').querySelector('.status').textContent = 'Novo documento solicitado';
    showToast('Solicitação enviada para a profissional.');
  }));

  const search = document.getElementById('userSearch');
  search.addEventListener('input', () => {
    const query = search.value.toLowerCase();
    document.querySelectorAll('#userTable tr').forEach((row) => {
      row.hidden = query && !row.textContent.toLowerCase().includes(query);
    });
  });
}

document.addEventListener('DOMContentLoaded', bindActions);
