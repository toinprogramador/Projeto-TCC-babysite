document.addEventListener('DOMContentLoaded', () => {
  const inputFoto = document.getElementById('foto_perfil');
  const imgPreview = document.getElementById('img-preview');
  const placeholder = document.getElementById('preview-placeholder');

  if (inputFoto) {
    inputFoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          imgPreview.src = event.target.result;
          imgPreview.classList.remove('d-none');
          placeholder.classList.add('d-none');
        };

        reader.readAsDataURL(file);
      }
    });
  }
});