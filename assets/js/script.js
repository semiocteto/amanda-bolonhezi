// 1) CABEÇALHO COMPACTO (equivalente ao nav/nav-scrolled do Macedo)
(function () {
  const topos = document.querySelectorAll('.topo, .home-v2-header');
  if (!topos.length) return;

  let compacto = false;
  let atualizacaoPendente = false;

  function atualizarTopo() {
    const posicao = window.scrollY;
    if (!compacto && posicao > 112) compacto = true;
    if (compacto && posicao < 24) compacto = false;
    topos.forEach((topo) => topo.classList.toggle('compacto', compacto));
    atualizacaoPendente = false;
  }

  function solicitarAtualizacao() {
    if (atualizacaoPendente) return;
    atualizacaoPendente = true;
    window.requestAnimationFrame(atualizarTopo);
  }

  atualizarTopo();
  window.addEventListener('scroll', solicitarAtualizacao, { passive: true });
})();

// 2) FORMULÁRIO DE CONTATO + POPUP
(function () {
  const form = document.getElementById('contato-form');
  const popup = document.getElementById('popup-sucesso');
  const popupFechar = document.getElementById('popup-fechar');
  const popupOk = document.getElementById('popup-ok');

  if (!form || !popup) {
    // não estamos na página de contato; não faz nada
    return;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');

    const email = emailInput ? emailInput.value.trim() : '';
    const telefone = telefoneInput ? telefoneInput.value.trim() : '';

    if (!email) {
      alert('Por favor, informe um e-mail.');
      emailInput.focus();
      return;
    }

    if (!telefone) {
      alert('Por favor, informe um telefone.');
      telefoneInput.focus();
      return;
    }

    const formData = new FormData(form);
    const action = form.getAttribute('action');

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        popup.classList.add('ativo');
      } else {
        alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
      }
    } catch (error) {
      alert('Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.');
    }
  });

  function fecharPopup() {
    popup.classList.remove('ativo');
  }

  if (popupFechar) popupFechar.addEventListener('click', fecharPopup);
  if (popupOk) popupOk.addEventListener('click', fecharPopup);

  popup.addEventListener('click', function (event) {
    if (event.target === popup) {
      fecharPopup();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      fecharPopup();
    }
  });
})();

// 3) MENU MOBILE (HAMBÚRGUER) – igual toggleMenu, mas com body.menu-mobile-aberto
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const menuMobile = document.querySelector('.menu-mobile');

    if (!menuToggle || !menuMobile) return;

    // abre/fecha o menu mobile
    menuToggle.addEventListener('click', function () {
      body.classList.toggle('menu-mobile-aberto');
    });

    // fecha ao clicar em qualquer link do menu mobile
    menuMobile.addEventListener('click', function (event) {
      if (event.target.tagName.toLowerCase() === 'a') {
        body.classList.remove('menu-mobile-aberto');
      }
    });
  });
})();

(function () {
  const triggers = document.querySelectorAll('[data-notice-dialog-open]');
  if (!triggers.length) return;

  let activeDialog = null;
  let activeTrigger = null;

  function closeDialog() {
    if (!activeDialog) return;
    activeDialog.hidden = true;
    document.body.classList.remove('site-dialog-open');
    const trigger = activeTrigger;
    activeDialog = null;
    activeTrigger = null;
    if (trigger) trigger.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      const dialog = document.getElementById(trigger.dataset.noticeDialogOpen);
      if (!dialog) return;
      event.preventDefault();
      activeDialog = dialog;
      activeTrigger = trigger;
      dialog.hidden = false;
      document.body.classList.add('site-dialog-open');
      const closeButton = dialog.querySelector('.site-notice-dialog-close');
      if (closeButton) closeButton.focus();
    });
  });

  document.querySelectorAll('.site-notice-dialog').forEach(function (dialog) {
    dialog.querySelectorAll('.site-notice-dialog-close, .site-notice-dialog-ok').forEach(function (button) {
      button.addEventListener('click', closeDialog);
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && activeDialog) closeDialog();
  });
})();
