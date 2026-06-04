import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/c50f354c-ee7e-4dbb-a99e-23b616406158.jpg";
const PILES_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/598027c3-4fda-41e9-a216-aa578332f40e.jpg";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const NAV_LINKS = [["hero", "Главная"], ["services", "Услуги"], ["about", "О нас"], ["contacts", "Контакты"]];

const services = [
  { icon: "Layers", title: "Шпунт Л4", desc: "Котлованы до 8 м, причальные стены, подпорные конструкции. Самый востребованный профиль.", price: "от 320 ₽/м·сут", tag: "Хит" },
  { icon: "Shield", title: "Шпунт Л5", desc: "Усиленный профиль для высоких нагрузок. Оптимален при давлении грунта и воде.", price: "от 380 ₽/м·сут", tag: "Нагрузка" },
  { icon: "Zap", title: "Шпунт Л3У", desc: "Лёгкий профиль для неглубоких котлованов и временных ограждений.", price: "от 260 ₽/м·сут", tag: "Эконом" },
  { icon: "Truck", title: "Доставка", desc: "Отгрузка за 24 ч. Работаем по всей России, собственный автопарк.", price: "по запросу", tag: "Логистика" },
  { icon: "Wrench", title: "Монтаж", desc: "Вибропогружатели, дизель-молоты, направляющие рамы. Бригады на объект.", price: "от 15 000 ₽/смена", tag: "Под ключ" },
  { icon: "ClipboardList", title: "Тех. надзор", desc: "Специалисты с опытом 10+ лет. Контроль монтажа, документация, приёмка.", price: "от 5 000 ₽/выезд", tag: "Экспертиза" },
];

const stats = [
  { value: "2 400+", label: "тонн в парке" },
  { value: "180+", label: "сданных объектов" },
  { value: "15", label: "лет на рынке" },
  { value: "24/7", label: "поддержка" },
];

const advantages = [
  { icon: "Clock", title: "Отгрузка за 24 часа", desc: "Склад в Москве. Запас 2400+ тонн всегда в наличии." },
  { icon: "FileText", title: "Полный документооборот", desc: "Договор, накладные, закрывающие — всё по закону." },
  { icon: "Users", title: "Персональный менеджер", desc: "Один контакт на весь срок аренды, всегда на связи." },
  { icon: "RotateCcw", title: "Обратный выкуп", desc: "Сдайте шпунт обратно — засчитаем в счёт следующего заказа." },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);

  const heroRef = useInView(0.05);
  const statsRef = useInView(0.1);
  const servicesRef = useInView(0.05);
  const aboutRef = useInView(0.1);
  const advRef = useInView(0.1);
  const contactRef = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="font-roboto bg-[#080c10] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#080c10]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between py-4">
          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-orange-500 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
              <Icon name="Layers" size={16} className="absolute inset-0 m-auto text-white z-10" />
            </div>
            <span className="font-oswald font-bold text-lg tracking-[0.15em] uppercase">
              Шпунт<span className="text-orange-500">Аренда</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-oswald text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 relative group">
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-orange-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+78000000000" className="font-oswald text-sm text-white/60 hover:text-white transition-colors">
              +7 (800) 000-00-00
            </a>
            <button onClick={() => scrollTo("contacts")}
              className="font-oswald text-xs tracking-[0.15em] uppercase bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] hover:scale-105">
              Расчёт стоимости
            </button>
          </div>

          <button className="md:hidden p-2 text-white/70" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0d1117] border-t border-white/5 px-6 py-5 flex flex-col gap-4">
            {NAV_LINKS.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-oswald uppercase tracking-widest text-sm text-white/60 hover:text-orange-400 text-left py-1">
                {label}
              </button>
            ))}
            <button onClick={() => scrollTo("contacts")}
              className="font-oswald text-sm uppercase tracking-widest bg-orange-500 text-white py-3 mt-2">
              Получить расчёт
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c10] via-[#080c10]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c10] via-transparent to-[#080c10]/40" />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '256px' }} />

        {/* Diagonal accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent hidden lg:block" style={{ right: '28%' }} />

        <div ref={heroRef.ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24 w-full">
          <div className={`max-w-3xl transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-orange-500/25 backdrop-blur-sm px-4 py-2 mb-8 rounded-none">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="font-roboto text-xs text-orange-300 tracking-[0.25em] uppercase">Аренда шпунта · Вся Россия</span>
            </div>

            <h1 className="font-oswald font-bold uppercase leading-[0.9] mb-8">
              <span className="block text-[clamp(3rem,8vw,6.5rem)] text-white">Шпунт</span>
              <span className="block text-[clamp(3rem,8vw,6.5rem)]"
                style={{ WebkitTextStroke: '2px rgba(234,88,12,0.8)', color: 'transparent' }}>
                Ларсена
              </span>
              <span className="block text-[clamp(1.5rem,4vw,3rem)] text-white/30 mt-1 font-light tracking-widest">
                в аренду · профили Л3–Л5
              </span>
            </h1>

            <p className="font-roboto font-light text-white/55 text-lg max-w-lg leading-relaxed mb-10">
              Доставка за 24 часа из Москвы. Монтаж, технадзор, документы —
              полный цикл под ключ.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("contacts")}
                className="group font-oswald text-sm tracking-[0.2em] uppercase bg-orange-500 text-white px-10 py-4 hover:bg-orange-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,88,12,0.6)] hover:scale-105 flex items-center gap-3">
                Рассчитать стоимость
                <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo("services")}
                className="font-oswald text-sm tracking-[0.2em] uppercase border border-white/15 text-white/50 hover:border-white/40 hover:text-white px-10 py-4 transition-all duration-300 backdrop-blur-sm">
                Услуги и цены
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-orange-500 animate-pulse" />
          <span className="font-roboto text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
        </div>
      </section>

      {/* ── STATS TICKER ── */}
      <section className="relative py-6 overflow-hidden" ref={statsRef.ref}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 80px)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {stats.map((s, i) => (
              <div key={i}
                className={`text-center py-3 px-6 transition-all duration-700 ${statsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="font-oswald font-bold text-4xl text-white leading-none">{s.value}</div>
                <div className="font-roboto text-xs text-white/70 uppercase tracking-[0.2em] mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#080c10]">
        <div ref={servicesRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 transition-all duration-700 ${servicesRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div>
              <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">Что предлагаем</p>
              <h2 className="font-oswald font-bold uppercase leading-none">
                <span className="block text-white text-5xl md:text-6xl">Услуги</span>
                <span className="block text-white/10 text-5xl md:text-6xl">и цены</span>
              </h2>
            </div>
            <p className="font-roboto text-white/40 text-sm max-w-xs leading-relaxed">
              Полный спектр — от аренды металла до монтажа «под ключ»
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {services.map((s, i) => (
              <div key={i}
                onMouseEnter={() => setActiveService(i)}
                onMouseLeave={() => setActiveService(null)}
                className={`relative bg-[#080c10] p-8 cursor-default transition-all duration-500 group
                  ${servicesRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                  ${activeService === i ? "bg-[#0f1419]" : ""}`}
                style={{ transitionDelay: servicesRef.inView ? `${i * 60}ms` : "0ms" }}>

                {/* Top accent */}
                <div className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transition-all duration-500 ${activeService === i ? "w-full" : "w-0"}`} />

                {/* Number */}
                <div className="absolute top-6 right-6 font-oswald text-5xl font-bold text-white/[0.04] select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10">
                  <div className={`w-11 h-11 flex items-center justify-center mb-6 transition-all duration-300 ${activeService === i ? "bg-orange-500" : "bg-white/5"}`}>
                    <Icon name={s.icon} size={20} className={activeService === i ? "text-white" : "text-orange-500"} />
                  </div>

                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className={`font-oswald font-semibold text-xl uppercase transition-colors duration-300 ${activeService === i ? "text-orange-400" : "text-white"}`}>
                      {s.title}
                    </h3>
                    <span className="font-roboto text-[10px] text-orange-500/60 border border-orange-500/20 px-2 py-0.5 uppercase tracking-widest shrink-0">
                      {s.tag}
                    </span>
                  </div>

                  <p className="font-roboto font-light text-sm text-white/40 leading-relaxed mb-6">{s.desc}</p>

                  <div className="font-oswald text-xl text-white font-bold">{s.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0a0e14 100%)' }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        <div ref={aboutRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left */}
            <div className={`transition-all duration-800 ${aboutRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"}`}>
              <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">О компании</p>
              <h2 className="font-oswald font-bold text-5xl md:text-6xl uppercase leading-none mb-8">
                <span className="text-white block">15 лет</span>
                <span className="text-white/15 block">надёжности</span>
              </h2>

              <p className="font-roboto font-light text-white/50 leading-relaxed mb-5">
                Обеспечиваем строительные компании России шпунтом Ларсена с 2009 года. Склад в Москве — более 2 400 тонн металла в постоянном наличии.
              </p>
              <p className="font-roboto font-light text-white/50 leading-relaxed mb-10">
                Работаем с застройщиками, генподрядчиками, дорожниками и гидростроителями. Гибкие условия аренды, скидки при долгосрочных договорах.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Склад МКАДе, отгрузка за 24 ч",
                  "Доставка по России и СНГ",
                  "Договор и закрывающие документы",
                  "Персональный менеджер",
                  "Скидки за объём и срок",
                  "Обратный выкуп металла",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500/15 flex items-center justify-center shrink-0">
                      <Icon name="Check" size={10} className="text-orange-400" />
                    </div>
                    <span className="font-roboto text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className={`transition-all duration-800 delay-200 ${aboutRef.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-14"}`}>
              <div className="relative">
                {/* Shadow frame */}
                <div className="absolute -inset-3 bg-orange-500/10 blur-2xl rounded-none" />
                <img src={PILES_IMAGE} alt="Шпунт Ларсена" className="relative w-full h-96 object-cover" />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500" />
                {/* Badge */}
                <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-orange-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.5)]">
                  <span className="font-oswald font-bold text-3xl text-white leading-none">15</span>
                  <span className="font-roboto text-[10px] text-white/80 uppercase tracking-[0.2em]">лет</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="py-20 bg-[#080c10]">
        <div ref={advRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {advantages.map((a, i) => (
              <div key={i}
                className={`bg-[#080c10] p-8 hover:bg-[#0d1117] transition-all duration-400 group ${advRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 bg-orange-500/10 group-hover:bg-orange-500/20 flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon name={a.icon} size={18} className="text-orange-500" />
                </div>
                <h4 className="font-oswald text-base uppercase tracking-wide text-white mb-2">{a.title}</h4>
                <p className="font-roboto text-xs text-white/40 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="py-28" style={{ background: 'linear-gradient(135deg, #0a0e14 0%, #080c10 100%)' }}>
        <div ref={contactRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className={`mb-16 transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">Свяжитесь с нами</p>
            <h2 className="font-oswald font-bold uppercase leading-none">
              <span className="block text-white text-5xl md:text-6xl">Получите</span>
              <span className="block text-white/10 text-5xl md:text-6xl">расчёт</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact info */}
            <div className={`transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <p className="font-roboto font-light text-white/45 leading-relaxed mb-12 max-w-md">
                Оставьте заявку — менеджер перезвонит в течение 15 минут и рассчитает стоимость аренды под ваш проект.
              </p>

              <div className="space-y-6">
                {[
                  { icon: "Phone", title: "+7 (800) 000-00-00", sub: "Бесплатно по России, 8:00–20:00" },
                  { icon: "Mail", title: "info@shpunt-arenda.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", title: "Москва, МКАД, км 84", sub: "Склад · Пн–Сб 8:00–19:00" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4 group cursor-default">
                    <div className="w-11 h-11 bg-orange-500/8 border border-orange-500/15 group-hover:bg-orange-500/15 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Icon name={c.icon} size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="font-oswald text-lg text-white">{c.title}</div>
                      <div className="font-roboto text-sm text-white/35 mt-0.5">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social row */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-6">
                <span className="font-roboto text-xs text-white/25 uppercase tracking-widest">Соцсети</span>
                {[
                  { icon: "MessageCircle", label: "Telegram" },
                  { icon: "Phone", label: "WhatsApp" },
                ].map((soc) => (
                  <button key={soc.label}
                    className="flex items-center gap-2 font-roboto text-xs text-white/35 hover:text-orange-400 transition-colors uppercase tracking-widest">
                    <Icon name={soc.icon} size={14} />
                    {soc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className={`transition-all duration-700 delay-200 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {sent ? (
                <div className="h-full min-h-[400px] bg-[#0d1117] border border-orange-500/15 flex flex-col items-center justify-center gap-6 p-12 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 bg-orange-500 flex items-center justify-center">
                      <Icon name="Check" size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-oswald text-2xl uppercase text-white mb-2">Заявка принята!</h3>
                    <p className="font-roboto text-white/40 text-sm">Перезвоним в течение 15 минут в рабочее время</p>
                  </div>
                  <button onClick={() => setSent(false)}
                    className="font-oswald text-xs uppercase tracking-[0.2em] text-orange-400 border border-orange-500/25 px-8 py-3 hover:bg-orange-500/10 transition-colors">
                    Новая заявка
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="bg-[#0d1117] border border-white/5 p-8 space-y-6">

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-oswald text-xl uppercase text-white">Заявка на аренду</h3>
                    <span className="font-roboto text-xs text-white/20">* обязательные поля</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: "name", label: "Имя *", placeholder: "Иван Петров", type: "text" },
                      { id: "phone", label: "Телефон *", placeholder: "+7 (___) ___-__-__", type: "tel" },
                    ].map((f) => (
                      <div key={f.id} className="group">
                        <label className="font-roboto text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2">{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          required
                          value={formData[f.id as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                          className="w-full bg-[#080c10] border-b border-white/10 focus:border-orange-500 text-white placeholder:text-white/15 px-0 py-3 font-roboto text-sm outline-none transition-colors duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-roboto text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2">Комментарий</label>
                    <textarea
                      placeholder="Профиль Л4/Л5, объём (тн/м), сроки аренды, регион доставки..."
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 text-white placeholder:text-white/15 px-0 py-3 font-roboto text-sm outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button type="submit"
                    className="group w-full font-oswald text-sm tracking-[0.2em] uppercase bg-orange-500 hover:bg-orange-400 text-white py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] flex items-center justify-center gap-3">
                    Отправить заявку
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="font-roboto text-[10px] text-white/20 text-center leading-relaxed">
                    Отправляя заявку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#05080b] border-t border-white/[0.04] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 mb-3">
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 bg-orange-500 rotate-45" />
                  <Icon name="Layers" size={13} className="absolute inset-0 m-auto text-white z-10" />
                </div>
                <span className="font-oswald font-bold text-base tracking-[0.15em] uppercase text-white/60">
                  Шпунт<span className="text-orange-500">Аренда</span>
                </span>
              </button>
              <p className="font-roboto text-xs text-white/20">© 2024 ШпунтАренда. Все права защищены.</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {NAV_LINKS.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="font-roboto text-xs text-white/25 hover:text-orange-400 uppercase tracking-[0.15em] transition-colors">
                  {label}
                </button>
              ))}
            </div>

            <div className="text-right hidden md:block">
              <a href="tel:+78000000000" className="font-oswald text-xl text-white hover:text-orange-400 transition-colors">
                +7 (800) 000-00-00
              </a>
              <p className="font-roboto text-xs text-white/25 mt-1">Бесплатно по России</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
