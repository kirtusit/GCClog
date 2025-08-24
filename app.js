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
    }
  },
  en: {
    h1: 'Customs Broker',
    cta: 'Send Request',
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
    }
  },
  lv: {
    h1: 'Muitas brokeris',
    cta: 'Nosūtīt pieprasījumu',
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
      subjectPH: 'Piem.: 20FT kravas noformēšana, Ķīna → Latvija',
      body: 'Ziņojums',
      bodyPH: 'Aprakstiet: preces, HS kods (ja ir), maršruts, termiņi utt.',
      files: 'Faili',
      cancel: 'Atcelt',
      submit: 'Nosūtīt'
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
const langButtons        = document.querySelectorAll('.lang-switch button');
const contactEmail       = document.getElementById('contactEmail');
const contactEmailMeta   = document.getElementById('contactEmailMeta');
const contactTelegramCard = document.getElementById('contactTelegramCard') || document.getElementById('contactTelegram');
const copyEmailBtn       = document.getElementById('copyEmailBtn');
const copyTelegramBtn    = document.getElementById('copyTelegramBtn');
const writeTelegramBtn   = document.getElementById('writeTelegramBtn');
const telegramHandleMeta = document.getElementById('telegramHandleMeta');

const typingText  = document.getElementById('typingText');
const typingText2 = document.getElementById('typingText2');

// Request form DOM
const openRequestBtn   = document.getElementById('openRequestBtn');
const requestForm      = document.getElementById('requestForm');
const cancelRequestBtn = document.getElementById('cancelRequest');
const reqSubject       = document.getElementById('reqSubject');
const reqBody          = document.getElementById('reqBody');

// Backdrop
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

// ===== Form i18n =====
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

  if (reqSubject) reqSubject.placeholder = f.subjectPH;
  if (reqBody)    reqBody.placeholder    = f.bodyPH;

  const cancelBtn = document.getElementById('cancelRequest');
  const submitBtn = document.getElementById('submitRequest');
  if (cancelBtn) cancelBtn.textContent = f.cancel;
  if (submitBtn) submitBtn.textContent = f.submit;
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
  i18nForm(lang);

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

// ===== Top-sheet logic =====
function openSheet() {
  if (!requestForm) return;
  requestForm.hidden = false;
  requestForm.classList.add('open');
  document.body.classList.add('no-scroll');
  backdrop.hidden = false;
  setTimeout(()=>{ reqSubject?.focus(); }, 30);
}
function closeSheet() {
  if (!requestForm) return;
  requestForm.classList.remove('open');
  document.body.classList.remove('no-scroll');
  backdrop.hidden = true;
  setTimeout(()=>{ requestForm.hidden = true; }, 180);
}
openRequestBtn?.addEventListener('click', openSheet);
cancelRequestBtn?.addEventListener('click', closeSheet);
backdrop?.addEventListener('click', closeSheet);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && requestForm && !requestForm.hidden) closeSheet(); });

// ===== Submit form =====
function getReqType(){
  return (document.querySelector('input[name="reqType"]:checked')?.value) || 'export';
}
requestForm?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const type = getReqType();
  const typeLabel = { export: t[currentLang].form.export, import: t[currentLang].form.import, transit: t[currentLang].form.transit }[type];
  const subj = (reqSubject?.value || '').trim();
  const body = (reqBody?.value || '').trim();
  const subject = `Заявка: ${typeLabel}${subj ? ' — ' + subj : ''}`;
  const text = [
    `Тип: ${typeLabel}`,
    `Тема: ${subj || '(не указана)'}`,
    '',
    body || '(пусто)',
    '',
    'Файлы приложите ответным письмом или отправьте в Telegram.'
  ].join('\\n');
  window.location.href = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
});
