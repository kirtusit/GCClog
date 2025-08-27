(function () {
  const STORAGE_KEY = 'site.lang';
  const DEFAULT_LANG = 'en';
  const ORDER = ['en', 'lv', 'ru'];

  // Заголовок вверху
  const STR = {
    en: 'Customs clearance procedures',
    ru: 'Оформление таможенных процедур',
    lv: 'Muitas procedūru noformēšana'
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
  }
})();
