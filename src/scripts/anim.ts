// Interacciones y animaciones del sitio.
// Se ejecuta una vez (iniciarGlobal) y en cada cambio de pagina (iniciarPagina, evento astro:page-load).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
let lenis: Lenis | null = null;
let limpiar: (() => void)[] = [];

// ---------- una sola vez ----------
export function iniciarGlobal() {
  // enlaces viejos del router por hash: /#/g/32/alumno -> /g/32/alumno
  if (location.hash.startsWith('#/g/')) {
    location.replace('/' + location.hash.slice(2));
    return;
  }

  const progreso = document.querySelector<HTMLElement>('.progreso');
  const pintar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progreso) progreso.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', pintar, { passive: true });

  if (reducido) return;

  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('astro:after-swap', () => lenis?.scrollTo(0, { immediate: true }));

  if (fino) cursor();
}

// ---------- en cada pagina ----------
export function iniciarPagina() {
  limpiar.forEach(f => f());
  limpiar = [];
  ScrollTrigger.getAll().forEach(t => t.kill());

  migas();
  buscador();
  filtros();

  if (reducido) return;

  const raiz = document.querySelector<HTMLElement>('[data-pagina]')!;
  entrada(raiz);
  scroll(raiz);
  temasHorizontal(raiz);
  puntos(raiz);
  if (fino) interacciones(raiz);
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

// ---------- utilidades de pagina ----------
function migas() {
  const nav = document.getElementById('migas');
  const datos = document.getElementById('datos-migas') as HTMLTemplateElement | null;
  if (!nav || !datos) return;
  let lista: { txt: string; href?: string }[] = [];
  try { lista = JSON.parse(datos.innerHTML || '[]'); } catch { lista = []; }
  nav.replaceChildren();
  lista.forEach((m, i) => {
    if (i) {
      const s = document.createElement('span');
      s.className = 'text-tenue';
      s.textContent = '/';
      nav.append(s);
    }
    const el = document.createElement(m.href ? 'a' : 'span');
    el.textContent = m.txt;
    if (m.href) (el as HTMLAnchorElement).href = m.href; else el.className = 'text-texto truncate';
    if (m.href) el.className = 'hover:text-texto transition-colors';
    nav.append(el);
  });
}

function buscador() {
  const input = document.querySelector<HTMLInputElement>('[data-buscar]');
  if (!input) return;
  const items = [...document.querySelectorAll<HTMLElement>('[data-busqueda]')];
  const vacio = document.querySelector<HTMLElement>('[data-vacio]');
  input.addEventListener('input', () => {
    const f = input.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    let n = 0;
    items.forEach(it => {
      const ok = !f || it.dataset.busqueda!.includes(f);
      it.hidden = !ok;
      if (ok) n++;
    });
    if (vacio) vacio.hidden = n > 0;
    ScrollTrigger.refresh();
  });
}

function filtros() {
  const botones = [...document.querySelectorAll<HTMLButtonElement>('[data-filtro]')];
  if (!botones.length) return;
  const items = [...document.querySelectorAll<HTMLElement>('[data-tipo]')];
  botones.forEach(b => b.addEventListener('click', () => {
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const tp = b.dataset.filtro;
    const visibles: HTMLElement[] = [];
    items.forEach(it => {
      const ok = !tp || it.dataset.tipo === tp;
      it.hidden = !ok;
      if (ok) visibles.push(it);
    });
    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: 'opacity,transform' });
    ScrollTrigger.refresh();
    if (!reducido) gsap.fromTo(visibles, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .03, ease: 'expo.out' });
  }));
}

// ---------- animaciones ----------
function partirLetras(el: HTMLElement | null) {
  if (!el || el.dataset.partido) return [] as Element[];
  el.dataset.partido = '1';
  const nodos = [...el.childNodes];
  el.setAttribute('aria-label', el.textContent || '');
  el.replaceChildren();
  for (const nodo of nodos) {
    const texto = nodo.textContent || '';
    const clase = nodo.nodeType === 1 ? (nodo as HTMLElement).className : '';
    texto.split(/(\s+)/).forEach(pal => {
      if (!pal) return;
      if (/^\s+$/.test(pal)) { el.append(document.createTextNode(' ')); return; }
      const w = document.createElement('span');
      w.className = 'palabra ' + clase;
      w.setAttribute('aria-hidden', 'true');
      for (const c of pal) {
        const l = document.createElement('span');
        l.className = 'letra';
        const i = document.createElement('span');
        i.textContent = c;
        l.append(i);
        w.append(l);
      }
      el.append(w);
    });
  }
  return [...el.querySelectorAll('.letra > span')];
}

function entrada(raiz: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  raiz.querySelectorAll<HTMLElement>('[data-partir]').forEach((h, i) => {
    tl.from(partirLetras(h), { yPercent: 115, rotate: 8, duration: 1.2, stagger: .028 }, .05 + i * .15);
  });
  tl.from(raiz.querySelectorAll('[data-aparecer]'), { y: 28, opacity: 0, duration: 1, stagger: .08 }, .25);

  raiz.querySelectorAll<HTMLElement>('[data-contar]').forEach(el => {
    const fin = Number(el.dataset.contar);
    const o = { v: 0 };
    gsap.to(o, { v: fin, duration: 1.8, delay: .4, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
  });

  const cinta = raiz.querySelector<HTMLElement>('.cinta');
  if (cinta) {
    tl.from(cinta, { clipPath: 'inset(0 50% 0 50%)', duration: 1.3, ease: 'expo.inOut' }, .5);
    const pista = cinta.querySelector('.cinta-pista');
    ScrollTrigger.create({
      onUpdate: s => gsap.to(pista, { skewX: -gsap.utils.clamp(-14, 14, s.getVelocity() / 220), duration: .4, overwrite: true })
    });
  }
}

function scroll(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('.seccion-h').forEach(h => {
    gsap.from(h, { '--linea-x': 0, y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  ScrollTrigger.batch(raiz.querySelectorAll('[data-lote]'), {
    start: 'top 92%',
    once: true,
    onEnter: lote => gsap.fromTo(lote, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .06, overwrite: true })
  });
  raiz.querySelectorAll<HTMLElement>('.portada').forEach(p => {
    gsap.fromTo(p, { backgroundPositionY: '25%' }, { backgroundPositionY: '75%', ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  raiz.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
    gsap.to(el, { yPercent: Number(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

// la seccion de temas se fija y se desplaza en horizontal (solo pantallas grandes)
function temasHorizontal(raiz: HTMLElement) {
  const sec = raiz.querySelector<HTMLElement>('[data-horizontal]');
  const pista = sec?.querySelector<HTMLElement>('.temas-pista');
  if (!sec || !pista) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const dist = () => pista.scrollWidth - sec.clientWidth;
    gsap.to(pista, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true }
    });
  });
  limpiar.push(() => mm.revert());
}

// lienzo de puntos del hero que reacciona al mouse
function puntos(raiz: HTMLElement) {
  const canvas = raiz.querySelector<HTMLCanvasElement>('[data-puntos]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0, dpr = 1, mx = -999, my = -999, raf = 0, t = 0;
  const paso = 26;
  const medir = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const color = () => getComputedStyle(document.documentElement).getPropertyValue('--texto').trim() || '#000';
  let c = color();
  const dibujar = () => {
    t += .012;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = c;
    for (let y = paso / 2; y < h; y += paso) {
      for (let x = paso / 2; x < w; x += paso) {
        const dx = x - mx, dy = y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 1 - d / 180);
        const ola = (Math.sin(x * .012 + t) + Math.cos(y * .015 + t * .8)) * .5;
        const r = .7 + f * 2.6 + ola * .35;
        ctx.globalAlpha = .12 + f * .7 + ola * .05;
        ctx.beginPath();
        ctx.arc(x - dx * f * .18, y - dy * f * .18, Math.max(.3, r), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(dibujar);
  };
  const mover = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
  const salir = () => { mx = my = -999; };
  const tema = matchMedia('(prefers-color-scheme: dark)');
  const cambiarTema = () => { c = color(); };
  medir();
  dibujar();
  addEventListener('resize', medir);
  addEventListener('pointermove', mover);
  document.addEventListener('pointerleave', salir);
  tema.addEventListener('change', cambiarTema);
  limpiar.push(() => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', medir);
    removeEventListener('pointermove', mover);
    document.removeEventListener('pointerleave', salir);
    tema.removeEventListener('change', cambiarTema);
  });
}

function interacciones(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('.tarjeta').forEach(t => {
    const rx = gsap.quickTo(t, 'rotationX', { duration: .6, ease: 'power3' });
    const ry = gsap.quickTo(t, 'rotationY', { duration: .6, ease: 'power3' });
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty('--mx', x * 100 + '%');
      t.style.setProperty('--my', y * 100 + '%');
      rx((.5 - y) * 7); ry((x - .5) * 7);
    });
    t.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  raiz.querySelectorAll<HTMLElement>('.boton, .filtros button, .tema-link, [data-magnetico]').forEach(b => {
    const mx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' });
    const my = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * .3);
      my((e.clientY - r.top - r.height / 2) * .3);
    });
    b.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

function cursor() {
  const punto = document.createElement('div');
  const aro = document.createElement('div');
  punto.className = 'cursor-punto';
  aro.className = 'cursor-aro';
  document.body.append(punto, aro);
  document.documentElement.classList.add('con-cursor');
  // los elementos creados aqui sobreviven a las transiciones
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.classList.add('con-cursor');
    if (!punto.isConnected) document.body.append(punto, aro);
  });
  const px = gsap.quickTo(punto, 'x', { duration: .08 }), py = gsap.quickTo(punto, 'y', { duration: .08 });
  const ax = gsap.quickTo(aro, 'x', { duration: .45, ease: 'power3' }), ay = gsap.quickTo(aro, 'y', { duration: .45, ease: 'power3' });
  addEventListener('pointermove', e => { px(e.clientX); py(e.clientY); ax(e.clientX); ay(e.clientY); });
  document.addEventListener('pointerover', e => {
    const el = e.target as HTMLElement;
    const sobre = el.closest('a, button, input, .tarjeta');
    aro.classList.toggle('grande', !!sobre);
    aro.classList.toggle('ver', !!el.closest('.tarjeta'));
    gsap.to([punto, aro], { opacity: el.tagName === 'IFRAME' ? 0 : 1, duration: .2 });
  });
  document.addEventListener('pointerleave', () => gsap.to([punto, aro], { opacity: 0 }));
}
