// ============================
// Quick Contact — header button + modal (tiles with inline actions)
// ============================
(function(){
  const CONFIG = {
    // ---- ЗАМЕНИ на реальные контакты ----
    phoneVisible: '+371 0000 0000',
    phoneTel: '+37100000000',     // без пробелов
    whatsapp: '37100000000',      // без +, только цифры для wa.me
    telegram: 'your_company',     // username без @
    email: 'info@example.com',

    // ---- Локализация интерфейса модалки ----
    i18n: {
      en: {
        title: 'Contact us',
        close: 'Close',
        wapp: 'WhatsApp',
        tg: 'Telegram',
        phone: 'Phone',
        email: 'Email',
        headerBtn: 'Inquiries',
        send: 'Send message',
        copy: 'Copy',
        copied: 'Copyed' // по твоей просьбе
      },
      ru: {
        title: 'Связаться с нами',
        close: 'Закрыть',
        wapp: 'WhatsApp',
        tg: 'Telegram',
        phone: 'Телефон',
        email: 'Почта',
        headerBtn: 'Для обращений',
        send: 'Написать',
        copy: 'Скопировать',
        copied: 'Скопировано'
      },
      lv: {
        title: 'Sazināties ar mums',
        close: 'Aizvērt',
        wapp: 'WhatsApp',
        tg: 'Telegram',
        phone: 'Tālrunis',
        email: 'E-pasts',
        headerBtn: 'Sazināties',
        send: 'Rakstīt ziņu',
        copy: 'Kopēt',
        copied: 'Nokopēts'
      }
    }
  };

  const getLang = () => (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  const T = (code) => (CONFIG.i18n[code] || CONFIG.i18n.en);

  // --------------------------
  // Создаём модал контактов
  // --------------------------
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

  const card = document.createElement('div');
  card.className = 'qc-card';

  const btnClose = document.createElement('button');
  btnClose.className = 'qc-close';
  btnClose.type = 'button';
  btnClose.innerHTML = '✕';

  const title = document.createElement('h3');
  title.className = 'qc-title';
  title.id = 'qc-title';

  const list = document.createElement('ul');
  list.className = 'qc-list';
  list.setAttribute('role','list');

  // ---------- ВСПОМОГАТЕЛЬНЫЕ ----------
  function openUrl(url){
    try { window.open(url, '_blank', 'noopener'); } catch { location.href = url; }
  }
  function copyText(txt){
    return new Promise(async (resolve, reject)=>{
      try{
        const text = String(txt || '').trim();
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        resolve();
      }catch(e){ reject(e); }
    });
  }

  // ---------- ФАБРИКА ПЛИТОК С ДЕЙСТВИЕМ ВНУТРИ ----------
  const tiles = []; // ссылки для локализации

  function createTile(type){
    const code = getLang();
    const t = T(code);

    const li = document.createElement('li');

    const tile = document.createElement('div');
    tile.className = `qc-tile ${type}`;
    tile.setAttribute('data-type', type);

    // "шапка" плитки (иконка через CSS ::before/::after)
    const head = document.createElement('div');
    head.className = 'qc-item';

    const strong = document.createElement('strong');
    const valueSpan = document.createElement('span');

    // Значения
    if (type === 'whatsapp'){
      valueSpan.textContent = '';
    } else if (type === 'telegram'){
      valueSpan.textContent = '';
    } else if (type === 'phone'){
      valueSpan.textContent = CONFIG.phoneVisible;
    } else if (type === 'email'){
      valueSpan.textContent = CONFIG.email;
    }

    head.appendChild(strong);
    if (valueSpan.textContent) head.appendChild(document.createTextNode(' '));
    if (valueSpan.textContent) head.appendChild(valueSpan);

    // Панель действий
    const actions = document.createElement('div');
    actions.className = 'qc-actions';

    let actionPrimary; // ссылка/кнопка действия
    let primaryExec;   // функция для клика по плитке

    if (type === 'whatsapp'){
      actionPrimary = document.createElement('a');
      actionPrimary.href = `https://wa.me/${(CONFIG.whatsapp || '').replace(/\D/g,'')}`;
      actionPrimary.target = '_blank';
      actionPrimary.rel = 'noopener';
      actionPrimary.className = 'qc-mini';
      primaryExec = () => openUrl(actionPrimary.href);
    }

    if (type === 'telegram'){
      actionPrimary = document.createElement('a');
      actionPrimary.href = `https://t.me/${CONFIG.telegram || ''}`;
      actionPrimary.target = '_blank';
      actionPrimary.rel = 'noopener';
      actionPrimary.className = 'qc-mini';
      primaryExec = () => openUrl(actionPrimary.href);
    }

    if (type === 'phone'){
      actionPrimary = document.createElement('button');
      actionPrimary.type = 'button';
      actionPrimary.className = 'qc-mini secondary';
      actionPrimary.dataset.state = 'idle';
      primaryExec = () => { location.href = `tel:${(CONFIG.phoneTel || '').replace(/\s/g,'')}`; };
      actionPrimary.addEventListener('click', async (e)=>{
        e.preventDefault();
        try{
          await copyText(CONFIG.phoneVisible);
          actionPrimary.dataset.state = 'copied';
          actionPrimary.textContent = T(getLang()).copied;
          actionPrimary.classList.add('success');
          setTimeout(()=>{
            actionPrimary.dataset.state = 'idle';
            actionPrimary.textContent = T(getLang()).copy;
            actionPrimary.classList.remove('success');
          }, 1800);
        }catch(_){}
      });
    }

    if (type === 'email'){
      actionPrimary = document.createElement('button');
      actionPrimary.type = 'button';
      actionPrimary.className = 'qc-mini secondary';
      actionPrimary.dataset.state = 'idle';
      primaryExec = () => { location.href = `mailto:${CONFIG.email || ''}`; };
      actionPrimary.addEventListener('click', async (e)=>{
        e.preventDefault();
        try{
          await copyText(CONFIG.email);
          actionPrimary.dataset.state = 'copied';
          actionPrimary.textContent = T(getLang()).copied;
          actionPrimary.classList.add('success');
          setTimeout(()=>{
            actionPrimary.dataset.state = 'idle';
            actionPrimary.textContent = T(getLang()).copy;
            actionPrimary.classList.remove('success');
          }, 1800);
        }catch(_){}
      });
    }

    // Клик по всей плитке = первичное действие
    tile.addEventListener('click', (e)=>{
      if (e.target.closest('.qc-mini')) return; // не мешаем клику по кнопке
      if (typeof primaryExec === 'function') primaryExec();
    });

    // Компоновка
    if (actionPrimary) actions.appendChild(actionPrimary);
    tile.appendChild(head);
    tile.appendChild(actions);
    li.appendChild(tile);
    list.appendChild(li);

    // Сохраняем ссылки для i18n
    tiles.push({ type, strong, actionPrimary });
  }

  // Сборка четырёх плиток
  createTile('whatsapp');
  createTile('telegram');
  createTile('phone');
  createTile('email');

  // Сборка модалки
  card.appendChild(btnClose);
  card.appendChild(title);
  card.appendChild(list);
  modal.appendChild(card);
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  // --------------------------
  // Открытие/закрытие + фокус
  // --------------------------
  let lastFocused = null;

  function getFocusable(){
    return Array.from(modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  function openModal(){
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;

    document.querySelector('header')?.setAttribute('aria-hidden','true');
    document.querySelector('main')?.setAttribute('aria-hidden','true');
    document.querySelector('footer')?.setAttribute('aria-hidden','true');

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

    ['header','main','footer'].forEach(sel=>{
      const n = document.querySelector(sel);
      if(n) n.removeAttribute('aria-hidden');
    });

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

  btnClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // --------------------------
  // Кнопка в хедере (слева от языка)
  // --------------------------
  function mountHeaderButton(){
    const langSwitch = document.querySelector('.lang-switch');
    if (!langSwitch || document.getElementById('qc-header-btn')) return;

    const code = getLang();
    const btn = document.createElement('button');
    btn.id = 'qc-header-btn';
    btn.type = 'button';
    btn.className = 'qc-header-btn';
    btn.textContent = T(code).headerBtn;
    btn.addEventListener('click', openModal);

    langSwitch.insertBefore(btn, langSwitch.firstChild);

    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHeaderButton);
  } else {
    mountHeaderButton();
  }

  // --------------------------
  // Динамическая локализация
  // --------------------------
  function applyLang(code){
    const t = T(code);

    title.textContent = t.title;
    btnClose.setAttribute('aria-label', t.close);

    // Заголовки в плитках
    tiles.forEach(({ type, strong, actionPrimary })=>{
      if (type === 'whatsapp') strong.textContent = t.wapp;
      if (type === 'telegram') strong.textContent = t.tg;
      if (type === 'phone')    strong.textContent = t.phone;
      if (type === 'email')    strong.textContent = t.email;

      // Кнопки действий
      if (!actionPrimary) return;
      if (type === 'whatsapp' || type === 'telegram'){
        actionPrimary.textContent = t.send;
      } else if (type === 'phone' || type === 'email'){
        actionPrimary.textContent = (actionPrimary.dataset.state === 'copied') ? t.copied : t.copy;
      }
    });

    const headerBtn = document.getElementById('qc-header-btn');
    if (headerBtn) headerBtn.textContent = t.headerBtn;
  }

  const qcLangObserver = new MutationObserver(list => {
    for (const m of list) {
      if (m.type === 'attributes' && m.attributeName === 'lang') {
        const code = getLang();
        applyLang(code);
      }
    }
  });
  qcLangObserver.observe(document.documentElement, { attributes: true });

  window.addEventListener('site:langchange', (e)=>{
    const code = (e && e.detail && e.detail.lang) ? String(e.detail.lang).toLowerCase() : getLang();
    applyLang(code);
  });

  applyLang(getLang());

  // --------------------------
  // Триггеры открытия из контента сайта (вне модалки)
  // --------------------------
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.proc-item');
    if (!card) return;
    e.preventDefault();
    openModal();
  });

  document.addEventListener('click', function (e) {
    const cell = e.target.closest('.stats-cell');
    if (!cell) return;
    if (!cell.closest('.section-procedures')) return;
    e.preventDefault();
    openModal();
  });

  // --------------------------
  // Экспорт простого API
  // --------------------------
  window.quickContact = window.quickContact || {};
  window.quickContact.open = openModal;
  window.quickContact.close = closeModal;
  window.quickContact.setLang = applyLang;

})();
