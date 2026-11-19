// Router sencillo por hash. Todo sale de data/catalogo.json,
// que se genera con: node scripts/armar-catalogo.mjs
//
// Rutas:
//   #/                       resumen de topico 2
//   #/g/32                   lista de alumnos del grupo
//   #/g/32/juan-perez        actividades del alumno
//   #/g/32/juan-perez/act01  ver una actividad

(function () {
  const app = document.getElementById('app');
  const migas = document.getElementById('migas');
  let catalogo = null;

  function esc(txt) {
    return String(txt ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // solo dejamos pasar http(s), lo demas (javascript:, data:, etc) se descarta
  function urlSegura(url) {
    try {
      const u = new URL(url, location.href);
      return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  const FLECHA = '<svg class="flecha" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  const NOMBRE_TIPO = { web: 'Web', pdf: 'PDF', imagen: 'Imagen', enlace: 'Enlace' };

  function etiquetas(lista, clase = '') {
    if (!Array.isArray(lista) || !lista.length) return '';
    return `<div class="etiquetas ${clase}">` +
      lista.map(t => `<span class="etiqueta">${esc(t)}</span>`).join('') +
      '</div>';
  }

  function iniciales(nombre) {
    return nombre.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  function ponerMigas(partes) {
    migas.innerHTML = partes
      .map(p => p.href ? `<a href="${p.href}">${esc(p.txt)}</a>` : `<span>${esc(p.txt)}</span>`)
      .join('<span class="sep">/</span>');
  }

  function error(msg) {
    app.innerHTML = `<div class="aviso error">${esc(msg)}</div>
      <div class="acciones"><a class="boton" href="#/">Volver al inicio</a></div>`;
  }

  function vistaInicio() {
    const t = catalogo.topico;
    const temas = Array.isArray(catalogo.temas) ? catalogo.temas : [];
    ponerMigas([]);
    document.title = 'Tópico 2 · 2026';

    const alumnos = catalogo.grupos.reduce((n, g) => n + g.alumnos.length, 0);
    const actividades = catalogo.grupos.reduce((n, g) =>
      n + g.alumnos.reduce((m, a) => m + a.actividades.length, 0), 0);

    const grupos = catalogo.grupos.map(g => `
      <a class="tarjeta tarjeta-grupo" href="#/g/${encodeURIComponent(g.id)}">
        ${FLECHA}
        <span class="tipo">Grupo</span>
        <div class="grande">${esc(g.id)}</div>
        <p>${g.alumnos.length} ${g.alumnos.length === 1 ? 'alumno' : 'alumnos'}</p>
      </a>`).join('');

    const listaTemas = temas.map((x, i) => {
      const ejemplos = (x.ejemplos || []).map(e =>
        `<a href="#/g/${encodeURIComponent(e.grupo)}/${encodeURIComponent(e.alumno)}/${encodeURIComponent(e.actividad)}" title="${esc(e.titulo)}">${esc(e.nombre.split(/\s+/)[0])}</a>`).join('');
      return `
        <li class="tema">
          <span class="tema-num">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(x.nombre)}</h3>
          <div>
            <p>${esc(x.resumen)}</p>
            ${ejemplos ? `<div class="tema-ejemplos">${ejemplos}</div>` : ''}
          </div>
          <div class="tema-cuenta"><b>${x.alumnos}</b>${x.alumnos === 1 ? 'alumno' : 'alumnos'} · ${x.actividades} act.</div>
        </li>`;
    }).join('');

    const nombresCinta = temas.map(x => `<span>${esc(x.nombre)}</span>`).join('');
    const cinta = nombresCinta
      ? `<div class="cinta" aria-hidden="true"><div class="cinta-pista">${nombresCinta}${nombresCinta}</div></div>` : '';

    app.innerHTML = `
      <section class="hero">
        <p class="sobre">${esc(t.periodo)}${t.profesor ? ' &middot; ' + esc(t.profesor) : ''}</p>
        <h1>${esc(t.titulo)}</h1>
        ${t.resumen ? `<p class="intro">${esc(t.resumen)}</p>` : ''}
        <div class="numeros">
          <div class="numero"><b>${alumnos}</b><span>alumnos</span></div>
          <div class="numero"><b>${actividades}</b><span>actividades</span></div>
          <div class="numero"><b>${temas.length}</b><span>temas</span></div>
          <div class="numero"><b>${catalogo.tecnologias.length}</b><span>tecnologías</span></div>
        </div>
        ${cinta}
      </section>

      <h2>Grupos <small>${catalogo.grupos.length}</small></h2>
      <div class="rejilla">${grupos || '<p class="vacio">Todavía no hay grupos.</p>'}</div>

      ${listaTemas ? `<h2>Temas encontrados <small>según las actividades</small></h2><ol class="temas">${listaTemas}</ol>` : ''}

      ${catalogo.tecnologias.length ? `<h2>Tecnologías <small>${catalogo.tecnologias.length}</small></h2>${etiquetas(catalogo.tecnologias, 'sueltas')}` : ''}`;
  }

  function vistaGrupo(gid) {
    const g = catalogo.grupos.find(x => x.id === gid);
    if (!g) return error('Ese grupo no existe.');

    ponerMigas([{ txt: 'Inicio', href: '#/' }, { txt: 'Grupo ' + g.id }]);
    document.title = 'Grupo ' + g.id + ' · Tópico 2';

    app.innerHTML = `
      <p class="sobre">${g.alumnos.length} ${g.alumnos.length === 1 ? 'alumno' : 'alumnos'}</p>
      <h1>Grupo ${esc(g.id)}</h1>
      <div class="controles">
        <input class="buscador" id="buscar" type="search" placeholder="Buscar por nombre o tecnología" aria-label="Buscar alumno">
      </div>
      <div class="rejilla" id="lista"></div>`;

    const lista = document.getElementById('lista');
    const pintar = (filtro) => {
      const f = filtro.trim().toLowerCase();
      const visibles = g.alumnos.filter(a =>
        !f ||
        a.nombre.toLowerCase().includes(f) ||
        a.tecnologias.some(t => t.toLowerCase().includes(f)));

      lista.innerHTML = visibles.map(a => `
        <a class="tarjeta" href="#/g/${encodeURIComponent(g.id)}/${encodeURIComponent(a.id)}">
          ${FLECHA}
          <div class="alumno-cab">
            <div class="avatar">${esc(iniciales(a.nombre))}</div>
            <div>
              <h3>${esc(a.nombre)}</h3>
              <p>${a.actividades.length} ${a.actividades.length === 1 ? 'actividad' : 'actividades'}</p>
            </div>
          </div>
          ${etiquetas(a.tecnologias.slice(0, 4))}
        </a>`).join('') || '<p class="vacio">Nadie coincide con la búsqueda.</p>';
    };

    document.getElementById('buscar').addEventListener('input', e => pintar(e.target.value));
    pintar('');
  }

  function buscarAlumno(gid, aid) {
    const g = catalogo.grupos.find(x => x.id === gid);
    if (!g) return {};
    return { g, a: g.alumnos.find(x => x.id === aid) };
  }

  function vistaAlumno(gid, aid) {
    const { g, a } = buscarAlumno(gid, aid);
    if (!a) return error('No encontre a ese alumno.');

    ponerMigas([
      { txt: 'Inicio', href: '#/' },
      { txt: 'Grupo ' + g.id, href: '#/g/' + encodeURIComponent(g.id) },
      { txt: a.nombre }
    ]);
    document.title = a.nombre + ' · Tópico 2';

    const gh = a.github && urlSegura('https://github.com/' + encodeURIComponent(a.github));

    const tarjeta = act => {
      const portada = act.tipo === 'imagen' && act.ruta
        ? `<div class="portada" style="background-image:url('${esc(encodeURI(act.ruta))}')"></div>` : '';
      return `
      <a class="tarjeta" href="#/g/${encodeURIComponent(g.id)}/${encodeURIComponent(a.id)}/${encodeURIComponent(act.id)}">
        ${portada}
        ${portada ? '' : FLECHA}
        <span class="tipo">${NOMBRE_TIPO[act.tipo] || esc(act.tipo)}</span>
        <h3>${esc(act.titulo)}</h3>
        ${act.descripcion ? `<p>${esc(act.descripcion)}</p>` : ''}
        ${etiquetas(act.tecnologias)}
      </a>`;
    };

    const tipos = [...new Set(a.actividades.map(x => x.tipo))];
    const filtros = tipos.length > 1
      ? `<div class="filtros" role="group" aria-label="Filtrar por tipo">
          <button type="button" data-tipo="" aria-pressed="true">Todo<span>${a.actividades.length}</span></button>
          ${tipos.map(tp => `<button type="button" data-tipo="${esc(tp)}" aria-pressed="false">${NOMBRE_TIPO[tp] || esc(tp)}<span>${a.actividades.filter(x => x.tipo === tp).length}</span></button>`).join('')}
        </div>` : '';

    app.innerHTML = `
      <div class="avatar grande">${esc(iniciales(a.nombre))}</div>
      <p class="sobre">Grupo ${esc(g.id)} &middot; ${a.actividades.length} ${a.actividades.length === 1 ? 'actividad' : 'actividades'}</p>
      <h1>${esc(a.nombre)}</h1>
      ${a.sobreMi ? `<p class="intro">${esc(a.sobreMi)}</p>` : ''}
      ${gh ? `<div class="acciones"><a class="boton" href="${esc(gh)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>` : ''}
      <h2>Actividades <small>${a.actividades.length}</small></h2>
      ${filtros ? `<div class="controles">${filtros}</div>` : ''}
      <div class="rejilla" id="acts"></div>`;

    const cont = document.getElementById('acts');
    const pintar = tp => {
      const lista = a.actividades.filter(x => !tp || x.tipo === tp);
      cont.innerHTML = lista.map(tarjeta).join('') || '<p class="vacio">Aún no sube actividades.</p>';
    };
    app.querySelectorAll('.filtros button').forEach(b => b.addEventListener('click', () => {
      app.querySelectorAll('.filtros button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tipo);
    }));
    pintar('');
  }

  function vistaActividad(gid, aid, actId) {
    const { g, a } = buscarAlumno(gid, aid);
    const act = a && a.actividades.find(x => x.id === actId);
    if (!act) return error('No encontre esa actividad.');

    ponerMigas([
      { txt: 'Inicio', href: '#/' },
      { txt: 'Grupo ' + g.id, href: '#/g/' + encodeURIComponent(g.id) },
      { txt: a.nombre, href: '#/g/' + encodeURIComponent(g.id) + '/' + encodeURIComponent(a.id) },
      { txt: act.titulo }
    ]);
    document.title = act.titulo + ' - ' + a.nombre;

    let contenido = '';
    const src = act.ruta || urlSegura(act.url);
    const repo = act.repo && urlSegura(act.repo);

    if (!src) {
      contenido = '<div class="aviso error">Esta actividad no tiene un archivo o enlace valido.</div>';
    } else if (act.tipo === 'web') {
      // sandbox sin allow-same-origin: el codigo del alumno corre aislado
      // y no puede tocar esta pagina aunque truene o haga cosas raras
      contenido = `<iframe class="visor" src="${esc(src)}" sandbox="allow-scripts allow-forms allow-popups" loading="lazy" title="${esc(act.titulo)}"></iframe>`;
    } else if (act.tipo === 'pdf') {
      contenido = `<iframe class="visor" src="${esc(src)}" title="${esc(act.titulo)}"></iframe>`;
    } else if (act.tipo === 'imagen') {
      contenido = `<img class="imagen" src="${esc(src)}" alt="${esc(act.titulo)}">`;
    } else {
      contenido = '<div class="aviso">Esta actividad esta publicada fuera del sitio. Abrela con el boton de arriba.</div>';
    }

    app.innerHTML = `
      <p class="sobre">${NOMBRE_TIPO[act.tipo] || ''}${act.fecha ? ' &middot; ' + esc(act.fecha) : ''} &middot; ${esc(a.nombre)}</p>
      <h1>${esc(act.titulo)}</h1>
      ${act.descripcion ? `<p class="intro">${esc(act.descripcion)}</p>` : ''}
      ${etiquetas(act.tecnologias, 'sueltas')}
      <div class="acciones">
        ${src ? `<a class="boton principal" href="${esc(src)}" target="_blank" rel="noopener noreferrer">Abrir en otra pestaña ↗</a>` : ''}
        ${repo ? `<a class="boton" href="${esc(repo)}" target="_blank" rel="noopener noreferrer">Ver código</a>` : ''}
      </div>
      ${contenido}`;
  }

  function rutear() {
    const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    window.scrollTo(0, 0);
    // reinicia la animacion de entrada en cada cambio de pagina
    app.style.animation = 'none';
    void app.offsetHeight;
    app.style.animation = '';
    try {
      if (partes[0] !== 'g') return vistaInicio();
      if (partes.length === 2) return vistaGrupo(partes[1]);
      if (partes.length === 3) return vistaAlumno(partes[1], partes[2]);
      if (partes.length === 4) return vistaActividad(partes[1], partes[2], partes[3]);
      vistaInicio();
    } catch (e) {
      console.error(e);
      error('Algo fallo al mostrar esta pagina.');
    }
  }

  fetch('data/catalogo.json', { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      catalogo = data;
      window.addEventListener('hashchange', rutear);
      rutear();
    })
    .catch(e => {
      console.error(e);
      error('No se pudo cargar el catalogo. Corre "node scripts/armar-catalogo.mjs" antes de desplegar.');
    });
})();
