/* Componentes comunes de las actividades de Juan Diego.
   Cinco modulos: foto, credito, memorama, arrastre, simulador.
   Cada uno corre dentro de su propio try: si uno falla, los demas siguen
   y la pagina conserva su contenido estatico.
   Con ?test en la URL cada modulo corre sus autopruebas (console.assert).
   Nada de localStorage ni cookies: el catalogo carga esto en un iframe con sandbox. */
(function () {
  'use strict';

  var TEST = /[?&]test\b/.test(location.search);

  function seguro(nombre, fn) {
    return function () {
      try { return fn.apply(null, arguments); }
      catch (e) { console.warn('[' + nombre + '] no se pudo iniciar:', e); }
    };
  }

  function el(etiqueta, clase, texto) {
    var n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function barajar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- foto: marcador cuando falta una foto personal ---------------- */

  function marcador(img) {
    var nombre = (img.getAttribute('src') || '').split('/').pop();
    var div = el('div', 'marcador-foto', 'Tu foto aquí · ' + nombre);
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', img.alt || 'Foto pendiente');
    if (img.parentNode) img.parentNode.replaceChild(div, img);
  }

  function vigilarFoto(img) {
    if (img.complete && img.naturalWidth === 0) return marcador(img);
    img.addEventListener('error', function () { marcador(img); });
  }

  var foto = seguro('foto', function (raiz) {
    (raiz || document).querySelectorAll('img[data-foto]').forEach(vigilarFoto);
  });

  /* ---------------- credito: pie de credito de imagenes de la web ---------------- */

  var credito = seguro('credito', function () {
    var datos = window.CREDITOS || {};
    var lista = document.querySelector('#creditos ul');
    var vistos = {};
    document.querySelectorAll('img[data-credito]').forEach(function (img) {
      var clave = img.getAttribute('data-credito');
      if (vistos[clave]) return;
      vistos[clave] = true;
      var c = datos[clave];
      var li = el('li');
      if (!c) {
        li.textContent = 'Crédito pendiente: ' + clave;
        console.warn('[credito] falta el crédito de', clave);
      } else {
        li.appendChild(document.createTextNode(c.titulo + '. ' + c.autor + ', '));
        var a = el('a', null, c.licencia);
        a.href = c.url; a.target = '_blank'; a.rel = 'noopener';
        li.appendChild(a);
        li.appendChild(document.createTextNode(', vía Wikimedia Commons.'));
      }
      if (lista) lista.appendChild(li);
    });
  });

  /* ---------------- memorama ---------------- */
  // opciones: { pares: [{ img, nombre, linea }], salida (elemento aria-live), fin (texto final) }
  function crearMazo(pares) {
    var mazo = [];
    pares.forEach(function (p, i) { mazo.push({ par: i }, { par: i }); });
    return barajar(mazo);
  }

  var memorama = seguro('memorama', function (raiz, op) {
    var estado = raiz.parentNode.querySelector('[data-estado]');
    var salida = op.salida;
    var intentos, encontrados, abiertas, bloqueado;

    function pintar() {
      raiz.innerHTML = '';
      intentos = 0; encontrados = 0; abiertas = []; bloqueado = false;
      crearMazo(op.pares).forEach(function (c) {
        var p = op.pares[c.par];
        var b = el('button', 'carta volteo');
        b.type = 'button';
        b.setAttribute('aria-label', 'Carta boca abajo');
        b.dataset.par = c.par;
        var interna = el('span', 'cara-interna');
        var frente = el('span', 'cara frente', '?');
        var atras = el('span', 'cara atras');
        var img = el('img');
        img.src = p.img; img.alt = p.nombre; img.setAttribute('data-foto', '');
        atras.appendChild(img);
        atras.appendChild(el('span', 'nombre-carta', p.nombre));
        interna.appendChild(frente); interna.appendChild(atras);
        b.appendChild(interna);
        b.addEventListener('click', function () { voltear(b); });
        raiz.appendChild(b);
      });
      foto(raiz);
      contar();
    }

    function contar() {
      if (estado) estado.textContent = encontrados + ' de ' + op.pares.length + ' pares · ' + intentos + ' intentos';
    }

    function voltear(b) {
      if (bloqueado || b.classList.contains('volteada') || b.getAttribute('aria-disabled') === 'true') return;
      b.classList.add('volteada');
      b.setAttribute('aria-label', op.pares[b.dataset.par].nombre);
      abiertas.push(b);
      if (abiertas.length < 2) return;
      intentos++;
      var a = abiertas[0], c = abiertas[1];
      abiertas = [];
      if (a.dataset.par === c.dataset.par) {
        encontrados++;
        [a, c].forEach(function (x) { x.classList.add('par'); x.setAttribute('aria-disabled', 'true'); });
        var p = op.pares[a.dataset.par];
        if (salida) salida.textContent = p.nombre + ': ' + p.linea;
        contar();
        if (encontrados === op.pares.length) terminar();
      } else {
        bloqueado = true;
        contar();
        setTimeout(function () {
          [a, c].forEach(function (x) { x.classList.remove('volteada'); x.setAttribute('aria-label', 'Carta boca abajo'); });
          bloqueado = false;
        }, 900);
      }
    }

    function terminar() {
      if (!salida) return;
      salida.innerHTML = '';
      salida.appendChild(el('p', null, op.fin + ' Lo lograste en ' + intentos + ' intentos.'));
      var otra = el('button', 'boton', 'Jugar otra vez');
      otra.type = 'button';
      otra.addEventListener('click', function () { salida.textContent = ''; pintar(); });
      salida.appendChild(otra);
    }

    pintar();

    if (TEST) {
      var m1 = crearMazo(op.pares), m2, distinto = false;
      console.assert(m1.length === op.pares.length * 2, 'memorama: el mazo debe tener ' + op.pares.length * 2 + ' cartas');
      var cuenta = {};
      m1.forEach(function (c) { cuenta[c.par] = (cuenta[c.par] || 0) + 1; });
      console.assert(Object.keys(cuenta).every(function (k) { return cuenta[k] === 2; }), 'memorama: cada carta debe tener exactamente su par');
      for (var i = 0; i < 20 && !distinto; i++) {
        m2 = crearMazo(op.pares);
        distinto = m2.some(function (c, j) { return c.par !== m1[j].par; });
      }
      console.assert(distinto, 'memorama: barajar debe cambiar el orden');
      console.assert(op.pares.every(function (p) { return p.linea; }), 'memorama: cada gusto necesita su línea');
      console.log('memorama: autopruebas terminadas');
    }
  });

  /* ---------------- arrastre: fichas a zonas, con revision ---------------- */
  // opciones: { zonas: [{ id, nombre }], fichas: [{ id, texto, zona, porque }] }
  var arrastre = seguro('arrastre', function (raiz, op) {
    var bandeja = raiz.querySelector('.bandeja');
    var zonasEl = raiz.querySelector('.zonas');
    var estado = raiz.querySelector('[data-estado]');
    var aviso = raiz.querySelector('[data-aviso]');
    var mover = raiz.querySelector('.mover');
    var elegida = null;
    var porId = {};

    op.zonas.forEach(function (z) {
      var div = el('div', 'zona');
      div.dataset.zona = z.id;
      div.setAttribute('role', 'region');
      div.setAttribute('aria-label', z.nombre);
      div.appendChild(el('h3', null, z.nombre));
      div.addEventListener('dragover', function (e) { e.preventDefault(); div.classList.add('sobre'); });
      div.addEventListener('dragleave', function () { div.classList.remove('sobre'); });
      div.addEventListener('drop', function (e) {
        e.preventDefault(); div.classList.remove('sobre');
        var f = porId[e.dataTransfer.getData('text/plain')];
        if (f) colocar(f, div);
      });
      zonasEl.appendChild(div);
      var b = el('button', 'boton secundario', z.nombre);
      b.type = 'button';
      b.addEventListener('click', function () { if (elegida) colocar(elegida, div); });
      mover.appendChild(b);
    });

    bandeja.addEventListener('dragover', function (e) { e.preventDefault(); });
    bandeja.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = porId[e.dataTransfer.getData('text/plain')];
      if (f) { bandeja.appendChild(f); contar(); }
    });

    barajar(op.fichas).forEach(function (d) {
      var f = el('div', 'ficha', d.texto);
      f.dataset.id = d.id;
      f.tabIndex = 0;
      f.draggable = true;
      f.setAttribute('role', 'button');
      f.setAttribute('aria-pressed', 'false');
      f.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', d.id); });
      f.addEventListener('click', function () { elegir(f); });
      f.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(f); }
      });
      porId[d.id] = f;
      bandeja.appendChild(f);
    });

    function elegir(f) {
      if (elegida) { elegida.classList.remove('elegida'); elegida.setAttribute('aria-pressed', 'false'); }
      elegida = elegida === f ? null : f;
      if (elegida) {
        elegida.classList.add('elegida');
        elegida.setAttribute('aria-pressed', 'true');
        mover.style.display = 'flex';
        decir('Elegiste: ' + f.firstChild.textContent + '. Ahora elige un cuadrante.');
        var primero = mover.querySelector('button');
        if (primero) primero.focus();
      } else {
        mover.style.display = '';
      }
    }

    function colocar(f, zona) {
      f.classList.remove('bien', 'mal', 'elegida');
      f.setAttribute('aria-pressed', 'false');
      var vieja = f.querySelector('.porque');
      if (vieja) vieja.remove();
      zona.appendChild(f);
      elegida = null;
      mover.style.display = '';
      decir(f.firstChild.textContent + ' → ' + zona.getAttribute('aria-label'));
      f.focus();
      contar();
    }

    function contar() {
      var n = zonasEl.querySelectorAll('.ficha').length;
      if (estado) estado.textContent = n + ' de ' + op.fichas.length + ' colocadas';
    }

    function decir(t) { if (aviso) aviso.textContent = t; }

    raiz.querySelector('[data-revisar]').addEventListener('click', function () {
      var bien = 0;
      op.fichas.forEach(function (d) {
        var f = porId[d.id];
        var zona = f.parentNode.dataset ? f.parentNode.dataset.zona : null;
        if (!zona) return;
        if (zona === d.zona) { f.classList.add('bien'); bien++; }
        else {
          var correcta = op.zonas.filter(function (z) { return z.id === d.zona; })[0];
          f.classList.add('mal');
          f.appendChild(el('span', 'porque', 'Va en ' + correcta.nombre + ': ' + d.porque));
          bandeja.appendChild(f);
        }
      });
      contar();
      decir(bien === op.fichas.length
        ? '¡Las ' + bien + ' tarjetas están en su lugar!'
        : bien + ' de ' + op.fichas.length + ' bien. Las que no, regresaron a la bandeja con su explicación.');
    });

    contar();

    if (TEST) {
      var ids = op.zonas.map(function (z) { return z.id; });
      op.fichas.forEach(function (d) {
        console.assert(ids.indexOf(d.zona) >= 0, 'arrastre: ' + d.id + ' apunta a una zona que no existe');
        console.assert(d.porque && d.porque.length > 10, 'arrastre: ' + d.id + ' necesita su porqué');
      });
      console.log('arrastre: autopruebas terminadas (' + op.fichas.length + ' fichas)');
    }
  });

  /* ---------------- simulador: Adversarios accidentales ---------------- */
  // Dos socios A y B. Cada paso, cada uno crece por su cuenta y por la ayuda del otro.
  // A partir del paso "desde", cada uno "arregla lo suyo" y eso le resta al otro (dano).
  function simular(ayudaA, ayudaB, dano, pasos, desde) {
    var a = [10], b = [10];
    for (var t = 1; t <= pasos; t++) {
      var pa = a[t - 1], pb = b[t - 1];
      var na = pa + 1 + (ayudaB / 100) * 2;
      var nb = pb + 1 + (ayudaA / 100) * 2;
      if (t >= desde) {
        na -= (dano / 100) * (1 + ayudaA / 100) * 1.5; // los arreglos de B le pegan a A
        nb -= (dano / 100) * (1 + ayudaB / 100) * 1.5;
        na -= (dano / 100) * (pa - pb > 0 ? 0 : 0.5);
        nb -= (dano / 100) * (pb - pa > 0 ? 0 : 0.5);
      }
      a.push(Math.max(0, na));
      b.push(Math.max(0, nb));
    }
    return { a: a, b: b };
  }

  var simulador = seguro('simulador', function (raiz, op) {
    var svg = raiz.querySelector('svg');
    var lectura = raiz.querySelector('[data-lectura]');
    var ctl = {};
    raiz.querySelectorAll('input[type=range]').forEach(function (i) {
      ctl[i.name] = i;
      var salida = raiz.querySelector('output[for="' + i.id + '"]');
      i.addEventListener('input', function () { if (salida) salida.textContent = i.value; dibujar(); });
    });

    function linea(serie, max, color) {
      var w = 600, h = 300, m = 30;
      var pts = serie.map(function (v, i) {
        var x = m + (i / (serie.length - 1)) * (w - 2 * m);
        var y = h - m - (v / max) * (h - 2 * m);
        return x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' ');
      return '<polyline fill="none" stroke="' + color + '" stroke-width="3" points="' + pts + '"/>';
    }

    function dibujar() {
      var r = simular(+ctl.ayudaA.value, +ctl.ayudaB.value, +ctl.dano.value, op.pasos, op.desde);
      var max = Math.max.apply(null, r.a.concat(r.b, [20]));
      var cs = getComputedStyle(document.documentElement);
      var cA = cs.getPropertyValue('--acento').trim() || '#1f4fd6';
      var cB = cs.getPropertyValue('--acento-2').trim() || '#e5634d';
      var xd = 30 + ((op.desde) / op.pasos) * 540;
      svg.innerHTML =
        '<line x1="30" y1="270" x2="570" y2="270" stroke="currentColor" opacity=".3"/>' +
        '<line x1="' + xd + '" y1="30" x2="' + xd + '" y2="270" stroke="currentColor" stroke-dasharray="4 4" opacity=".4"/>' +
        '<text x="' + (xd + 6) + '" y="44" font-size="13" fill="currentColor" opacity=".7">cada quien arregla lo suyo</text>' +
        linea(r.a, max, cA) + linea(r.b, max, cB) +
        '<text x="34" y="20" font-size="14" fill="' + cA + '">A</text><text x="54" y="20" font-size="14" fill="' + cB + '">B</text>';
      var fa = r.a[r.a.length - 1], fb = r.b[r.b.length - 1];
      var pico = Math.max.apply(null, r.a.slice(0, op.desde + 1)) + Math.max.apply(null, r.b.slice(0, op.desde + 1));
      var total = fa + fb;
      lectura.textContent = total < pico
        ? 'Terminan con ' + total.toFixed(0) + ' puntos entre los dos, menos que los ' + pico.toFixed(0) + ' que tenían cooperando. Cada arreglo "propio" le quitó al socio.'
        : 'Terminan con ' + total.toFixed(0) + ' puntos entre los dos: la cooperación sigue ganando a los arreglos por separado.';
    }

    dibujar();

    if (TEST) {
      var sin = simular(60, 60, 0, 20, 8);
      console.assert(sin.a.every(function (v, i) { return i === 0 || v > sin.a[i - 1]; }), 'simulador: sin daño A siempre crece');
      console.assert(sin.b.every(function (v, i) { return i === 0 || v > sin.b[i - 1]; }), 'simulador: sin daño B siempre crece');
      var con = simular(60, 60, 80, 20, 8);
      console.assert(con.a[20] + con.b[20] < sin.a[20] + sin.b[20], 'simulador: con daño el total final es menor');
      var cero = simular(0, 0, 0, 20, 8);
      console.assert(cero.a.concat(cero.b).every(isFinite), 'simulador: 0/0 no produce NaN');
      console.assert(simular(100, 100, 100, 20, 8).a.every(function (v) { return v >= 0; }), 'simulador: nunca baja de 0');
      console.log('simulador: autopruebas terminadas');
    }
  });

  window.Tarjetas = { foto: foto, credito: credito, memorama: memorama, arrastre: arrastre, simulador: simulador, simular: simular };

  document.addEventListener('DOMContentLoaded', function () { foto(); credito(); });
})();
