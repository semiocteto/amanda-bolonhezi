(function () {
  const dialog = document.querySelector('.vm-dialog');
  if (!dialog) return;
  const selected = dialog.querySelector('#vm-selected-plan');
  const closeButtons = dialog.querySelectorAll('.vm-dialog-close, .vm-dialog-ok');
  const close = () => {
    dialog.hidden = true;
    document.body.classList.remove('dialog-open');
  };
  document.querySelectorAll('.vm-checkout').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      selected.textContent = button.dataset.plan || 'escolhido';
      dialog.hidden = false;
      document.body.classList.add('dialog-open');
    });
  });
  closeButtons.forEach((button) => button.addEventListener('click', close));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !dialog.hidden) close(); });
}());
