// Cargar ANTES del script de cada página.
// Utilidades compartidas: pestañas, tarjetas que se voltean, selector con detalle y cuestionarios.
(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const iniciar = () => {
  // Pestañas: <div class="tabs" data-tabs="grupo"><button class="tab" data-tab="x">..</button></div>
  //           <div class="panel" data-panel="x" data-grupo="grupo">..</div>
  $$('[data-tabs]').forEach(bar => {
    const grupo = bar.dataset.tabs;
    const tabs = $$('[data-tab]', bar);
    const paneles = $$(`[data-grupo="${grupo}"]`);
    bar.setAttribute('role', 'tablist');
    const activar = id => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
      paneles.forEach(p => { p.hidden = p.dataset.panel !== id; });
    };
    tabs.forEach(t => { t.setAttribute('role', 'tab'); t.addEventListener('click', () => activar(t.dataset.tab)); });
    if (tabs[0]) activar(tabs[0].dataset.tab);
  });

  // Tarjetas que se voltean
  $$('.flip').forEach(f => {
    f.setAttribute('aria-expanded', 'false');
    f.addEventListener('click', () => f.setAttribute('aria-expanded', String(f.getAttribute('aria-expanded') !== 'true')));
  });
  };
  // Se espera a que los scripts de cada página terminen de generar su contenido
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.esc = esc;

  // Selector con detalle: selector(contenedorBotones, contenedorDetalle, items, render)
  window.selector = function (picker, detalle, items, render) {
    picker.innerHTML = items.map((it, i) => `<button class="pick" type="button" data-i="${i}">${esc(it.titulo)}</button>`).join('');
    const botones = $$('.pick', picker);
    const ver = i => {
      botones.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
      detalle.innerHTML = render(items[i], i);
      detalle.classList.remove('panel'); void detalle.offsetWidth; detalle.classList.add('panel');
    };
    botones.forEach((b, i) => b.addEventListener('click', () => ver(i)));
    ver(0);
  };

  // Cuestionario: quiz(contenedor, [{q, ops:[...], ok: indice, por: 'explicación'}])
  window.quiz = function (el, preguntas) {
    let i = 0, puntos = 0;
    el.classList.add('quiz');
    const pintar = () => {
      if (i >= preguntas.length) {
        el.innerHTML = `<p class="q">Resultado: ${puntos} de ${preguntas.length}</p>
          <p class="fb">${puntos === preguntas.length ? 'Todo correcto.' : 'Revisa las explicaciones y vuelve a intentarlo.'}</p>
          <div class="acciones"><button class="btn" type="button">Volver a empezar</button></div>`;
        el.querySelector('button').onclick = () => { i = 0; puntos = 0; pintar(); };
        return;
      }
      const p = preguntas[i];
      el.innerHTML = `<p class="marcador">Pregunta ${i + 1} de ${preguntas.length}</p>
        <p class="q">${esc(p.q)}</p>
        <div class="opts">${p.ops.map((o, j) => `<button class="opt" type="button" data-j="${j}">${esc(o)}</button>`).join('')}</div>
        <p class="fb" aria-live="polite"></p>
        <div class="pie"><span class="marcador">Aciertos: ${puntos}</span><button class="btn" type="button" hidden>Siguiente</button></div>`;
      const sig = el.querySelector('.pie .btn');
      $$('.opt', el).forEach(b => b.addEventListener('click', () => {
        const j = +b.dataset.j;
        $$('.opt', el).forEach(x => { x.disabled = true; if (+x.dataset.j === p.ok) x.classList.add('bien'); });
        if (j === p.ok) puntos++; else b.classList.add('mal');
        el.querySelector('.fb').textContent = (j === p.ok ? 'Correcto. ' : 'No exactamente. ') + (p.por || '');
        sig.hidden = false; sig.focus();
      }));
      sig.onclick = () => { i++; pintar(); };
    };
    pintar();
  };
})();
