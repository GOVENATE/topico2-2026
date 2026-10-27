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

  function etiquetas(lista) {
    if (!Array.isArray(lista) || !lista.length) return '';
    return '<div class="etiquetas">' +
      lista.map(t => `<span class="etiqueta">${esc(t)}</span>`).join('') +
      '</div>';
  }

  function ponerMigas(partes) {
    migas.innerHTML = partes
      .map(p => p.href ? `<a href="${p.href}">${esc(p.txt)}</a>` : esc(p.txt))
      .join(' / ');
  }

  function error(msg) {
    app.innerHTML = `<div class="aviso error">${esc(msg)}</div>
      <p><a href="#/">Volver al inicio</a></p>`;
  }

  function vistaInicio() {
    const t = catalogo.topico;
    ponerMigas([]);
    document.title = 'Topico 2 - 2026';

    const grupos = catalogo.grupos.map(g => `
      <a class="tarjeta" href="#/g/${encodeURIComponent(g.id)}">
        <h3>Grupo ${esc(g.id)}</h3>
        <p>${g.alumnos.length} alumnos</p>
      </a>`).join('');

    const temas = (t.temas || []).map(x => `<li>${esc(x)}</li>`).join('');

    app.innerHTML = `
      <h1>${esc(t.titulo)}</h1>
      <p class="sub">${esc(t.periodo)}${t.profesor ? ' &middot; ' + esc(t.profesor) : ''}</p>
      <p>${esc(t.resumen)}</p>
      ${temas ? `<h2>Lo que se vio en el semestre</h2><ul>${temas}</ul>` : ''}
      ${etiquetas(catalogo.tecnologias)}
      <h2>Grupos</h2>
      <div class="rejilla">${grupos || '<p class="sub">Todavia no hay grupos.</p>'}</div>`;
  }

  function vistaGrupo(gid) {
    const g = catalogo.grupos.find(x => x.id === gid);
    if (!g) return error('Ese grupo no existe.');

    ponerMigas([{ txt: 'Inicio', href: '#/' }, { txt: 'Grupo ' + g.id }]);
    document.title = 'Grupo ' + g.id + ' - Topico 2';

    app.innerHTML = `
      <h1>Grupo ${esc(g.id)}</h1>
      <p class="sub">${g.alumnos.length} alumnos</p>
      <input class="buscador" id="buscar" type="search" placeholder="Buscar por nombre o tecnologia...">
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
          <h3>${esc(a.nombre)}</h3>
          <p>${a.actividades.length} actividades</p>
          ${etiquetas(a.tecnologias.slice(0, 5))}
        </a>`).join('') || '<p class="sub">Nadie coincide con la busqueda.</p>';
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
    document.title = a.nombre + ' - Topico 2';

    const extra = [];
    const gh = a.github && urlSegura('https://github.com/' + encodeURIComponent(a.github));
    if (gh) extra.push(`<a href="${esc(gh)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);

    const acts = a.actividades.map(act => `
      <a class="tarjeta" href="#/g/${encodeURIComponent(g.id)}/${encodeURIComponent(a.id)}/${encodeURIComponent(act.id)}">
        <h3>${esc(act.titulo)}</h3>
        <p>${esc(act.descripcion)}</p>
        ${etiquetas(act.tecnologias)}
      </a>`).join('');

    app.innerHTML = `
      <h1>${esc(a.nombre)}</h1>
      <p class="sub">${extra.join(' &middot; ')}</p>
      ${a.sobreMi ? `<p>${esc(a.sobreMi)}</p>` : ''}
      <h2>Actividades</h2>
      <div class="rejilla">${acts || '<p class="sub">Aun no sube actividades.</p>'}</div>`;
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
      contenido = `<div class="aviso">Esta actividad esta fuera del sitio.</div>`;
    }

    app.innerHTML = `
      <h1>${esc(act.titulo)}</h1>
      <p class="sub">${esc(act.fecha || '')}</p>
      <p>${esc(act.descripcion)}</p>
      ${etiquetas(act.tecnologias)}
      <p><a href="${esc(src || '#')}" target="_blank" rel="noopener noreferrer">Abrir en otra pestana</a>
      ${act.repo && urlSegura(act.repo) ? ` &middot; <a href="${esc(urlSegura(act.repo))}" target="_blank" rel="noopener noreferrer">Ver codigo</a>` : ''}</p>
      ${contenido}`;
  }

  function rutear() {
    const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    window.scrollTo(0, 0);
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
