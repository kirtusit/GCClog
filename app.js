// ===================== app.js =====================

// ===== Settings =====
const DEFAULT_LANG = 'ru';
const COMPANY_EMAIL = 'office@gcclog.com';
const TELEGRAM_USERNAME = 'yourtelegram'; // без @

// UI texts
const t = {
  ru: {
    h1: 'Таможенный брокер',
    ctaContact: 'Связаться с нами',
    orSend: 'Свяжитесь удобным способом:',
    copy: 'Скопировать',
    copied: 'Скопировано',
    write: 'Написать',
    company: 'GCC',
    subject: 'Запрос: таможенное оформление (B2B)',
    body: 'Здравствуйте! Нужна помощь таможенного брокера. Кратко: ...'
  },
  en: {
    h1: 'Customs Broker',
    ctaContact: 'Contact us',
    orSend: 'Get in touch:',
    copy: 'Copy',
    copied: 'Copied',
    write: 'Write',
    company: 'GCC',
    subject: 'Inquiry: customs clearance (B2B)',
    body: 'Hello! We need customs brokerage support. Briefly: ...'
  },
  lv: {
    h1: 'Muitas brokeris',
    ctaContact: 'Sazināties ar mums',
    orSend: 'Sazinieties ar mums:',
    copy: 'Kopēt',
    copied: 'Nokopēts',
    write: 'Rakstīt',
    company: 'GCC',
    subject: 'Pieprasījums: muitas noformēšana (B2B)',
    body: 'Labdien! Nepieciešams muitas brokera atbalsts. Īsumā: ...'
  }
};

// Фразы печатного эффекта
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

// ===== DOM =====
const langButtons = document.querySelectorAll('.lang-switch button');
const contactEmail = document.getElementById('contactEmail');
const contactEmailMeta = document.getElementById('contactEmailMeta');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyTelegramBtn = document.getElementById('copyTelegramBtn');
const writeTelegramBtn = document.getElementById('writeTelegramBtn');
const telegramHandleMeta = document.getElementById('telegramHandleMeta');
const contactsLabel = document.getElementById('contactsLabel');
const contactsRow = document.getElementById('contactsRow');
const openContactsBtn = document.getElementById('openContactsBtn');

const typingText  = document.getElementById('typingText');
const typingText2 = document.getElementById('typingText2');

let currentLang = DEFAULT_LANG;
let currentHandle = '';

// ===== Typing effect =====
let t1=null, t2=null, s1='', i1=0, s2t='', i2=0;
function startTyping(lang){
  if(!typingText) return;
  if(t1) clearTimeout(t1);
  s1=(typingPhrase[lang]||'').trim(); i1=0; typingText.textContent=''; step1();
}
function step1(){ if(i1<s1.length){ typingText.textContent=s1.slice(0,++i1); t1=setTimeout(step1,60);} else { startTyping2(currentLang);} }
function startTyping2(lang){
  if(!typingText2) return;
  if(t2) clearTimeout(t2);
  s2t=(typingPhrase2[lang]||'').trim(); i2=0; typingText2.textContent=''; step2();
}
function step2(){ if(i2<s2t.length){ typingText2.textContent=s2t.slice(0,++i2); t2=setTimeout(step2,60);} }

// ===== Contacts setup =====
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

// ===== Language switch =====
function setLang(lang) {
  const dict = t[lang] || t[DEFAULT_LANG];
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  updateContacts(lang);

  // restart typing
  if(t1) clearTimeout(t1); if(t2) clearTimeout(t2);
  if(typingText) typingText.textContent=''; if(typingText2) typingText2.textContent='';
  startTyping(lang);

  // подписи кнопок «скопировать/написать»
  if (copyEmailBtn)     { copyEmailBtn.textContent = t[lang].copy;    copyEmailBtn.setAttribute('aria-pressed','false'); }
  if (copyTelegramBtn)  { copyTelegramBtn.textContent = t[lang].copy; copyTelegramBtn.setAttribute('aria-pressed','false'); }
  if (writeTelegramBtn) { writeTelegramBtn.textContent = t[lang].write; }

  langButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  localStorage.setItem('lang', lang);
}

// init
langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
document.getElementById('year')?.append(new Date().getFullYear());
const saved = localStorage.getItem('lang'); setLang(saved || DEFAULT_LANG);

// ===== Copy helpers =====
async function copyToClipboard(btn, text){
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    if (btn){
      btn.setAttribute('aria-pressed','true');
      const prev=btn.textContent; btn.textContent=t[currentLang].copied;
      setTimeout(()=>{ btn.setAttribute('aria-pressed','false'); btn.textContent=prev||t[currentLang].copy; }, 2000);
    }
  } catch(e){}
}
copyEmailBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); copyToClipboard(copyEmailBtn, COMPANY_EMAIL); });
copyTelegramBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); copyToClipboard(copyTelegramBtn, currentHandle?`@${currentHandle}`:'@username'); });
writeTelegramBtn?.addEventListener('click',(e)=>{ e.preventDefault(); e.stopPropagation(); if(currentHandle){ window.open(`https://t.me/${currentHandle}`,'_blank','noopener'); }});

// ===== Показ контактов по кнопке =====
function showContactsAndScroll(){
  if (!contactsRow) return;

  // показать подпись + блок, если скрыты
  if (contactsLabel?.hasAttribute('hidden')) contactsLabel.removeAttribute('hidden');
  const firstReveal = contactsRow.hasAttribute('hidden');
  if (firstReveal) {
    contactsRow.removeAttribute('hidden');
    contactsRow.classList.add('reveal');
    openContactsBtn?.setAttribute('aria-expanded','true');
    setTimeout(()=>contactsRow.classList.remove('reveal'), 400);
    // небольшой таймаут, чтобы layout обновился перед скроллом
    setTimeout(()=>doScrollPulse(), 10);
  } else {
    doScrollPulse();
  }
}
function doScrollPulse(){
  contactsRow.scrollIntoView({ behavior:'smooth', block:'center' });
  contactsRow.classList.add('pulse');
  setTimeout(()=>contactsRow.classList.remove('pulse'), 1200);
}
openContactsBtn?.addEventListener('click', showContactsAndScroll);
