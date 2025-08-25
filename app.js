// ===================== app.js =====================

// ===== Settings =====
const DEFAULT_LANG = 'ru';
const COMPANY_EMAIL = 'office@gcclog.com';
const TELEGRAM_USERNAME = 'yourtelegram'; // без @

// i18n
const t = {
  ru: {
    h1: 'Таможенный брокер',
    copy: 'Скопировать',
    copied: 'Скопировано',
    write: 'Написать',
    company: 'GCC',
    subject: 'Запрос: таможенное оформление (B2B)',
    body: 'Здравствуйте! Нужна помощь таможенного брокера. Кратко: ...',
    drawer: { tgTitle: 'Написать в Telegram', mailTitle: 'Почта', close: 'Закрыть' }
  },
  en: {
    h1: 'Customs Broker',
    copy: 'Copy',
    copied: 'Copied',
    write: 'Write',
    company: 'GCC',
    subject: 'Inquiry: customs clearance (B2B)',
    body: 'Hello! We need customs brokerage support. Briefly: ...',
    drawer: { tgTitle: 'Message on Telegram', mailTitle: 'Email us', close: 'Close' }
  },
  lv: {
    h1: 'Muitas brokeris',
    copy: 'Kopēt',
    copied: 'Nokopēts',
    write: 'Rakstīt',
    company: 'GCC',
    subject: 'Pieprasījums: muitas noformēšana (B2B)',
    body: 'Labdien! Nepieciešams muitas brokera atbalsts. Īsumā: ...',
    drawer: { tgTitle: 'Rakstīt Telegram', mailTitle: 'E-pasts', close: 'Aizvērt' }
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

// ===== DOM =====
const langButtons = document.querySelectorAll('.lang-switch button');
const typingText  = document.getElementById('typingText');
const typingText2 = document.getElementById('typingText2');
document.getElementById('year')?.append(new Date().getFullYear());

// Dock + flyouts
const dockTelegram = document.getElementById('dockTelegram');
const dockEmail    = document.getElementById('dockEmail');
const backdrop     = document.getElementById('backdrop');

const flyoutTelegram     = document.getElementById('flyoutTelegram');
const flyoutTelegramHndl = document.getElementById('flyoutTelegramHandle');
const copyTgBtn          = document.getElementById('copyTgBtn');
const writeTgBtn         = document.getElementById('writeTgBtn');

const flyoutEmail        = document.getElementById('flyoutEmail');
const flyoutEmailLink    = document.getElementById('flyoutEmailLink');
const copyMailBtn        = document.getElementById('copyMailBtn');

let currentLang = DEFAULT_LANG;
let currentHandle = '';
let openId = null; // 'telegram' | 'email' | null

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

// ===== i18n & contacts =====
function updateContacts(lang) {
  const handle = String(TELEGRAM_USERNAME||'').replace(/^@/, '');
  currentHandle = handle;
  if (flyoutTelegramHndl) flyoutTelegramHndl.textContent = handle ? `@${handle}` : '@username';

  const subject = t[lang].subject, body = t[lang].body;
  const href = `mailto:${encodeURIComponent(COMPANY_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (flyoutEmailLink) {
    flyoutEmailLink.textContent = COMPANY_EMAIL;
    flyoutEmailLink.href = href;
  }
}

function setLang(lang) {
  const dict = t[lang] || t[DEFAULT_LANG];
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let val = key.split('.').reduce((acc,k)=>acc && acc[k], dict);
    if (typeof val === 'string') el.textContent = val;
  });

  document.querySelectorAll('.flyout-close').forEach(btn=>{
    btn.setAttribute('aria-label', dict.drawer.close);
  });

  updateContacts(lang);

  if(t1) clearTimeout(t1); if(t2) clearTimeout(t2);
  if(typingText) typingText.textContent=''; if(typingText2) typingText2.textContent='';
  startTyping(lang);

  langButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  localStorage.setItem('lang', lang);
}

langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
setLang(localStorage.getItem('lang') || DEFAULT_LANG);

// ===== Copy helpers =====
async function copyToClipboard(btn, text){
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta=document.createElement('textarea');
      ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    if (btn) {
      btn.setAttribute('aria-pressed','true');
      const prev = btn.textContent;
      btn.textContent = t[currentLang].copied;
      setTimeout(()=>{ btn.setAttribute('aria-pressed','false'); btn.textContent = prev || t[currentLang].copy; }, 2000);
    }
  } catch(e){}
}
copyTgBtn?.addEventListener('click', ()=> copyToClipboard(copyTgBtn, currentHandle?`@${currentHandle}`:'@username'));
writeTgBtn?.addEventListener('click', ()=>{
  if (currentHandle) window.open(`https://t.me/${currentHandle}`,'_blank','noopener');
});
copyMailBtn?.addEventListener('click', ()=> copyToClipboard(copyMailBtn, COMPANY_EMAIL));

// ===== Flyout logic: позиционирование по кнопке + toggle =====
function positionFlyout(panel, fromBtn){
  panel.classList.add('no-anim');
  panel.removeAttribute('hidden');
  panel.style.visibility = 'hidden';
  panel.style.transform = '';   // важно: не задаём inline-transform
  panel.style.top = '';         // сброс прошлых значений

  const btnRect = fromBtn.getBoundingClientRect();
  const panelH = panel.offsetHeight;
  const viewportH = window.innerHeight;

  const margin = 12;
  let top = btnRect.top + (btnRect.height/2) - (panelH/2);
  top = Math.max(margin, Math.min(top, viewportH - panelH - margin));

  panel.style.top = `${Math.round(top)}px`;

  const pointerOffset = Math.max(18, Math.min(panelH - 18, (btnRect.top + btnRect.height/2) - top));
  panel.style.setProperty('--pointer-offset', `${Math.round(pointerOffset)}px`);

  requestAnimationFrame(()=>{
    panel.style.visibility = 'visible';
    panel.classList.remove('no-anim');
    panel.classList.add('open');
  });
}

function openFlyout(id, fromBtn){
  const panel = id==='telegram' ? flyoutTelegram : flyoutEmail;
  const other = id==='telegram' ? flyoutEmail : flyoutTelegram;
  const otherBtn = id==='telegram' ? dockEmail : dockTelegram;

  if (!panel) return;

  // toggle: если уже открыт этот же — закрываем
  if (openId === id) { closeFlyout(); return; }

  // закрыть другой
  if (other && !other.hasAttribute('hidden')) {
    other.classList.remove('open');
    otherBtn?.setAttribute('aria-expanded','false');
    setTimeout(()=> other.setAttribute('hidden',''), 150);
  }

  positionFlyout(panel, fromBtn);
  backdrop?.removeAttribute('hidden');
  fromBtn?.setAttribute('aria-expanded','true');
  openId = id;
}

function closeFlyout(){
  if (!openId) return;
  const panel = openId==='telegram' ? flyoutTelegram : flyoutEmail;
  const btn = openId==='telegram' ? dockTelegram : dockEmail;
  panel?.classList.remove('open');
  btn?.setAttribute('aria-expanded','false');
  setTimeout(()=> panel?.setAttribute('hidden',''), 150);
  backdrop?.setAttribute('hidden','');
  openId = null;
}

// Buttons
dockTelegram?.addEventListener('click', ()=> openFlyout('telegram', dockTelegram));
dockEmail?.addEventListener('click', ()=> openFlyout('email', dockEmail));
backdrop?.addEventListener('click', closeFlyout);
document.querySelectorAll('.flyout-close').forEach(b=> b.addEventListener('click', closeFlyout));
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeFlyout(); });
