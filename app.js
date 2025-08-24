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
    body: 'Здравствуйте! Нужна помощь таможенного брокера. Кратко: ...'
  },
  en: {
    h1: 'Customs Broker',
    cta: 'Send Request',
    copy: 'Copy',
    copied: 'Copied',
    write: 'Write',
    company: 'GCC',
    subject: 'Inquiry: customs clearance (B2B)',
    body: 'Hello! We need customs brokerage support. Briefly: ...'
  },
  lv: {
    h1: 'Muitas brokeris',
    cta: 'Nosūtīt pieprasījumu',
    copy: 'Kopēt',
    copied: 'Nokopēts',
    write: 'Rakstīt',
    company: 'GCC',
    subject: 'Pieprasījums: muitas noformēšana (B2B)',
    body: 'Labdien! Nepieciešams muitas brokera atbalsts. Īsumā: ...'
  }
};

// Typing phrases (print once)
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
const langButtons       = document.querySelectorAll('.lang-switch button');
const contactEmail      = document.getElementById('contactEmail');            // <a>
const contactEmailMeta  = document.getElementById('contactEmailMeta');        // span text
// Поддержим оба варианта ID для контейнера Telegram (a→div):
const contactTelegramCard = document.getElementById('contactTelegramCard') || document.getElementById('contactTelegram');
const copyEmailBtn      = document.getElementById('copyEmailBtn');
const copyTelegramBtn   = document.getElementById('copyTelegramBtn');
const writeTelegramBtn  = document.getElementById('writeTelegramBtn');
const telegramHandleMeta= document.getElementById('telegramHandleMeta');

const typingText  = document.getElementById('typingText');
const typingText2 = document.getElementById('typingText2');

let currentLang = DEFAULT_LANG;
let currentHandle = '';

// ===== Typing effect (print once) =====
let typingTimer = null, typingPhraseNow = '', typingIndex = 0;
let typingTimer2 = null, typingPhrase2Now = '', typingIndex2 = 0;

function startTyping(lang){
  if (!typingText) return;
  if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
  typingPhraseNow = (typingPhrase[lang] || typingPhrase[DEFAULT_LANG] || '').trim();
  typingIndex = 0;
  typingText.textContent = '';
  const tEl = document.querySelector('.typing');
  if (tEl) tEl.classList.remove('done');
  typingStep();
}

function typingStep(){
  if (!typingText || !typingPhraseNow) return;
  if (typingIndex < typingPhraseNow.length){
    typingText.textContent = typingPhraseNow.substring(0, typingIndex + 1);
    typingIndex++;
    typingTimer = setTimeout(typingStep, TYPE_SPEED_MAIN);
  } else {
    const tEl = document.querySelector('.typing');
    if (tEl) tEl.classList.add('done');
    startTyping2(currentLang);
  }
}

function startTyping2(lang){
  if (!typingText2) return;
  if (typingTimer2) { clearTimeout(typingTimer2); typingTimer2 = null; }
  typingPhrase2Now = (typingPhrase2[lang] || typingPhrase2[DEFAULT_LANG] || '').trim();
  typingIndex2 = 0;
  typingText2.textContent = '';
  const tEl2 = document.querySelector('.typing.secondary');
  if (tEl2) tEl2.classList.remove('done');
  typingStep2();
}

function typingStep2(){
  if (!typingText2 || !typingPhrase2Now) return;
  if (typingIndex2 < typingPhrase2Now.length){
    typingText2.textContent = typingPhrase2Now.substring(0, typingIndex2 + 1);
    typingIndex2++;
    typingTimer2 = setTimeout(typingStep2, TYPE_SPEED_SUB);
  } else {
    const tEl2 = document.querySelector('.typing.secondary');
    if (tEl2) tEl2.classList.add('done');
  }
}

// ===== Contacts =====
function updateContacts(lang) {
  // Email (mailto с локализованными subject/body)
  if (contactEmail) {
    const subject = t[lang].subject;
    const body    = t[lang].body;
    const mailto  = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    contactEmail.href = mailto;
  }
  if (contactEmailMeta) contactEmailMeta.textContent = COMPANY_EMAIL;

  // Telegram (только отображаем handle; переход — по кнопке "Написать")
  const handle = String(TELEGRAM_USERNAME || '').replace(/^@/, '');
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

  // перезапустить typing
  if (typingTimer)  { clearTimeout(typingTimer);  typingTimer = null; }
  if (typingTimer2) { clearTimeout(typingTimer2); typingTimer2 = null; }
  if (typingText)  { typingText.textContent  = ''; document.querySelector('.typing')?.classList.remove('done'); }
  if (typingText2) { typingText2.textContent = ''; document.querySelector('.typing.secondary')?.classList.remove('done'); }
  startTyping(lang);

  // подписи на кнопках
  if (copyEmailBtn)     { copyEmailBtn.textContent = t[lang].copy;     copyEmailBtn.setAttribute('aria-pressed','false'); }
  if (copyTelegramBtn)  { copyTelegramBtn.textContent = t[lang].copy;  copyTelegramBtn.setAttribute('aria-pressed','false'); }
  if (writeTelegramBtn) { writeTelegramBtn.textContent = t[lang].write; }

  // aria-pressed для переключателя языка
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
  } catch(e) { /* no-op */ }
}

copyEmailBtn?.addEventListener('click', (e)=>{
  e.preventDefault(); e.stopPropagation();
  copyToClipboard(copyEmailBtn, COMPANY_EMAIL);
});
copyTelegramBtn?.addEventListener('click', (e)=>{
  e.preventDefault(); e.stopPropagation();
  const text = currentHandle ? `@${currentHandle}` : '@username';
  copyToClipboard(copyTelegramBtn, text);
});

// В Telegram — только по кнопке "Написать"
writeTelegramBtn?.addEventListener('click', (e)=>{
  e.preventDefault(); e.stopPropagation();
  const url = currentHandle ? `https://t.me/${currentHandle}` : null;
  if (url) window.open(url, '_blank', 'noopener');
});

// ===== Request form logic =====
const openRequestBtn   = document.getElementById('openRequestBtn');
const requestForm      = document.getElementById('requestForm');
const cancelRequestBtn = document.getElementById('cancelRequest');
const reqSubject       = document.getElementById('reqSubject');
const reqBody          = document.getElementById('reqBody');

function getReqType(){
  return (document.querySelector('input[name="reqType"]:checked')?.value) || 'export';
}

openRequestBtn?.addEventListener('click', () => {
  if (!requestForm) return;
  requestForm.hidden = false;
  requestForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

cancelRequestBtn?.addEventListener('click', () => {
  if (!requestForm) return;
  requestForm.hidden = true;
});

requestForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = getReqType();
  const typeLabel = { export: 'Экспорт', import: 'Импорт', transit: 'Транзит' }[type] || 'Экспорт';
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
  ].join('\n');

  const mailto = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  window.location.href = mailto;
});
