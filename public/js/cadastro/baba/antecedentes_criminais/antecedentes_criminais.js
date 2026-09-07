const account = JSON.parse(sessionStorage.getItem('babysite_baba') || '{}');
document.getElementById('criminalRecordForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const file = document.getElementById('certidao').files[0];
  if (file && file.type !== 'application/pdf') { document.getElementById('recordError').textContent = 'Envie sua certidão no formato PDF.'; return; }
  account.antecedentes_criminais = file ? file.name : 'não enviado';
  sessionStorage.setItem('babysite_baba', JSON.stringify(account));
  window.location.href = '../perfil/perfil.html';
});
