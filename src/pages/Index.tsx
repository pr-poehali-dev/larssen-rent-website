import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/c50f354c-ee7e-4dbb-a99e-23b616406158.jpg";
const PILES_IMAGE = "https://cdn.poehali.dev/projects/831d3f87-ceec-4cd1-9ec5-bca946948605/files/598027c3-4fda-41e9-a216-aa578332f40e.jpg";

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Animated counter ── */
function useCounter(target: number, inView: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = 16;
    const steps = duration / step;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return val;
}

/* ── Magnetic button ── */
function MagneticBtn({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0) scale(1)"; };
  return (
    <button ref={ref} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)" }}
      className={className}>
      {children}
    </button>
  );
}

/* ── Canvas Particles ── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number; dec: number }[] = [];
    const spawn = () => {
      particles.push({
        x: Math.random() * W, y: H + 5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.6 + 0.2,
        dec: Math.random() * 0.003 + 0.001,
      });
    };
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (Math.random() < 0.3) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.o -= p.dec;
        if (p.o <= 0 || p.y < -10) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234,88,12,${p.o})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

/* ── Custom Cursor ── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    let frame: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) { dotRef.current.style.left = pos.current.x + "px"; dotRef.current.style.top = pos.current.y + "px"; }
      if (ringRef.current) { ringRef.current.style.left = ring.current.x + "px"; ringRef.current.style.top = ring.current.y + "px"; }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(frame); };
  }, []);
  return (
    <>
      <div ref={dotRef} className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen" style={{ position: "fixed" }} />
      <div ref={ringRef} className="fixed w-8 h-8 border border-orange-500/50 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2" style={{ position: "fixed" }} />
    </>
  );
}

/* ── Glitch Text ── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const trigger = () => { setGlitch(true); setTimeout(() => setGlitch(false), 300); };
    const id = setInterval(trigger, 3500 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`relative inline-block ${className}`} style={{ fontFamily: "inherit" }}>
      <span className={glitch ? "opacity-0" : "opacity-100"}>{text}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-orange-400" style={{ clipPath: "inset(20% 0 60% 0)", transform: "translateX(-4px)", filter: "blur(0.5px)" }}>{text}</span>
          <span className="absolute inset-0 text-cyan-400" style={{ clipPath: "inset(50% 0 20% 0)", transform: "translateX(4px)", filter: "blur(0.5px)" }}>{text}</span>
        </>
      )}
    </span>
  );
}

/* ── Horizontal Ticker ── */
function Ticker() {
  const items = ["Шпунт Ларсена Л4", "Шпунт Ларсена Л5", "Доставка 24ч", "Монтаж под ключ", "Тех. надзор", "Аренда по всей России"];
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3 bg-[#0a0e14] border-y border-orange-500/10">
      <div className="flex gap-12 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="font-oswald text-xs tracking-[0.3em] uppercase text-white/20 flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Spotlight card ── */
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, opacity: 1 });
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={() => setPos(p => ({ ...p, opacity: 0 }))}
      className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 rounded-[inherit]"
        style={{ opacity: pos.opacity, background: `radial-gradient(250px circle at ${pos.x}px ${pos.y}px, rgba(234,88,12,0.08), transparent 70%)` }} />
      {children}
    </div>
  );
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

const statsData = [
  { raw: 2400, suffix: "+", label: "тонн в парке" },
  { raw: 180, suffix: "+", label: "сданных объектов" },
  { raw: 15, suffix: "", label: "лет на рынке" },
];

const advantages = [
  { icon: "Clock", title: "Отгрузка за 24 часа", desc: "Склад в Москве. Запас 2400+ тонн всегда в наличии." },
  { icon: "FileText", title: "Полный документооборот", desc: "Договор, накладные, закрывающие — всё по закону." },
  { icon: "Users", title: "Персональный менеджер", desc: "Один контакт на весь срок аренды, всегда на связи." },
  { icon: "RotateCcw", title: "Обратный выкуп", desc: "Сдайте шпунт обратно — засчитаем в счёт следующего заказа." },
];

/* ── Main ── */
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const heroRef = useInView(0.05);
  const statsRef = useInView(0.1);
  const servicesRef = useInView(0.05);
  const aboutRef = useInView(0.1);
  const advRef = useInView(0.1);
  const contactRef = useInView(0.1);

  const c0 = useCounter(statsData[0].raw, statsRef.inView);
  const c1 = useCounter(statsData[1].raw, statsRef.inView);
  const c2 = useCounter(statsData[2].raw, statsRef.inView);
  const counters = [c0, c1, c2];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onScroll = () => { setScrolled(window.scrollY > 30); setParallaxY(window.scrollY * 0.35); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <div className="font-roboto bg-[#080c10] text-white overflow-x-hidden cursor-none">
      {!isMobile && <CustomCursor />}

      {/* ── NAV ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#080c10]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between py-4">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 group cursor-none">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-orange-500 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
              <Icon name="Layers" size={16} className="absolute inset-0 m-auto text-white z-10" />
            </div>
            <span className="font-oswald font-bold text-lg tracking-[0.15em] uppercase">
              Шпунт<span className="text-orange-500">Аренда</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-oswald text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 relative group cursor-none">
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-orange-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+78000000000" className="font-oswald text-sm text-white/60 hover:text-white transition-colors cursor-none">
              +7 (800) 000-00-00
            </a>
            <a href="mailto:zakaz@rentshpunt.ru" className="font-oswald text-sm text-white/60 hover:text-white transition-colors cursor-none">
              zakaz@rentshpunt.ru
            </a>
            <MagneticBtn onClick={() => scrollTo("contacts")}
              className="font-oswald text-xs tracking-[0.15em] uppercase bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] cursor-none">
              Расчёт стоимости
            </MagneticBtn>
          </div>

          <button className="md:hidden p-2 text-white/70 cursor-none" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0d1117] border-t border-white/5 px-6 py-5 flex flex-col gap-4">
            {NAV_LINKS.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-oswald uppercase tracking-widest text-sm text-white/60 hover:text-orange-400 text-left py-1 cursor-none">
                {label}
              </button>
            ))}
            <button onClick={() => scrollTo("contacts")}
              className="font-oswald text-sm uppercase tracking-widest bg-orange-500 text-white py-3 mt-2 cursor-none">
              Получить расчёт
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax BG */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover object-center scale-110"
            style={{ transform: `scale(1.1) translateY(${parallaxY * 0.5}px)`, willChange: "transform" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c10] via-[#080c10]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c10] via-transparent to-[#080c10]/50" />
        </div>

        {/* Particles */}
        <Particles />

        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-scan" />
        </div>

        {/* Radial glow */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)', transform: 'translateY(30%)' }} />

        <div ref={heroRef.ref} className="relative z-20 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-24 w-full">
          <div className={`max-w-3xl transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>

            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-orange-500/25 backdrop-blur-sm px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="font-roboto text-xs text-orange-300 tracking-[0.25em] uppercase">Аренда шпунта · Вся Россия</span>
            </div>

            <h1 className="font-oswald font-bold uppercase leading-[0.9] mb-8">
              <span className="block text-[clamp(3rem,8vw,6.5rem)] text-white">
                <GlitchText text="Шпунт" />
              </span>
              <span className="block text-[clamp(3rem,8vw,6.5rem)]"
                style={{ WebkitTextStroke: '2px rgba(234,88,12,0.9)', color: 'transparent' }}>
                Ларсена
              </span>
              <span className="block text-[clamp(1.5rem,4vw,3rem)] text-white/25 mt-1 font-light tracking-widest">
                в аренду · профили Л3–Л5
              </span>
            </h1>

            <p className="font-roboto font-light text-white/55 text-lg max-w-lg leading-relaxed mb-10">
              Доставка за 24 часа из Москвы. Монтаж, технадзор, документы — полный цикл под ключ.
            </p>

            <div className="flex flex-wrap gap-4">
              <MagneticBtn onClick={() => scrollTo("contacts")}
                className="group font-oswald text-sm tracking-[0.2em] uppercase bg-orange-500 text-white px-10 py-4 hover:bg-orange-400 hover:shadow-[0_0_50px_rgba(234,88,12,0.7)] flex items-center gap-3 cursor-none">
                Рассчитать стоимость
                <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
              </MagneticBtn>
              <MagneticBtn onClick={() => scrollTo("services")}
                className="font-oswald text-sm tracking-[0.2em] uppercase border border-white/15 text-white/50 hover:border-orange-500/60 hover:text-white px-10 py-4 backdrop-blur-sm cursor-none">
                Услуги и цены
              </MagneticBtn>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-20">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-orange-500 animate-pulse" />
          <span className="font-roboto text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── STATS ── */}
      <section className="relative py-10 overflow-hidden" ref={statsRef.ref}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-700 via-orange-500 to-orange-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(0,0,0,0.4) 0,rgba(0,0,0,0.4) 1px,transparent 1px,transparent 80px)' }} />
        {/* animated shine */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-1">
            {statsData.map((s, i) => (
              <div key={i}
                className={`text-center py-4 px-6 transition-all duration-700 ${statsRef.inView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="font-oswald font-bold text-4xl md:text-5xl text-white leading-none tabular-nums">
                  {counters[i].toLocaleString("ru")}{s.suffix}
                </div>
                <div className="font-roboto text-xs text-white/70 uppercase tracking-[0.2em] mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 bg-[#080c10]">
        <div ref={servicesRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 transition-all duration-700 ${servicesRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div>
              <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">Что предлагаем</p>
              <h2 className="font-oswald font-bold uppercase leading-none">
                <span className="block text-white text-5xl md:text-6xl">Услуги</span>
                <span className="block text-white/8 text-5xl md:text-6xl">и цены</span>
              </h2>
            </div>
            <p className="font-roboto text-white/35 text-sm max-w-xs leading-relaxed">
              Полный спектр — от аренды металла до монтажа «под ключ»
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {services.map((s, i) => (
              <SpotlightCard key={i}
                className={`bg-[#080c10] transition-all duration-500 ${servicesRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                <div className="p-8 group cursor-none h-full relative"
                  style={{ transitionDelay: servicesRef.inView ? `${i * 60}ms` : "0ms" }}>
                  {/* top line reveal */}
                  <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 w-0 group-hover:w-full transition-all duration-500" />

                  {/* bg number */}
                  <div className="absolute top-4 right-5 font-oswald text-6xl font-bold text-white/[0.035] select-none leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10">
                    <div className="w-11 h-11 flex items-center justify-center mb-6 bg-white/5 group-hover:bg-orange-500 transition-all duration-400 group-hover:rotate-12 group-hover:scale-110">
                      <Icon name={s.icon} size={20} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="font-oswald font-semibold text-xl uppercase text-white group-hover:text-orange-400 transition-colors duration-300">{s.title}</h3>
                      <span className="font-roboto text-[10px] text-orange-500/60 border border-orange-500/20 px-2 py-0.5 uppercase tracking-widest shrink-0">{s.tag}</span>
                    </div>
                    <p className="font-roboto font-light text-sm text-white/40 leading-relaxed mb-6">{s.desc}</p>
                    <div className="font-oswald text-xl text-white font-bold">{s.price}</div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0d1117 0%,#0a0e14 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(234,88,12,0.07) 0%,transparent 65%)', transform: 'translate(25%,-25%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(234,88,12,0.04) 0%,transparent 65%)', transform: 'translate(-25%,25%)' }} />

        <div ref={aboutRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className={`transition-all duration-800 ${aboutRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"}`}>
              <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">О компании</p>
              <h2 className="font-oswald font-bold text-5xl md:text-6xl uppercase leading-none mb-8">
                <span className="text-white block">15 лет</span>
                <span className="text-white/10 block">надёжности</span>
              </h2>
              <p className="font-roboto font-light text-white/50 leading-relaxed mb-5">
                Обеспечиваем строительные компании России шпунтом Ларсена с 2009 года. Склад в Москве — более 2 400 тонн металла в постоянном наличии.
              </p>
              <p className="font-roboto font-light text-white/50 leading-relaxed mb-10">
                Работаем с застройщиками, генподрядчиками, дорожниками и гидростроителями.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Склад на МКАДе, отгрузка за 24 ч", "Доставка по России и СНГ", "Договор и закрывающие документы", "Персональный менеджер", "Скидки за объём и срок", "Обратный выкуп металла"].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${aboutRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                    style={{ transitionDelay: `${300 + i * 80}ms` }}>
                    <div className="w-4 h-4 bg-orange-500/15 flex items-center justify-center shrink-0">
                      <Icon name="Check" size={10} className="text-orange-400" />
                    </div>
                    <span className="font-roboto text-sm text-white/55">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-800 delay-200 ${aboutRef.inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-14"}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-orange-500/8 blur-3xl group-hover:bg-orange-500/15 transition-all duration-700" />
                <img src={PILES_IMAGE} alt="Шпунт" className="relative w-full h-96 object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500" />
                <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-orange-500 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.6)] group-hover:shadow-[0_0_80px_rgba(234,88,12,0.9)] transition-all duration-500">
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
              <SpotlightCard key={i} className={`bg-[#080c10] transition-all duration-500 ${advRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="p-8 group cursor-none h-full" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 bg-orange-500/10 group-hover:bg-orange-500/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110">
                    <Icon name={a.icon} size={18} className="text-orange-500" />
                  </div>
                  <h4 className="font-oswald text-base uppercase tracking-wide text-white mb-2">{a.title}</h4>
                  <p className="font-roboto text-xs text-white/40 leading-relaxed">{a.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="py-28" style={{ background: 'linear-gradient(135deg,#0a0e14 0%,#080c10 100%)' }}>
        <div ref={contactRef.ref} className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className={`mb-16 transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <p className="font-oswald text-xs tracking-[0.3em] uppercase text-orange-500 mb-3">Свяжитесь с нами</p>
            <h2 className="font-oswald font-bold uppercase leading-none">
              <span className="block text-white text-5xl md:text-6xl">Получите</span>
              <span className="block text-white/8 text-5xl md:text-6xl">расчёт</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className={`transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <p className="font-roboto font-light text-white/45 leading-relaxed mb-12 max-w-md">
                Оставьте заявку — менеджер перезвонит в течение 15 минут и рассчитает стоимость аренды под ваш проект.
              </p>
              <div className="space-y-6">
                {[
                  { icon: "Phone", title: "+7 (800) 000-00-00", sub: "Бесплатно по России, 8:00–20:00" },
                  { icon: "Mail", title: "zakaz@rentshpunt.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", title: "г. Арамиль, ул. Гарнизон 9", sub: "Склад · Пн–Сб 8:00–19:00" },
                ].map((c, i) => (
                  <div key={i} className={`flex items-start gap-4 group cursor-none transition-all duration-500 ${contactRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                    style={{ transitionDelay: `${200 + i * 100}ms` }}>
                    <div className="w-11 h-11 bg-orange-500/8 border border-orange-500/15 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110">
                      <Icon name={c.icon} size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="font-oswald text-lg text-white">{c.title}</div>
                      <div className="font-roboto text-sm text-white/35 mt-0.5">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {sent ? (
                <div className="min-h-[400px] bg-[#0d1117] border border-orange-500/15 flex flex-col items-center justify-center gap-6 p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.06),transparent_70%)]" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 bg-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.7)]">
                      <Icon name="Check" size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-oswald text-2xl uppercase text-white mb-2">Заявка принята!</h3>
                    <p className="font-roboto text-white/40 text-sm">Перезвоним в течение 15 минут в рабочее время</p>
                  </div>
                  <button onClick={() => setSent(false)}
                    className="font-oswald text-xs uppercase tracking-[0.2em] text-orange-400 border border-orange-500/25 px-8 py-3 hover:bg-orange-500/10 transition-colors cursor-none">
                    Новая заявка
                  </button>
                </div>
              ) : (
                <SpotlightCard className="bg-[#0d1117] border border-white/5">
                  <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="p-8 space-y-6">
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
                          <input type={f.type} placeholder={f.placeholder} required
                            value={formData[f.id as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                            className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 text-white placeholder:text-white/15 px-0 py-3 font-roboto text-sm outline-none transition-colors duration-300 cursor-none" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="font-roboto text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2">Комментарий</label>
                      <textarea placeholder="Профиль Л4/Л5, объём (тн/м), сроки аренды, регион..." rows={4}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 text-white placeholder:text-white/15 px-0 py-3 font-roboto text-sm outline-none transition-colors duration-300 resize-none cursor-none" />
                    </div>
                    <MagneticBtn
                      className="group w-full font-oswald text-sm tracking-[0.2em] uppercase bg-orange-500 hover:bg-orange-400 text-white py-4 hover:shadow-[0_0_40px_rgba(234,88,12,0.6)] flex items-center justify-center gap-3 cursor-none"
                      onClick={() => {}}>
                      Отправить заявку
                      <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                    </MagneticBtn>
                    <p className="font-roboto text-[10px] text-white/20 text-center">
                      Отправляя заявку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                </SpotlightCard>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#05080b] border-t border-white/[0.04] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-3 mb-3 cursor-none">
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
                className="font-roboto text-xs text-white/25 hover:text-orange-400 uppercase tracking-[0.15em] transition-colors cursor-none">
                {label}
              </button>
            ))}
          </div>
          <div className="text-right hidden md:block">
            <a href="tel:+78000000000" className="font-oswald text-xl text-white hover:text-orange-400 transition-colors cursor-none">
              +7 (800) 000-00-00
            </a>
            <p className="font-roboto text-xs text-white/25 mt-1">Бесплатно по России</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-ticker { animation: ticker 22s linear infinite; }
        @keyframes scan { 0%,100%{top:-1px;opacity:0} 10%{opacity:1} 90%{opacity:0.3} 99%{top:100%;opacity:0} }
        .animate-scan { animation: scan 6s ease-in-out infinite; position:absolute; }
        @keyframes shine { 0%{left:-10%} 100%{left:110%} }
        .animate-shine { animation: shine 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}