// Quick Contact (floating urgent button + modal)
// All config here:
(function(){
  const CONFIG = {
    // ЗАМЕНИТЕ на свои данные:
    phoneVisible: '+371 0000 0000',
    phoneTel: '+37100000000',     // без пробелов
    whatsapp: '37100000000',      // без +, только цифры для wa.me
    telegram: 'your_company',     // username без @
    email: 'info@example.com',

    // Тексты (маленькая локализация по языку html[lang]):
    i18n: {
      en: { title: 'Contact us', close: 'Close', wapp: 'WhatsApp', tg: 'Telegram', phone: 'Phone', email: 'Email' },
      ru: { title: 'Связаться с нами', close: 'Закрыть', wapp: 'WhatsApp', tg: 'Telegram', phone: 'Телефон', email: 'Почта' },
      lv: { title: 'Sazināties ar mums', close: 'Aizvērt', wapp: 'WhatsApp', tg: 'Telegram', phone: 'Tālrunis', email: 'E-pasts' }
    }
  };

  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  const T = CONFIG.i18n[lang] || CONFIG.i18n.en;

  // 1) Находим существующую кнопку "For urgent inquiries" и превращаем в FAB
  let fab = document.getElementById('urgent-cta');
  if(!fab){
    // Если кнопки не было в верстке — создаём (но лучше оставить исходную для связки с lang.js)
    fab = document.createElement('button');
    fab.id = 'urgent-cta';
    fab.type = 'button';
    fab.textContent = 'For urgent inquiries';
    document.body.appendChild(fab);
  }
  fab.classList.add('qc-fab');
  fab.setAttribute('aria-haspopup', 'dialog');
  fab.setAttribute('aria-controls', 'qc-modal');

  // Переносим в body, чтобы позиционирование было стабильным
  if (fab.parentElement !== document.body) {
    fab.parentElement && fab.parentElement.removeChild(fab);
    document.body.appendChild(fab);
  }

  // Если родительский контейнер (.bottom-actions) остался пустой — уберём его, чтобы не висело пустое место
  const maybeActions = document.querySelector('.bottom-actions');
  if (maybeActions && maybeActions.children.length === 0) {
    maybeActions.remove();
  }

  // 2) Строим backdrop + modal (диалог)
  const backdrop = document.createElement('div');
  backdrop.className = 'qc-backdrop';
  backdrop.hidden = true;

  const modal = document.createElement('div');
  modal.className = 'qc-modal';
  modal.id = 'qc-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-labelledby','qc-title');
  modal.hidden = true;

  // Карточка
  const card = document.createElement('div');
  card.className = 'qc-card';

  const btnClose = document.createElement('button');
  btnClose.className = 'qc-close';
  btnClose.type = 'button';
  btnClose.setAttribute('aria-label', T.close);
  btnClose.innerHTML = '✕';

  const title = document.createElement('h3');
  title.className = 'qc-title';
  title.id = 'qc-title';
  title.textContent = T.title;

  const list = document.createElement('ul');
  list.className = 'qc-list';
  list.setAttribute('role','list');

  // Ссылки
  const aWapp = document.createElement('a');
  aWapp.className = 'qc-item';
  aWapp.href = `https://wa.me/${(CONFIG.whatsapp || '').replace(/\D/g,'')}`;
  aWapp.target = '_blank';
  aWapp.rel = 'noopener';
  aWapp.innerHTML = `<strong>${T.wapp}</strong>`;

  const aTg = document.createElement('a');
  aTg.className = 'qc-item';
  aTg.href = `https://t.me/${CONFIG.telegram || ''}`;
  aTg.target = '_blank';
  aTg.rel = 'noopener';
  aTg.innerHTML = `<strong>${T.tg}</strong>`;

  const aPhone = document.createElement('a');
  aPhone.className = 'qc-item';
  aPhone.href = `tel:${(CONFIG.phoneTel || '').replace(/\s/g,'')}`;
  aPhone.innerHTML = `<strong>${T.phone}</strong> <span>${CONFIG.phoneVisible}</span>`;

  const aEmail = document.createElement('a');
  aEmail.className = 'qc-item';
  aEmail.href = `mailto:${CONFIG.email || ''}`;
  aEmail.innerHTML = `<strong>${T.email}</strong> <span>${CONFIG.email}</span>`;

  [aWapp, aTg, aPhone, aEmail].forEach(a=>{
    const li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  });

  card.appendChild(btnClose);
  card.appendChild(title);
  card.appendChild(list);
  modal.appendChild(card);
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  // Фокус-ловушка
  let lastFocused = null;
  function getFocusable(){
    return Array.from(modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  function openModal(){
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;
    // Доступность: прячем основной контент от SR
    document.querySelector('header')?.setAttribute('aria-hidden','true');
    document.querySelector('main')?.setAttribute('aria-hidden','true');
    document.querySelector('footer')?.setAttribute('aria-hidden','true');

    // Классы видимости
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.classList.add('qc-open');

    const f = getFocusable();
    (f[0] || btnClose).focus();

    document.addEventListener('keydown', onKey);
  }

  function closeModal(){
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.classList.remove('qc-open');

    // Возвращаем доступность
    ['header','main','footer'].forEach(sel=>{
      const n = document.querySelector(sel);
      if(n) n.removeAttribute('aria-hidden');
    });

    // Небольшая задержка, чтобы анимация доснялась
    setTimeout(()=>{
      backdrop.hidden = true;
      modal.hidden = true;
      lastFocused && lastFocused.focus();
    }, 160);

    document.removeEventListener('keydown', onKey);
  }

  function onKey(e){
    if(e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if(e.key === 'Tab'){
      const f = getFocusable();
      if(f.length === 0) return;
      const first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  fab.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

// Клик по карточкам IM / EX / T1 и др. -> открыть модал контактов
document.addEventListener('click', function (e) {
  const cell = e.target.closest('.stats-cell');
  if (!cell) return;
  if (!cell.closest('.section-procedures')) return; // только блок "We work with"
  e.preventDefault();
  openModal(); // уже готовая функция
});

})();
