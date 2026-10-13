const screenNames = {
  inicio: 'INÍCIO',
  perfil: 'PERFIL',
  conversas: 'CONVERSAS',
  entrevistas: 'ENTREVISTAS',
  contratos: 'CONTRATOS',
  configuracoes: 'CONFIGURAÇÕES'
};

function showScreen(screen) {
  document.querySelectorAll('.side-link').forEach((item) => item.classList.toggle('active', item.dataset.screen === screen));
  document.querySelectorAll('[data-screen-content]').forEach((item) => item.classList.toggle('active-screen', item.dataset.screenContent === screen));
  document.getElementById('breadcrumbName').textContent = screenNames[screen];
  document.getElementById('screenTitle').textContent = screenNames[screen].charAt(0) + screenNames[screen].slice(1).toLowerCase();
  if (screen === 'conversas' && !activeConversationId && conversations.length) {
    selectConversation(conversations[0].conversa_id);
  }
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
  currentProfile = profile;
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
    await loadConversations();
    conversationsPoll = window.setInterval(() => loadConversations(), 5000);
  } catch (error) {
    showToast(error.message);
  }
}

let babysitterProfiles = [];
let currentProfile = null;
let conversations = [];
let activeConversationId = null;
let conversationsPoll = null;

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
    return `<article class="visitor-profile"><div class="profile-cover ${colors[index % colors.length]}"><strong>${initials}</strong><span>✓ ${escapeHTML(profile.status_cadastro)}</span></div><div><h3>${escapeHTML(name)}</h3><small>Babá cadastrada</small><p>Experiência não informada</p><label>Localização não informada</label><label>Tarifa não informada</label><button class="secondary-button" type="button" data-profile-baba="${escapeHTML(profile.codigo_baba)}">Ver perfil</button></div></article>`;
  }).join('') : '<p class="muted">Nenhuma babá ativa cadastrada.</p>';
  container.querySelectorAll('[data-profile-baba]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = `perfil_baba/perfil_baba.html?codigo_baba=${encodeURIComponent(button.dataset.profileBaba)}`;
    });
  });
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

function getToken() {
  return localStorage.getItem('babysite_token');
}

async function requestApi(url, options = {}) {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.erro || 'Não foi possível concluir a solicitação.');
  }
  return response.status === 204 ? null : response.json();
}

function formatMessageTime(date) {
  return new Date(date.replace(' ', 'T') + (date.includes('Z') ? '' : 'Z'))
    .toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function renderConversationLists() {
  const lists = document.querySelectorAll('.conversation-list');
  const count = document.getElementById('conversationCount');
  const navCount = document.getElementById('conversationNavCount');
  if (count) count.textContent = `${conversations.length} conversa${conversations.length === 1 ? '' : 's'}`;
  if (navCount) navCount.textContent = conversations.length;
  lists.forEach((list) => {
    list.innerHTML = conversations.length ? conversations.map((conversation) => `
      <button class="conversation${Number(conversation.conversa_id) === activeConversationId ? ' active' : ''}"
              type="button" data-conversation-id="${conversation.conversa_id}">
        <span class="avatar coral">${escapeHTML(conversation.nome_contato.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase())}</span>
        <span><strong>${escapeHTML(conversation.nome_contato)}</strong>
        <small>${escapeHTML(conversation.ultima_mensagem || 'Inicie uma conversa')}</small></span>
      </button>`).join('') : '<p class="muted">Nenhuma conversa. Abra o perfil de uma babá e escolha “Conversar com a babá”.</p>';
  });
}

function renderMessages(messages) {
  const containers = [document.getElementById('messages'), document.querySelector('.large-messages')];
  containers.forEach((container) => {
    container.innerHTML = messages.length ? messages.map((message) => {
      const ownMessage = message.remetente_usuario_codigo === currentProfile?.usuario_codigo;
      return `<div class="message ${ownMessage ? 'sent' : 'received'}">
        <span>${escapeHTML(message.conteudo)}</span>
        <small>${escapeHTML(formatMessageTime(message.enviada_em))}</small>
      </div>`;
    }).join('') : `<p class="muted">${activeConversationId ? 'Nenhuma mensagem. Envie a primeira mensagem.' : 'Selecione uma conversa para ver as mensagens.'}</p>`;
    container.scrollTop = container.scrollHeight;
  });
}

function updateChatHeader(conversation) {
  document.querySelectorAll('#chatName, #chatNameFull').forEach((element) => {
    element.textContent = conversation?.nome_contato || 'Nenhuma conversa selecionada';
  });
  document.querySelectorAll('.chat-status').forEach((element) => {
    element.textContent = conversation ? 'Mensagens sincronizadas' : 'Selecione uma conversa';
  });
  document.querySelectorAll('.message-form input, .message-form button').forEach((element) => {
    element.disabled = !conversation;
  });
}

async function selectConversation(conversationId, refresh = true) {
  const conversation = conversations.find((item) => Number(item.conversa_id) === Number(conversationId));
  if (!conversation) return;
  activeConversationId = Number(conversation.conversa_id);
  renderConversationLists();
  updateChatHeader(conversation);
  if (refresh) {
    try {
      renderMessages(await requestApi(`/api/conversas/${activeConversationId}/mensagens`));
    } catch (error) {
      showToast(error.message);
    }
  }
}

async function loadConversations() {
  try {
    conversations = await requestApi('/api/conversas');
    renderConversationLists();
    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get('conversa_id'));
    const selection = conversations.find((item) => Number(item.conversa_id) === requestedId)
      || conversations.find((item) => Number(item.conversa_id) === activeConversationId)
      || (params.get('screen') === 'conversas' ? conversations[0] : null);
    if (selection) await selectConversation(selection.conversa_id);
    else {
      activeConversationId = null;
      updateChatHeader(null);
      renderMessages([]);
    }
  } catch (error) {
    if (conversationsPoll) {
      window.clearInterval(conversationsPoll);
      conversationsPoll = null;
    }
    showToast(error.message);
  }
}

async function sendMessage(form) {
  const input = form.querySelector('input');
  const conteudo = input.value.trim();
  if (!conteudo || !activeConversationId) return;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    await requestApi(`/api/conversas/${activeConversationId}/mensagens`, {
      method: 'POST',
      body: JSON.stringify({ conteudo })
    });
    input.value = '';
    await loadConversations();
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = !activeConversationId;
  }
}

function displayDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR');
}

function renderPendingRequests(requests) {
  const target = document.getElementById('pendingRequestList');
  target.innerHTML = requests.length ? requests.map((request) => {
    const title = request.tipo === 'entrevista' ? 'Entrevista' : 'Contratação';
    const date = request.tipo === 'entrevista' ? request.data_entrevista : request.data_inicio;
    const details = request.tipo === 'entrevista'
      ? `${displayDate(date)} às ${request.hora_entrevista} · ${request.formato}`
      : `${displayDate(date)} · ${request.horarios.map((item) => `${item.dia_semana} ${item.hora_inicio}–${item.hora_fim}`).join(', ')}`;
    return `<article class="appointment"><div><strong>${title} · ${escapeHTML(request.nome_baba)}</strong><small>${escapeHTML(details)}</small><small>Status: aguardando resposta da babá</small></div></article>`;
  }).join('') : '<p class="muted">Nenhuma solicitação pendente.</p>';
}

function renderInterviews(interviews) {
  const target = document.getElementById('interviewList');
  target.innerHTML = interviews.length ? interviews.map((item) => `
    <article class="appointment"><div><strong>${escapeHTML(item.nome_baba)}</strong>
    <small>${displayDate(item.data_entrevista)} às ${escapeHTML(item.hora_entrevista)} · ${escapeHTML(item.formato)}</small>
    <small>Status: ${escapeHTML(item.status)}</small></div></article>`).join('')
    : '<p class="muted">Nenhuma entrevista aceita registrada.</p>';
}

function renderContracts(contracts) {
  const target = document.getElementById('contractList');
  target.innerHTML = contracts.length ? contracts.map((item) => `
    <article class="appointment"><div><strong>${escapeHTML(item.nome_baba)} · início em ${displayDate(item.data_inicio)}</strong>
    <small>${item.horarios.map((horario) => `${escapeHTML(horario.dia_semana)} ${escapeHTML(horario.hora_inicio)}–${escapeHTML(horario.hora_fim)}`).join(' · ')}</small>
    <small>Status: ${escapeHTML(item.status)}</small></div></article>`).join('')
    : '<p class="muted">Nenhum contrato aceito registrado.</p>';
}

async function loadSchedule() {
  try {
    const [requests, interviews, contracts] = await Promise.all([
      requestApi('/api/solicitacoes/pendentes'),
      requestApi('/api/entrevistas'),
      requestApi('/api/contratos')
    ]);
    renderPendingRequests(requests);
    renderInterviews(interviews);
    renderContracts(contracts);
    document.querySelector('[data-screen="entrevistas"] .nav-count').textContent = requests.filter((item) => item.tipo === 'entrevista').length + interviews.length;
    document.querySelector('[data-screen="contratos"] .nav-count').textContent = contracts.length;
  } catch (error) {
    showToast(error.message);
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

  document.querySelectorAll('[data-scroll-target]').forEach((item) => {
    item.addEventListener('click', () => {
      document.getElementById(item.dataset.scrollTarget).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-toast]').forEach((item) => {
    item.addEventListener('click', () => showToast(item.dataset.toast || 'Ação concluída.'));
  });

  document.querySelectorAll('.conversation-list').forEach((list) => {
    list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-conversation-id]');
      if (button) selectConversation(button.dataset.conversationId);
    });
  });

  document.querySelectorAll('.message-form').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(form);
  }));

}

document.addEventListener('DOMContentLoaded', () => {
  bindActions();
  loadProfile();
  const search = document.getElementById('visitorSearch');
  search.addEventListener('input', filterBabysitters);
  loadBabysitters();
  if (getToken()) loadSchedule();
  const initialScreen = new URLSearchParams(window.location.search).get('screen');
  if (screenNames[initialScreen]) showScreen(initialScreen);
});
