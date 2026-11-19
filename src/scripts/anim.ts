// Interacciones del sitio y animaciones sutiles.
// iniciarGlobal corre una vez; iniciarPagina en cada cambio de pagina (astro:page-load).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function iniciarGlobal() {
  // enlaces viejos del router por hash: /#/g/32/alumno -> /g/32/alumno
  if (location.hash.startsWith('#/g/')) location.replace('/' + location.hash.slice(2));
}

export function iniciarPagina() {
  ScrollTrigger.getAll().forEach(t => t.kill());
  migas();
  buscador();
  filtros();
  if (reducido) return;
  const raiz = document.querySelector<HTMLElement>('[data-pagina]');
  if (!raiz) return;
  aparecer(raiz);
  contadores(raiz);
}

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
      s.className = 'text-linea-fuerte';
      s.textContent = '/';
      nav.append(s);
    }
    const el = document.createElement(m.href ? 'a' : 'span');
    el.textContent = m.txt;
    if (m.href) {
      (el as HTMLAnchorElement).href = m.href;
      el.className = 'hover:text-texto';
    } else {
      el.className = 'truncate font-medium text-texto';
    }
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
  });
}

function filtros() {
  const botones = [...document.querySelectorAll<HTMLButtonElement>('[data-filtro]')];
  if (!botones.length) return;
  const items = [...document.querySelectorAll<HTMLElement>('[data-tipo]')];
  botones.forEach(b => b.addEventListener('click', () => {
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const tp = b.dataset.filtro;
    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: 'opacity,transform' });
    items.forEach(it => { it.hidden = !!tp && it.dataset.tipo !== tp; });
    ScrollTrigger.refresh();
  }));
}

// fade + 12px hacia arriba, una sola vez
function aparecer(raiz: HTMLElement) {
  const els = raiz.querySelectorAll<HTMLElement>('[data-lote]');
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: 12 });
  ScrollTrigger.batch(els, {
    start: 'top 95%',
    once: true,
    onEnter: lote => gsap.to(lote, { opacity: 1, y: 0, duration: .5, ease: 'power2.out', stagger: .04, overwrite: true })
  });
}

function contadores(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('[data-contar]').forEach(el => {
    const fin = Number(el.dataset.contar);
    if (!Number.isFinite(fin)) return;
    const o = { v: 0 };
    gsap.to(o, { v: fin, duration: 1.2, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
  });
}
