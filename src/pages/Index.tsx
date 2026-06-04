import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/06278f01-6d0a-4f22-a9c4-214735c60b3d.jpg";
const PILES_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/598027c3-4fda-41e9-a216-aa578332f40e.jpg";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const services = [
  {
    icon: "Layers",
    title: "Шпунт Ларсена Л4",
    desc: "Самый популярный профиль. Подходит для котлованов глубиной до 8 метров, причальных сооружений и подпорных стен.",
    price: "от 320 ₽/м·сут",
    tag: "Хит аренды",
  },
  {
    icon: "Shield",
    title: "Шпунт Ларсена Л5",
    desc: "Усиленный профиль для нагруженных конструкций. Оптимален при высоком давлении грунта и воды.",
    price: "от 380 ₽/м·сут",
    tag: "Повышенная нагрузка",
  },
  {
    icon: "Truck",
    title: "Доставка и монтаж",
    desc: "Погрузка, транспортировка, выгрузка на объекте. Работаем с вибропогружателями и дизель-молотами.",
    price: "по запросу",
    tag: "Под ключ",
  },
  {
    icon: "Wrench",
    title: "Аренда оборудования",
    desc: "Вибропогружатели, направляющие рамы, захваты — всё необходимое для монтажа шпунта.",
    price: "от 15 000 ₽/смена",
    tag: "Комплект",
  },
  {
    icon: "ClipboardList",
    title: "Технический надзор",
    desc: "Специалисты с опытом более 10 лет. Контроль монтажа, техническая документация, приёмка работ.",
    price: "от 5 000 ₽/выезд",
    tag: "Экспертиза",
  },
  {
    icon: "RefreshCw",
    title: "Обратный выкуп",
    desc: "Принимаем шпунт обратно после аренды в зачёт будущих заказов. Экономия до 30% на следующем проекте.",
    price: "—",
    tag: "Выгода",
  },
];

const stats = [
  { value: "2 400+", label: "тонн в аренде" },
  { value: "180+", label: "объектов сдано" },
  { value: "15 лет", label: "на рынке" },
  { value: "24/7", label: "поддержка клиентов" },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);

  const heroSection = useInView(0.1);
  const statsSection = useInView(0.1);
  const servicesSection = useInView(0.1);
  const aboutSection = useInView(0.1);
  const contactSection = useInView(0.1);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="font-roboto bg-[#0d0d0d] text-white min-h-screen overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
              <Icon name="Layers" size={16} className="text-white" />
            </div>
            <span className="font-oswald font-bold text-xl tracking-widest uppercase text-white">
              Шпунт<span className="text-orange-500">Аренда</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[["hero", "Главная"], ["services", "Услуги"], ["contacts", "Контакты"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="font-oswald text-sm tracking-widest uppercase text-white/60 hover:text-orange-400 transition-colors duration-300"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contacts")}
              className="font-oswald text-sm tracking-widest uppercase bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 transition-all duration-300 hover:scale-105"
            >
              Получить расчёт
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {[["hero", "Главная"], ["services", "Услуги"], ["contacts", "Контакты"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="font-oswald uppercase tracking-widest text-white/70 hover:text-orange-400 text-left">
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-[#0d0d0d]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(234,88,12,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div ref={heroSection.ref} className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className={`transition-all duration-1000 ${heroSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="font-roboto text-orange-400 text-sm tracking-widest uppercase">Аренда по всей России</span>
            </div>

            <h1 className="font-oswald font-bold text-5xl md:text-7xl lg:text-8xl leading-none uppercase mb-6">
              <span className="block text-white">Шпунт</span>
              <span className="block text-orange-500">Ларсена</span>
              <span className="block text-white/40 text-3xl md:text-4xl lg:text-5xl mt-2">в аренду</span>
            </h1>

            <p className="font-roboto font-light text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
              Профили Л4, Л5 и другие. Доставка, монтаж, технический надзор —
              всё в одном месте. Работаем быстро, без бюрократии.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("contacts")}
                className="font-oswald text-base tracking-widest uppercase bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                Получить расчёт
              </button>
              <button
                onClick={() => scrollTo("services")}
                className="font-oswald text-base tracking-widest uppercase border border-white/30 hover:border-orange-500 text-white/70 hover:text-orange-400 px-10 py-4 transition-all duration-300"
              >
                Услуги и цены
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="font-roboto text-xs text-white/30 tracking-widest uppercase">Листай</span>
          <Icon name="ChevronDown" size={20} className="text-orange-500" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-orange-500 py-8">
        <div ref={statsSection.ref} className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-700 ${statsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-oswald font-bold text-3xl md:text-4xl text-white">{s.value}</div>
                <div className="font-roboto text-sm text-white/80 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-[#0d0d0d]">
        <div ref={servicesSection.ref} className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 transition-all duration-700 ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="inline-block bg-orange-500/10 border border-orange-500/30 px-4 py-1 mb-4">
              <span className="font-oswald text-orange-400 text-sm uppercase tracking-widest">Что мы предлагаем</span>
            </div>
            <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase text-white leading-none">
              Услуги<br /><span className="text-white/20">и цены</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-white/5">
            {services.map((s, i) => (
              <div
                key={i}
                className={`group bg-[#0d0d0d] p-8 hover:bg-[#161616] transition-all duration-500 cursor-default relative overflow-hidden ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300 flex items-center justify-center">
                    <Icon name={s.icon} size={22} className="text-orange-500" />
                  </div>
                  <span className="font-roboto text-xs text-orange-400/70 border border-orange-500/20 px-2 py-0.5 uppercase tracking-wider">
                    {s.tag}
                  </span>
                </div>

                <h3 className="font-oswald font-semibold text-xl uppercase text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="font-roboto font-light text-sm text-white/50 leading-relaxed mb-6">{s.desc}</p>

                <div className="font-oswald text-lg text-orange-500">{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-[#111]">
        <div ref={aboutSection.ref} className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 ${aboutSection.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <div className="inline-block bg-orange-500/10 border border-orange-500/30 px-4 py-1 mb-4">
                <span className="font-oswald text-orange-400 text-sm uppercase tracking-widest">О компании</span>
              </div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase text-white leading-none mb-6">
                Работаем<br /><span className="text-orange-500">без простоев</span>
              </h2>
              <p className="font-roboto font-light text-white/60 leading-relaxed mb-6">
                Более 15 лет мы обеспечиваем строительные компании России качественным шпунтом Ларсена.
                В нашем парке — более 2 400 тонн металла, готового к отгрузке в течение 24 часов.
              </p>
              <p className="font-roboto font-light text-white/60 leading-relaxed mb-8">
                Работаем с застройщиками, подрядчиками, дорожниками и гидростроителями.
                Гибкие условия аренды, возможность выкупа, скидки при долгосрочных договорах.
              </p>

              <div className="space-y-3">
                {[
                  "Склад в Москве — отгрузка за 24 часа",
                  "Доставка по всей России и СНГ",
                  "Договор и закрывающие документы",
                  "Персональный менеджер на весь срок аренды",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                    <span className="font-roboto text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${aboutSection.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <div className="relative">
                <img
                  src={PILES_IMAGE}
                  alt="Шпунт Ларсена"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 border-2 border-orange-500/30" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500 flex flex-col items-center justify-center">
                  <span className="font-oswald font-bold text-2xl text-white leading-none">15</span>
                  <span className="font-roboto text-xs text-white/80 uppercase tracking-wider">лет</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-[#0d0d0d]">
        <div ref={contactSection.ref} className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div className={`transition-all duration-700 ${contactSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="inline-block bg-orange-500/10 border border-orange-500/30 px-4 py-1 mb-4">
                <span className="font-oswald text-orange-400 text-sm uppercase tracking-widest">Свяжитесь с нами</span>
              </div>
              <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase text-white leading-none mb-6">
                Получите<br /><span className="text-orange-500">расчёт</span><br />
                <span className="text-white/20">за 15 минут</span>
              </h2>
              <p className="font-roboto font-light text-white/50 mb-10 leading-relaxed">
                Оставьте заявку — менеджер перезвонит и рассчитает стоимость аренды под ваш проект.
              </p>

              <div className="space-y-5">
                {[
                  { icon: "Phone", text: "+7 (800) 000-00-00", sub: "Бесплатно по России" },
                  { icon: "Mail", text: "info@shpunt-arenda.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", text: "Москва, склад на МКАДе", sub: "Приём заявок 8:00–20:00" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="font-oswald text-white text-lg">{c.text}</div>
                      <div className="font-roboto text-white/40 text-sm">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${contactSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 bg-[#111] p-12 border border-orange-500/20">
                  <div className="w-16 h-16 bg-orange-500 flex items-center justify-center">
                    <Icon name="Check" size={32} className="text-white" />
                  </div>
                  <h3 className="font-oswald text-2xl uppercase text-white">Заявка отправлена!</h3>
                  <p className="font-roboto text-white/50">Менеджер свяжется с вами в течение 15 минут в рабочее время.</p>
                  <button onClick={() => setSent(false)} className="font-oswald text-sm uppercase tracking-widest text-orange-400 border border-orange-500/30 px-6 py-2 hover:bg-orange-500/10 transition-colors">
                    Новая заявка
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#111] p-8 border border-white/5 space-y-5">
                  <h3 className="font-oswald text-xl uppercase text-white mb-2">Заявка на аренду</h3>

                  {[
                    { id: "name", label: "Ваше имя", placeholder: "Иван Петров", type: "text" },
                    { id: "phone", label: "Телефон", placeholder: "+7 (___) ___-__-__", type: "tel" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="font-roboto text-xs text-white/40 uppercase tracking-widest block mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        required
                        value={formData[f.id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                        className="w-full bg-[#0d0d0d] border border-white/10 focus:border-orange-500 text-white placeholder:text-white/20 px-4 py-3 font-roboto text-sm outline-none transition-colors duration-300"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="font-roboto text-xs text-white/40 uppercase tracking-widest block mb-2">Комментарий</label>
                    <textarea
                      placeholder="Тип шпунта, объём, сроки аренды..."
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full bg-[#0d0d0d] border border-white/10 focus:border-orange-500 text-white placeholder:text-white/20 px-4 py-3 font-roboto text-sm outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-oswald text-base uppercase tracking-widest bg-orange-500 hover:bg-orange-400 text-white py-4 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Отправить заявку
                  </button>

                  <p className="font-roboto text-xs text-white/25 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080808] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 flex items-center justify-center">
              <Icon name="Layers" size={12} className="text-white" />
            </div>
            <span className="font-oswald text-base tracking-widest uppercase text-white/60">
              Шпунт<span className="text-orange-500">Аренда</span>
            </span>
          </div>
          <p className="font-roboto text-xs text-white/20">© 2024 ШпунтАренда. Все права защищены.</p>
          <div className="flex gap-6">
            {[["hero", "Главная"], ["services", "Услуги"], ["contacts", "Контакты"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="font-roboto text-xs text-white/30 hover:text-orange-400 uppercase tracking-widest transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}