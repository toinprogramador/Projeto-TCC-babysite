const form = document.getElementById('parentBasicForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  sessionStorage.setItem('babysite_pais', JSON.stringify(data));
  window.location.href = '../perfil/perfil.html';
});
