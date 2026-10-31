import { useMemo, useState } from 'react';
import { ShieldCheck, Search, Smartphone, ShieldAlert, Languages, Menu, LockKeyhole, ScanLine, CircleHelp, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

type Lang = 'tg' | 'ru' | 'en';
const copy = {
  tg: {
    subtitle: 'СИСТЕМАИ АМНИЯТИ IMEI', nav: 'Маркази санҷиш', badge: 'РЕҶАИ НАМОИШӢ',
    title: 'Телефонро пеш аз харид санҷед', desc: 'Рақами IMEI-ро ворид кунед, то формати он санҷида шавад ва дар базаи пайвастшуда ҷустуҷӯ гардад.',
    label: 'РАҚАМИ IMEI', placeholder: '15 рақами IMEI-ро ворид кунед', check: 'Санҷидани IMEI',
    note: 'Натиҷа танҳо аз базаи ба система пайвастшуда вобаста аст. Натиҷаи сабз кафолати моликияти қонунӣ нест.',
    stat1: 'Санҷишҳо', stat2: 'Базаи дастгоҳҳо', stat3: 'Забонҳо',
    panel: 'Маркази амният', panelDesc: 'Санҷиши дастгоҳ ва маълумоти IMEI', feature1: 'Санҷиши формати IMEI', feature2: 'Санҷиш аз рӯйи базаи гузоришҳо', feature3: 'Интерфейси се забона',
    invalid: 'IMEI нодуруст аст. Рақам бояд 15 адад бошад ва санҷиши Luhn-ро гузарад.',
    demo: 'Реҷаи намоишӣ: ба базаи расмии полис ё оператор пайваст нест.',
    clean: 'Дар базаи намоишӣ гузориши мувофиқи дуздӣ ёфт нашуд.',
    stolen: 'Дастгоҳ ҳамчун дуздидашуда сабт шудааст.',
    resultTitle: 'Натиҷаи санҷиш', local: 'Базаи маҳаллии намоишӣ',
    footer: 'ANIS MON · Тоҷикистон', public: 'Санҷиши оммавии IMEI'
  },
  ru: {
    subtitle: 'СИСТЕМА БЕЗОПАСНОСТИ IMEI', nav: 'Центр проверки', badge: 'ДЕМО-РЕЖИМ',
    title: 'Проверьте телефон перед покупкой', desc: 'Введите IMEI, чтобы проверить его формат и выполнить поиск в подключённой базе данных.',
    label: 'НОМЕР IMEI', placeholder: 'Введите 15 цифр IMEI', check: 'Проверить IMEI',
    note: 'Результат зависит только от подключённой базы. Зелёный статус не гарантирует законность владения.',
    stat1: 'Проверки', stat2: 'База устройств', stat3: 'Языка',
    panel: 'Центр безопасности', panelDesc: 'Проверка устройства и данных IMEI', feature1: 'Проверка формата IMEI', feature2: 'Поиск по базе сообщений', feature3: 'Интерфейс на трёх языках',
    invalid: 'Неверный IMEI. Номер должен содержать 15 цифр и пройти проверку Luhn.',
    demo: 'Демо-режим: нет подключения к официальной базе полиции или операторов.',
    clean: 'В демонстрационной базе совпадающих сообщений о краже не найдено.',
    stolen: 'Устройство зарегистрировано как украденное.',
    resultTitle: 'Результат проверки', local: 'Локальная демонстрационная база',
    footer: 'ANIS MON · Таджикистан', public: 'Публичная проверка IMEI'
  },
  en: {
    subtitle: 'IMEI SECURITY SYSTEM', nav: 'Verification Center', badge: 'DEMO MODE',
    title: 'Check a phone before you buy', desc: 'Enter an IMEI to validate its format and search the connected database.',
    label: 'IMEI NUMBER', placeholder: 'Enter the 15-digit IMEI', check: 'Check IMEI',
    note: 'Results depend only on the connected database. A green result does not guarantee lawful ownership.',
    stat1: 'Checks', stat2: 'Device database', stat3: 'Languages',
    panel: 'Security Center', panelDesc: 'Device verification and IMEI information', feature1: 'IMEI format validation', feature2: 'Search reported-device database', feature3: 'Three-language interface',
    invalid: 'Invalid IMEI. It must contain 15 digits and pass the Luhn check.',
    demo: 'Demo mode: not connected to an official police or carrier database.',
    clean: 'No matching theft report was found in the demo database.',
    stolen: 'This device is registered as stolen.',
    resultTitle: 'Verification result', local: 'Local demonstration database',
    footer: 'ANIS MON · Tajikistan', public: 'Public IMEI verification'
  }
};

function validImei(value: string) {
  if (!/^\d{15}$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < value.length; i++) {
    let n = Number(value[i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('tg');
  const [imei, setImei] = useState('');
  const [result, setResult] = useState<'invalid' | 'clean' | null>(null);
  const t = copy[lang];
  const cleanImei = useMemo(() => imei.replace(/\D/g, '').slice(0, 15), [imei]);

  function check() {
    if (!validImei(cleanImei)) setResult('invalid');
    else setResult('clean');
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><ShieldCheck size={25}/></span><span><b>ANIS MON</b><small>{t.subtitle}</small></span></a>
      <div className="top-actions"><span className="demo-pill"><i/> {t.badge}</span><div className="language"><Languages size={16}/><select aria-label="Language" value={lang} onChange={e => setLang(e.target.value as Lang)}><option value="tg">Тоҷикӣ</option><option value="ru">Русский</option><option value="en">English</option></select></div></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="flag">🇹🇯</span> {t.nav} <span className="line"/></div>
          <h1>{t.title}</h1>
          <p>{t.desc}</p>
          <div className="check-card">
            <label>{t.label}</label>
            <div className="input-row"><ScanLine size={20}/><input value={imei} onChange={e => {setImei(e.target.value.replace(/\D/g, '').slice(0,15)); setResult(null);}} inputMode="numeric" placeholder={t.placeholder}/><span className="counter">{cleanImei.length}/15</span></div>
            <button onClick={check}><Search size={18}/>{t.check}<ArrowUpRight size={17}/></button>
            {result && <div className={`result ${result}`}><div className="result-heading">{result === 'invalid' ? <AlertTriangle size={19}/> : <CheckCircle2 size={19}/>}<b>{t.resultTitle}</b></div><p>{result === 'invalid' ? t.invalid : t.clean}</p><small>{t.local}</small></div>}
            <div className="disclaimer"><CircleHelp size={16}/><span>{t.note}</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="phone-glow"><div className="phone"><div className="phone-camera"/><div className="phone-screen"><div className="screen-shield"><ShieldCheck size={54}/></div><span>ANIS MON</span><small>DEVICE SECURITY</small><div className="screen-line"/></div></div></div>
          <div className="floating-tag tag-top"><ShieldCheck size={17}/><span>IMEI<br/><b>SECURE CHECK</b></span></div>
          <div className="floating-tag tag-bottom"><LockKeyhole size={17}/><span>SECURITY<br/><b>VERIFICATION</b></span></div>
        </div>
      </section>

      <section className="stats">
        <div><span className="stat-icon"><Search/></span><strong>—</strong><small>{t.stat1}</small></div>
        <div><span className="stat-icon"><Smartphone/></span><strong>LOCAL</strong><small>{t.stat2}</small></div>
        <div><span className="stat-icon"><Languages/></span><strong>03</strong><small>{t.stat3}</small></div>
      </section>

      <section className="bottom-grid">
        <div className="info-panel"><div className="section-kicker">ANIS MON / SECURITY</div><h2>{t.panel}</h2><p>{t.panelDesc}</p><div className="feature"><CheckCircle2/>{t.feature1}</div><div className="feature"><CheckCircle2/>{t.feature2}</div><div className="feature"><CheckCircle2/>{t.feature3}</div></div>
        <div className="notice-panel"><div className="notice-icon"><ShieldAlert size={25}/></div><div><b>{t.badge}</b><p>{t.demo}</p></div></div>
      </section>
    </main>
    <footer><span>© {new Date().getFullYear()} {t.footer}</span><span>{t.public}</span></footer>
  </div>;
}