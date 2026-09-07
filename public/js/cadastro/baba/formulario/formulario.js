const form = document.getElementById('sitterBasicForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  sessionStorage.setItem('babysite_baba', JSON.stringify(data));
  window.location.href = '../antecedentes_criminais/antecedentes_criminais.html';
});
