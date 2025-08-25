// ===================== app.js =====================

// ===== Settings =====
const DEFAULT_LANG = 'ru';
const COMPANY_EMAIL = 'office@gcclog.com';
const TELEGRAM_USERNAME = 'yourtelegram'; // ← set without @

// UI texts
const t = {
  ru: {
    h1: 'Таможенный брокер',
    cta: 'Отправить заявку',
    ctaClient: 'Стать нашим клиентом',
    orSend: 'Или отправьте информацию на:',
    copy: 'Скопировать',
    copied: 'Скопировано',
    write: 'Написать',
    company: 'GCC',
    subject: 'Запрос: таможенное оформление (B2B)',
    body: 'Здравствуйте! Нужна помощь таможенного брокера. Кратко: ...',
    form: {
      type: 'Тип заявки',
      export: 'Экспорт',
      import: 'Импорт',
      transit: 'Транзит',
      subject: 'Тема заявки',
      subjectPH: 'Например: Оформление груза 20FT, Китай → Латвия',
      body: 'Текст заявки',
      bodyPH: 'Опишите задачу: товар, код ТН ВЭД (если есть), маршрут, сроки и т.д.',
      files: 'Файлы',
      cancel: 'Отмена',
      submit: 'Отправить'
    },
    client: {
      company: 'Название компании',
      companyPH: 'Например: SIA «Baltic Trade»',
      contacts: 'Контактные данные',
      contactsPH: 'Имя, телефон, e-mail, сайт',
      source: 'Откуда узнали о компании',
      sourcePH: 'Рекомендации, Google, соцсети и т.п.',
      cancel: 'Отмена',
      submit: 'Отправить',
      mailSubject: 'Новый клиент'
    }
  },
  en: {
    h1: 'Customs Broker',
    cta: 'Send Request',
    ctaClient: 'Become our client',
    orSend: 'Or send the information to:',
    copy: 'Copy',
    copied: 'Copied',
    write: 'Write',
    company: 'GCC',
    subject: 'Inquiry: customs clearance (B2B)',
    body: 'Hello! We need customs brokerage support. Briefly: ...',
    form: {
      type: 'Request type',
      export: 'Export',
      import: 'Import',
      transit: 'Transit',
      subject: 'Subject',
      subjectPH: 'e.g. 20FT cargo clearance, China → Latvia',
      body: 'Message',
      bodyPH: 'Describe: goods, HS code (if any), route, timing, etc.',
      files: 'Files',
      cancel: 'Cancel',
      submit: 'Send'
    },
    client: {
      company: 'Company name',
      companyPH: 'e.g. SIA “Baltic Trade”',
      contacts: 'Contact details',
      contactsPH: 'Name, phone, e-mail, website',
      source: 'How did you hear about us?',
      sourcePH: 'Referral, Google, social media, etc.',
      cancel: 'Cancel',
      submit: 'Send',
      mailSubject: 'New client'
    }
  },
  lv: {
    h1: 'Muitas brokeris',
    cta: 'Nosūtīt pieprasījumu',
    ctaClient: 'Kļūt par mūsu klientu',
    orSend: 'Vai sūtīt informāciju uz:',
    copy: 'Kopēt',
    copied: 'Nokopēts',
    write: 'Rakstīt',
    company: 'GCC',
    subject: 'Pieprasījums: muitas noformēšana (B2B)',
    body: 'Labdien! Nepieciešams muitas brokera atbalsts. Īsumā: ...',
    form: {
      type: 'Pieprasījuma tips',
      export: 'Eksports',
      import: 'Imports',
      transit: 'Tranzīts',
      subject: 'Temats',
      subjectPH: 'Piem.: 20FT kravas noformēšana, Ķīна → Latvija',
      body: 'Ziņojums',
      bodyPH: 'Aprakstiet: preces, HS kods (ja ir), maršruts, termiņi utt.',
      files: 'Faili',
      cancel: 'Atcelt',
      submit: 'Nosūtīt'
    },
    client: {
      company: 'Uzņēmuma nosaukums',
      companyPH: 'Piem.: SIA “Baltic Trade”',
      contacts: 'Kontaktinformācija',
      contactsPH: 'Vārds, tālrunis, e-pasts, mājaslapa',
      source: 'Kā uzzinājāt par mums?',
      sourcePH: 'Ieteikums, Google, sociālie tīkli u.c.',
      cancel: 'Atcelt',
      submit: 'Nosūtīt',
      mailSubject: 'Jauns klients'
    }
  }
};

// Typing phrases
const typingPhrase = {
  ru: 'Экспортные, Транзитные, Импортные процедуры',
  en: 'Export, Transit, Import procedures',
  lv: 'Eksporta, Tranzīta, Importa procedūras'
};
const typingPhrase2 = {
  ru: 'Сопровождение международных сделок и логистики',
  en: 'Support for international transactions and logistics',
  lv: 'Starptautisko darījumu un loģistikas atbalsts'
};

// typing speeds
const TYPE_SPEED_MAIN = 60;
const TYPE_SPEED_SUB  = 60;

// ===== DOM =====
const langButtons         = document.querySelectorAll('.lang-switch button');
const contactEmail        = document.getElementById('contactEmail');
const contactEmailMeta    = document.getElementById('contactEmailMeta');
const contactTelegramCard = document.getElementById('contactTelegramCard') || document.getElementById('contactTelegram');
const copyEmailBtn        = document.getElementById('copyEmailBtn');
const copyTelegramBtn     = document.getElementById('copyTelegramBtn');
const writeTelegramBtn    = document.getElementById('writeTelegramBtn');
const telegramHandleMeta  = document.getElementById('telegramHandleMeta');

const typingText  = document.getElementById('typingText');
const typingText2 = document.getElementById('typingText2');

// Request form DOM
const openRequestBtn   = document.getElementById('openRequestBtn');
const requestForm      = document.getElementById('requestForm');
const cancelRequestBtn = document.getElementById('cancelRequest');
const reqSubject       = document.getElementById('reqSubject');
const reqBody          = document.getElementById('reqBody');

// Client form DOM
const openClientBtn    = document.getElementById('openClientBtn');
const clientForm       = document.getElementById('clientForm');
const cancelClientBtn  = document.getElementById('cancelClient');
const clientCompany    = document.getElementById('clientCompany');
const clientContacts   = document.getElementById('clientContacts');
const clientSource     = document.getElementById('clientSource');
const clientSubjectH   = document.getElementById('clientSubjectHidden');
const clientLangH      = document.getElementById('clientLangHidden');

// Backdrop (reuse)
let backdrop = document.getElementById('backdrop');
if (!backdrop) {
  backdrop = document.createElement('div');
  backdrop.id = 'backdrop';
  backdrop.hidden = true;
  document.body.appendChild(backdrop);
}

let currentLang = DEFAULT_LANG;
let currentHandle = '';

// ===== Typing effect =====
let typingTimer = null, typingPhraseNow = '', typingIndex = 0;
let typingTimer2 = null, typingPhrase2Now = '', typingIndex2 = 0;

function startTyping(lang){
  if (!typingText) return;
  if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
  typingPhraseNow = (typingPhrase[lang] || typingPhrase[DEFAULT_LANG] || '').trim();
  typingIndex = 0;
  typingText.textContent = '';
  document.querySelector('.typing')?.classList.remove('done');
  typingStep();
}
function typingStep(){
  if (typingIndex < typingPhraseNow.length){
    typingText.textContent = typingPhraseNow.substring(0, typingIndex + 1);
    typingIndex++;
    typingTimer = setTimeout(typingStep, TYPE_SPEED_MAIN);
  } else {
    document.querySelector('.typing')?.classList.add('done');
    startTyping2(currentLang);
  }
}
function startTyping2(lang){
  if (!typingText2) return;
  if (typingTimer2) { clearTimeout(typingTimer2); typingTimer2 = null; }
  typingPhrase2Now = (typingPhrase2[lang] || typingPhrase2[DEFAULT_LANG] || '').trim();
  typingIndex2 = 0;
  typingText2.textContent = '';
  document.querySelector('.typing.secondary')?.classList.remove('done');
  typingStep2();
}
function typingStep2(){
  if (typingIndex2 < typingPhrase2Now.length){
    typingText2.textContent = typingPhrase2Now.substring(0, typingIndex2 + 1);
    typingIndex2++;
    typingTimer2 = setTimeout(typingStep2, TYPE_SPEED_SUB);
  } else {
    document.querySelector('.typing.secondary')?.classList.add('done');
  }
}

// ===== Contacts =====
function updateContacts(lang) {
  if (contactEmail) {
    const subject = t[lang].subject;
    const body    = t[lang].body;
    contactEmail.href = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  if (contactEmailMeta) contactEmailMeta.textContent = COMPANY_EMAIL;

  const handle = String(TELEGRAM_USERNAME||'').replace(/^@/, '');
  currentHandle = handle;
  if (telegramHandleMeta) telegramHandleMeta.textContent = handle ? `@${handle}` : '@username';
}

// ===== Language =====
function setLang(lang) {
  const dict = t[lang] || t[DEFAULT_LANG];
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  updateContacts(lang);

  // Ключи форм
  i18nForm(lang);
  i18nClientForm(lang);

  // Обновляем скрытый язык для отправки
  if (clientLangH) clientLangH.value = lang;

  // typing reset
  if (typingTimer)  { clearTimeout(typingTimer); typingTimer = null; }
  if (typingTimer2) { clearTimeout(typingTimer2); typingTimer2 = null; }
  if (typingText)  { typingText.textContent=''; document.querySelector('.typing')?.classList.remove('done'); }
  if (typingText2) { typingText2.textContent=''; document.querySelector('.typing.secondary')?.classList.remove('done'); }
  startTyping(lang);

  if (copyEmailBtn)     { copyEmailBtn.textContent = t[lang].copy;     copyEmailBtn.setAttribute('aria-pressed','false'); }
  if (copyTelegramBtn)  { copyTelegramBtn.textContent = t[lang].copy;  copyTelegramBtn.setAttribute('aria-pressed','false'); }
  if (writeTelegramBtn) { writeTelegramBtn.textContent = t[lang].write; }

  langButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  localStorage.setItem('lang', lang);
}

// Формы i18n
function i18nForm(lang) {
  const f = t[lang]?.form || t[DEFAULT_LANG].form;
  document.querySelector('.field .field-label')?.replaceChildren(document.createTextNode(f.type));

  const radios = document.querySelectorAll('.radio-group label');
  if (radios.length >= 3) {
    const map = [f.export, f.import, f.transit];
    radios.forEach((lab, idx) => {
      const nodeAfterInput = lab.childNodes[lab.childNodes.length - 1];
      if (nodeAfterInput && nodeAfterInput.nodeType === 3) {
        nodeAfterInput.nodeValue = ' ' + map[idx];
      } else {
        lab.append(' ' + map[idx]);
      }
    });
  }
  document.querySelector('label[for="reqSubject"]')?.replaceChildren(document.createTextNode(f.subject));
  document.querySelector('label[for="reqBody"]')?.replaceChildren(document.createTextNode(f.body));
  document.querySelector('label[for="reqFiles"]')?.replaceChildren(document.createTextNode(f.files));

  const reqSubject = document.getElementById('reqSubject');
  const reqBody    = document.getElementById('reqBody');
  if (reqSubject) reqSubject.placeholder = f.subjectPH;
  if (reqBody)    reqBody.placeholder    = f.bodyPH;

  const cancelBtn = document.getElementById('cancelRequest');
  const submitBtn = document.getElementById('submitRequest');
  if (cancelBtn) cancelBtn.textContent = f.cancel;
  if (submitBtn) submitBtn.textContent = f.submit;
}
function i18nClientForm(lang){
  const c = t[lang]?.client || t[DEFAULT_LANG].client;
  document.querySelector('label[for="clientCompany"]')?.replaceChildren(document.createTextNode(c.company));
  document.querySelector('label[for="clientContacts"]')?.replaceChildren(document.createTextNode(c.contacts));
  document.querySelector('label[for="clientSource"]')?.replaceChildren(document.createTextNode(c.source));
  if (clientCompany)  clientCompany.placeholder  = c.companyPH;
  if (clientContacts) clientContacts.placeholder = c.contactsPH;
  if (clientSource)   clientSource.placeholder   = c.sourcePH;
  const cancelBtn = document.getElementById('cancelClient');
  const submitBtn = document.getElementById('submitClient');
  if (cancelBtn) cancelBtn.textContent = c.cancel;
  if (submitBtn) submitBtn.textContent = c.submit;
}

// init
langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
const saved = localStorage.getItem('lang'); setLang(saved || DEFAULT_LANG);

// ===== Copy helpers =====
async function copyToClipboard(btn, text){
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    if (btn) {
      btn.setAttribute('aria-pressed','true');
      const prev = btn.textContent; btn.textContent = t[currentLang].copied;
      setTimeout(()=>{ btn.setAttribute('aria-pressed','false'); btn.textContent = prev || t[currentLang].copy; }, 2000);
    }
  } catch(e) { }
}
copyEmailBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); copyToClipboard(copyEmailBtn, COMPANY_EMAIL); });
copyTelegramBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); copyToClipboard(copyTelegramBtn, currentHandle?`@${currentHandle}`:'@username'); });
writeTelegramBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); if(currentHandle){ window.open(`https://t.me/${currentHandle}`,'_blank','noopener'); }});

// ===== Top-sheet logic (two forms) =====
function openRequestSheet() {
  if (!requestForm) return;
  requestForm.hidden = false;
  requestForm.classList.add('open');
  document.body.classList.add('no-scroll');
  backdrop.hidden = false;
  setTimeout(()=>{ document.getElementById('reqSubject')?.focus(); }, 30);
}
function closeRequestSheet() {
  if (!requestForm) return;
  requestForm.classList.remove('open');
  document.body.classList.remove('no-scroll');
  backdrop.hidden = true;
  setTimeout(()=>{ requestForm.hidden = true; }, 180);
}
function openClientSheet() {
  if (!clientForm) return;
  clientForm.hidden = false;
  clientForm.classList.add('open');
  document.body.classList.add('no-scroll');
  backdrop.hidden = false;
  setTimeout(()=>{ clientCompany?.focus(); }, 30);
}
function closeClientSheet() {
  if (!clientForm) return;
  clientForm.classList.remove('open');
  document.body.classList.remove('no-scroll');
  backdrop.hidden = true;
  setTimeout(()=>{ clientForm.hidden = true; }, 180);
}
function closeAnySheet(){
  if (clientForm && !clientForm.hidden) closeClientSheet();
  if (requestForm && !requestForm.hidden) closeRequestSheet();
}
document.getElementById('openRequestBtn')?.addEventListener('click', openRequestSheet);
document.getElementById('cancelRequest')?.addEventListener('click', closeRequestSheet);
document.getElementById('openClientBtn')?.addEventListener('click', openClientSheet);
document.getElementById('cancelClient')?.addEventListener('click', closeClientSheet);
backdrop?.addEventListener('click', closeAnySheet);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeAnySheet(); });

// ===== Submit handlers =====
function getReqType(){ return (document.querySelector('input[name="reqType"]:checked')?.value) || 'export'; }

// — Заявка: как было — mailto
document.getElementById('requestForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const type = getReqType();
  const typeLabel = { export: t[currentLang].form.export, import: t[currentLang].form.import, transit: t[currentLang].form.transit }[type];
  const subj = (document.getElementById('reqSubject')?.value || '').trim();
  const body = (document.getElementById('reqBody')?.value || '').trim();
  const subject = `Заявка: ${typeLabel}${subj ? ' — ' + subj : ''}`;
  const text = [
    `Тип: ${typeLabel}`,
    `Тема: ${subj || '(не указана)'}`,
    '',
    body || '(пусто)',
    '',
    'Файлы приложите ответным письмом или отправьте в Telegram.'
  ].join('\n');
  window.location.href = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
});

// — Стать клиентом: отправляем на внешний сервис, без сервера
document.getElementById('clientForm')?.addEventListener('submit',(e)=>{
  // валидация
  const company  = (clientCompany?.value || '').trim();
  const contacts = (clientContacts?.value || '').trim();
  const source   = (clientSource?.value || '').trim();
  if (!company || !contacts || !source) {
    e.preventDefault();
    alert(currentLang==='lv' ? 'Lūdzu, aizpildiet visus lauciņus.' :
          currentLang==='en' ? 'Please fill in all required fields.' :
          'Пожалуйста, заполните все обязательные поля.');
    return;
  }
  // динамический сабжект (подхватит FormSubmit через hidden _subject)
  if (clientSubjectH) {
    const subjBase = t[currentLang]?.client?.mailSubject || 'New client';
    clientSubjectH.value = `${subjBase} — ${company}`;
  }
  // язык уже кладём в clientLangH внутри setLang()
  // не вызываем preventDefault — пусть форма уходит на внешний endpoint
});
