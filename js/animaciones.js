// Animaciones del sitio (GSAP + ScrollTrigger + Lenis desde CDN).
// Si las librerias no cargan o el usuario pide menos movimiento,
// todo sigue funcionando: solo no hay animaciones.

(function () {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const activo = !!(gsap && ST) && !reducido;

  const T2 = { activo, transicion: fn => fn(), entrar: () => {} };
  window.T2 = T2;

  // barra de progreso de scroll (funciona aun sin GSAP)
  const progreso = document.createElement('div');
  progreso.className = 'progreso';
  document.body.appendChild(progreso);
  const pintarProgreso = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progreso.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', pintarProgreso, { passive: true });
  addEventListener('resize', pintarProgreso);

  if (!activo) return;

  document.documentElement.classList.add('con-anim');
  gsap.registerPlugin(ST);

  // ---------- scroll suave ----------
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---------- cortina entre paginas ----------
  const cortina = document.createElement('div');
  cortina.className = 'cortina';
  cortina.innerHTML = '<span class="cortina-marca">T2</span>';
  document.body.appendChild(cortina);
  gsap.set(cortina, { yPercent: 100 });

  let primera = true;
  T2.transicion = function (render) {
    if (primera) {
      primera = false;
      render();
      return;
    }
    gsap.timeline()
      .set(cortina, { yPercent: 100 })
      .to(cortina, { yPercent: 0, duration: .45, ease: 'power4.inOut' })
      .add(() => {
        ST.getAll().forEach(t => t.kill());
        if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0);
        render();
      })
      .to(cortina, { yPercent: -100, duration: .55, ease: 'power4.inOut' });
  };

  // ---------- utilidades ----------
  function partirLetras(el) {
    if (!el || el.dataset.partido) return [];
    const texto = el.textContent;
    el.dataset.partido = '1';
    el.setAttribute('aria-label', texto);
    el.innerHTML = texto.split(/(\s+)/).map(pal =>
      /^\s+$/.test(pal) ? pal
        : `<span class="palabra" aria-hidden="true">${[...pal].map(c => `<span class="letra"><span>${c.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></span>`).join('')}</span>`
    ).join('');
    return el.querySelectorAll('.letra > span');
  }

  function contar(el) {
    const fin = parseInt(el.textContent, 10);
    if (!Number.isFinite(fin)) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: fin, duration: 1.6, ease: 'power3.out', delay: .3,
      onUpdate: () => { el.textContent = Math.round(obj.v); }
    });
  }

  // ---------- entrada de cada vista ----------
  T2.entrar = function (raiz) {
    const h1 = raiz.querySelector('h1');
    const letras = partirLetras(h1);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (letras.length) {
      tl.from(letras, { yPercent: 110, rotate: 6, duration: 1.1, stagger: .025 }, .05);
    }
    tl.from(raiz.querySelectorAll('.sobre, .intro, .acciones, .avatar.grande, .etiquetas.sueltas'),
      { y: 24, opacity: 0, duration: .9, stagger: .07 }, .2);

    const nums = raiz.querySelectorAll('.numero');
    if (nums.length) {
      tl.from(nums, { y: 30, opacity: 0, duration: .9, stagger: .08 }, .35);
      nums.forEach(n => contar(n.querySelector('b')));
    }

    const cinta = raiz.querySelector('.cinta');
    if (cinta) {
      tl.from(cinta, { clipPath: 'inset(0 50% 0 50%)', duration: 1.2, ease: 'expo.inOut' }, .5);
      const pista = cinta.querySelector('.cinta-pista');
      // la cinta se inclina con la velocidad del scroll
      ST.create({
        onUpdate: self => {
          const v = gsap.utils.clamp(-12, 12, self.getVelocity() / 250);
          gsap.to(pista, { skewX: -v, duration: .4, overwrite: true });
        }
      });
    }

    // titulos de seccion: la linea se dibuja y el texto sube
    raiz.querySelectorAll('h2').forEach(h2 => {
      gsap.from(h2, {
        '--linea': 0, y: 30, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: h2, start: 'top 88%' }
      });
    });

    // tarjetas y temas aparecen por lotes
    ST.batch(raiz.querySelectorAll('.tarjeta, .tema, .etiquetas.sueltas .etiqueta'), {
      start: 'top 92%',
      onEnter: lote => gsap.from(lote, {
        y: 50, opacity: 0, duration: .9, ease: 'expo.out', stagger: .06, overwrite: true
      })
    });

    // parallax suave en portadas
    raiz.querySelectorAll('.portada').forEach(p => {
      gsap.fromTo(p, { backgroundPositionY: '30%' }, {
        backgroundPositionY: '70%', ease: 'none',
        scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    if (fino) interacciones(raiz);
    ST.refresh();
  };

  // ---------- interacciones con el mouse ----------
  function interacciones(raiz) {
    // luz que sigue al cursor + inclinacion 3D en tarjetas
    raiz.querySelectorAll('.tarjeta').forEach(t => {
      const rx = gsap.quickTo(t, 'rotationX', { duration: .5, ease: 'power3' });
      const ry = gsap.quickTo(t, 'rotationY', { duration: .5, ease: 'power3' });
      t.addEventListener('pointermove', e => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        t.style.setProperty('--mx', (x * 100) + '%');
        t.style.setProperty('--my', (y * 100) + '%');
        rx((.5 - y) * 6);
        ry((x - .5) * 6);
      });
      t.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    // botones magneticos
    raiz.querySelectorAll('.boton, .filtros button, .tema-ejemplos a').forEach(b => {
      const mx = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' });
      const my = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .3);
        my((e.clientY - r.top - r.height / 2) * .3);
      });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  // ---------- cursor propio ----------
  if (fino) {
    const punto = document.createElement('div');
    const aro = document.createElement('div');
    punto.className = 'cursor-punto';
    aro.className = 'cursor-aro';
    document.body.append(punto, aro);
    document.documentElement.classList.add('con-cursor');

    const px = gsap.quickTo(punto, 'x', { duration: .08 });
    const py = gsap.quickTo(punto, 'y', { duration: .08 });
    const ax = gsap.quickTo(aro, 'x', { duration: .45, ease: 'power3' });
    const ay = gsap.quickTo(aro, 'y', { duration: .45, ease: 'power3' });

    addEventListener('pointermove', e => {
      px(e.clientX); py(e.clientY); ax(e.clientX); ay(e.clientY);
    });
    document.addEventListener('pointerover', e => {
      const sobre = e.target.closest('a, button, input, .tarjeta');
      aro.classList.toggle('grande', !!sobre);
      aro.classList.toggle('ver', !!(sobre && sobre.classList.contains('tarjeta')));
    });
    document.addEventListener('pointerleave', () => gsap.to([punto, aro], { opacity: 0 }));
    document.addEventListener('pointerenter', () => gsap.to([punto, aro], { opacity: 1 }));
    // dentro del visor (iframe) el cursor nativo regresa
    document.addEventListener('pointerover', e => {
      const enIframe = e.target.tagName === 'IFRAME';
      gsap.to([punto, aro], { opacity: enIframe ? 0 : 1, duration: .2 });
    });
  }
})();
