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

async function loadProfile() {
  const token = localStorage.getItem('babysite_token');
  if (!token) {
    window.location.replace('../home/home.html');
    return;
  }
  try {
    const response = await fetch('/api/sessao', { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 401) {
      localStorage.removeItem('babysite_token');
      window.location.replace('../home/home.html');
      return;
    }
    if (!response.ok) throw new Error('Não foi possível carregar seu perfil.');
    const profile = await response.json();
    if (profile.tipo_usuario !== 'pais') {
      window.location.replace(profile.tipo_usuario === 'baba' ? '../baba/home-baba.html' : '../home/home.html');
      return;
    }
    document.getElementById('currentUserNameSidebar').textContent = profile.nome;
    document.getElementById('currentUserEmailSidebar').textContent = profile.email_1;
    document.getElementById('currentUserGreeting').textContent = profile.nome;
    document.querySelector('.user-avatar').textContent = profile.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    const requiredFields = [profile.nome, profile.email_1, profile.telefone];
    const completedFields = requiredFields.filter((value) => Boolean(value)).length;
    document.getElementById('profileCompletion').textContent = `${Math.round(completedFields / requiredFields.length * 100)}%`;
  } catch (error) {
    showToast(error.message);
  }
}

let babysitterProfiles = [];

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderBabysitters(profiles = babysitterProfiles) {
  const colors = ['coral', 'teal', 'gold'];
  const container = document.getElementById('visitorProfiles');
  document.getElementById('visitorResultCount').textContent = `${profiles.length} perfil${profiles.length === 1 ? '' : 'is'} disponível${profiles.length === 1 ? '' : 'is'}`;
  document.getElementById('activeSitterCount').textContent = profiles.length;
  document.getElementById('visitorHeroCount').textContent = profiles.length;
  container.innerHTML = profiles.length ? profiles.map((profile, index) => {
    const name = String(profile.nome || 'Profissional');
    const initials = escapeHTML(name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase());
    return `<article class="visitor-profile"><div class="profile-cover ${colors[index % colors.length]}"><strong>${initials}</strong><span>✓ ${escapeHTML(profile.status_cadastro)}</span></div><div><h3>${escapeHTML(name)}</h3><small>Babá cadastrada</small><p>Experiência não informada</p><label>Localização não informada</label><label>Tarifa não informada</label></div></article>`;
  }).join('') : '<p class="muted">Nenhuma babá ativa cadastrada.</p>';
}

async function loadBabysitters() {
  const container = document.getElementById('visitorProfiles');
  try {
    const response = await fetch('/api/babas');
    if (!response.ok) throw new Error('Não foi possível carregar as profissionais.');
    babysitterProfiles = await response.json();
    renderBabysitters();
  } catch (error) {
    container.textContent = error.message;
  }
}

function filterBabysitters() {
  const query = document.getElementById('visitorSearch').value.trim().toLowerCase();
  renderBabysitters(babysitterProfiles.filter((profile) => profile.nome.toLowerCase().includes(query)));
}

async function logout() {
  const token = localStorage.getItem('babysite_token');
  if (token) await fetch('/api/sessao', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  localStorage.removeItem('babysite_token');
  window.location.replace('../home/home.html');
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

document.addEventListener('DOMContentLoaded', () => {
  bindActions();
  loadProfile();
  const search = document.getElementById('visitorSearch');
  search.addEventListener('input', filterBabysitters);
  loadBabysitters();
});
