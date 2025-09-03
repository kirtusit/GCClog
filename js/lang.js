(function () {
  const STORAGE_KEY = 'site.lang';
  const DEFAULT_LANG = 'en';
  const ORDER = ['en', 'lv', 'ru'];

  // Заголовок вверху
  const STR = {
  en: 'ORDER PROCESS EXAMPLE',
  lv: 'PASŪTĪJUMA PROCESA PIEMĒRS',
  ru: 'ПРИМЕР ОБРАБОТКИ ПРОЦЕССА'
  };

  // Кнопка
  const BTN = {
  en: 'Become our client',
  lv: 'Kļūt par mūsu klientu', // либо atstāt 'Sazināties', скажи если нужно иначе
  ru: 'Стать нашим клиентом'
  };

  const URGENT = {
  en: 'For urgent inquiries',
  lv: 'Steidzamiem jautājumiem',
  ru: 'Для срочных обращений'
  };

  // Верхние три колонки
  const COL = {
    en: { import: 'Import - IM', export: 'Export - EX', transit: 'Transit - T1 / TIR Carnet' },
    ru: { import: 'Импорт - IM', export: 'Экспорт - EX', transit: 'Транзит - T1 / TIR Carnet' },
    lv: { import: 'Imports - IM', export: 'Eksports - EX', transit: 'Tranzīts - T1 / TIR Carnet' }
  };

  const DESC = {
  en: {
    import: 'Bringing goods into the European Union from other non-EU countries.',
    export: 'Shipment of goods outside the European Union.',
    transit: 'Movement of non-EU goods through the territory of the European Union.'
  },
  lv: {
    import: 'Preču ievešana Eiropas Savienībā no valstīm, kas nav ES.',
    export: 'Preču nosūtīšana ārpus Eiropas Savienības.',
    transit: 'Ne-ES preču pārvietošana pa Eiropas Savienības teritoriju.'
  },
  ru: {
    import: 'Ввоз товаров в Европейский союз из стран, не входящих в ЕС.',
    export: 'Отправка товаров за пределы Европейского союза.',
    transit: 'Перемещение товаров, не относящихся к ЕС, по территории Европейского союза.'
  }
};

  const FOOTER = {
  en: 'GCC 2025 All rights reserved.',
  lv: 'GCC 2025 Visas tiesības aizsargātas.',
  ru: 'GCC 2025 Все права защищены.'
};

  // Факты внизу слева
  const FACT = {
  en: {
    years: 'Over 15 years of successful experience',
    shipments: '10,000+ shipments cleared',
    declarations: 'Any complexity doesn’t matter'
  },
  lv: {
    years: 'Vairāk nekā 15 gadu veiksmīga pieredze',
    shipments: '10 000+ noformētu kravu',
    declarations: 'Sarežģītības līmenis nav šķērslis'
  },
  ru: {
    years: 'Более 15 лет успешного опыта',
    shipments: '10 000+ оформленных грузов',
    declarations: 'Сложность работы не имеет значения'
  }
};

  // Заголовок «Контакты»
  const CONTACTS = {
    en: 'Contacts',
    ru: 'Контакты',
    lv: 'Kontakti'
  };

  const PROC = {
  en: { consult: 'Consultation',        docs: 'Collect documents',     decl: 'File the declaration', cleared: 'Goods released' },
  lv: { consult: 'Konsultācija',        docs: 'Dokumentu sagatavošana', decl: 'Deklarācija formēšana', cleared: 'Preču izlaišana' },
  ru: { consult: 'Консультация',        docs: 'Получаем документы',    decl: 'Оформляем декларацию',  cleared: 'Товар выпущен' }
};

const STEP = {
  en: ['Step 1','Step 2','Step 3','Step 4'],
  lv: ['Solis 1','Solis 2','Solis 3','Solis 4'],
  ru: ['Шаг 1','Шаг 2','Шаг 3','Шаг 4']
};

const NEW_SECTION = {
  en: {
    title: 'THE CUSTOMS BROKERAGE IN EU',
    desc: 'For all types transport and goods'
  },
  lv: {
    title: 'MUITAS BROKERIS ES',
    desc: 'Visiem transporta veidiem un precēm'
  },
  ru: {
    title: 'ТАМОЖЕННЫЙ БРОКЕР В ЕС',
    desc: 'Для всех видов транспорта и товаров'
  }
};

const PROC_TITLE = {
  en: 'We work with:',
  lv: 'Mēs strādājam ar:',
  ru: 'Мы работаем с:'
};

  const ui = document.querySelector('.lang-ui');
  if (!ui) return;

  const langButtons = Array.from(ui.querySelectorAll('.seg'));

  // Узлы, которые переводим
  const heroTitle = document.getElementById('hero-title');
  const heroBtn   = document.getElementById('hero-cta');
  const urgentBtn = document.getElementById('urgent-cta');

  const colImport = document.getElementById('col-import');
  const colExport = document.getElementById('col-export');
  const colTransit= document.getElementById('col-transit');

  const factYears = document.getElementById('fact-years');
  const factShipm = document.getElementById('fact-shipments');
  const factDecls = document.getElementById('fact-declarations');

  const contactsTitle = document.getElementById('contacts-title');

  const footerCopy = document.getElementById('footer-copy');

  const importDesc  = document.getElementById('import-desc');
  const exportDesc  = document.getElementById('export-desc');
  const transitDesc = document.getElementById('transit-desc');

  const procConsult = document.getElementById('proc-consult');
  const procDocs   = document.getElementById('proc-docs');
  const procDecl   = document.getElementById('proc-decl');
  const procCleared= document.getElementById('proc-cleared');

  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  const newSectionTitle = document.getElementById('new-section-title');
  const newSectionDesc = document.getElementById('new-section-desc');

  const proceduresTitle = document.getElementById('procedures-title');

  // Инициализация
  const saved = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
  const initialLang = ORDER.includes(saved) ? saved : DEFAULT_LANG;
  setActive(initialLang, { immediate: true });

  // Переключение языков (клики)
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.lang));
  });

  function setActive(lang, opts = {}) {
    const idx = ORDER.indexOf(lang);
    if (idx === -1) return;

    // визуал переключателя
    langButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    ui.style.setProperty('--index', idx);

    // html lang + сохранение
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}

    // Тексты
    if (heroTitle) heroTitle.textContent = STR[lang] || STR.en;
    if (heroBtn)   heroBtn.textContent   = BTN[lang] || BTN.en;
    if (urgentBtn) urgentBtn.textContent = URGENT[lang] || URGENT.en;

    if (colImport)  colImport.textContent  = (COL[lang] || COL.en).import;
    if (colExport)  colExport.textContent  = (COL[lang] || COL.en).export;
    if (colTransit) colTransit.textContent = (COL[lang] || COL.en).transit;

    if (factYears)  factYears.textContent  = (FACT[lang] || FACT.en).years;
    if (factShipm)  factShipm.textContent  = (FACT[lang] || FACT.en).shipments;
    if (factDecls)  factDecls.textContent  = (FACT[lang] || FACT.en).declarations;

    if (contactsTitle) contactsTitle.textContent = CONTACTS[lang] || CONTACTS.en;

    if (footerCopy) footerCopy.textContent = FOOTER[lang] || FOOTER.en;

    if (importDesc)  importDesc.textContent  = (DESC[lang] || DESC.en).import;
    if (exportDesc)  exportDesc.textContent  = (DESC[lang] || DESC.en).export;
    if (transitDesc) transitDesc.textContent = (DESC[lang] || DESC.en).transit;

    if (procConsult) procConsult.textContent = (PROC[lang] || PROC.en).consult;
    if (procDocs)    procDocs.textContent    = (PROC[lang] || PROC.en).docs;
    if (procDecl)    procDecl.textContent    = (PROC[lang] || PROC.en).decl;
    if (procCleared) procCleared.textContent = (PROC[lang] || PROC.en).cleared;

    if (step1) step1.textContent = (STEP[lang] || STEP.en)[0];
    if (step2) step2.textContent = (STEP[lang] || STEP.en)[1];
    if (step3) step3.textContent = (STEP[lang] || STEP.en)[2];
    if (step4) step4.textContent = (STEP[lang] || STEP.en)[3];

    if (newSectionTitle) newSectionTitle.textContent = NEW_SECTION[lang].title;
    if (newSectionDesc) newSectionDesc.textContent = NEW_SECTION[lang].desc;

    if (proceduresTitle) proceduresTitle.textContent = PROC_TITLE[lang] || PROC_TITLE.en;
  }
})();


document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.procedures .proc-item'));
  let i = 0;
  const stepMs = 280; // скорость появления
  function showNext(){
    if (i >= items.length) return;
    items[i].classList.add('is-visible');
    i++; setTimeout(showNext, stepMs);
  }
  showNext();
});