// Recorre grupos/*/alumnos/*/alumno.json y arma data/catalogo.json
//
// La idea es que si un alumno sube algo mal, se salta a ese alumno
// (o a esa actividad) y el sitio sigue funcionando para los demas.
//
// Uso:
//   node scripts/armar-catalogo.mjs             avisa errores pero no falla
//   node scripts/armar-catalogo.mjs --estricto  falla si hay errores (lo usa el CI)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const estricto = process.argv.includes('--estricto');

const TIPOS = ['web', 'pdf', 'imagen', 'enlace'];
const EXT_POR_TIPO = {
  web: ['.html', '.htm'],
  pdf: ['.pdf'],
  imagen: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
};
const SLUG = /^[a-z0-9][a-z0-9-]{1,60}$/;

const errores = [];
const avisos = [];

function leerJson(archivo) {
  try {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'));
  } catch (e) {
    errores.push(`${rel(archivo)}: no es JSON valido (${e.message})`);
    return null;
  }
}

function rel(p) {
  return path.relative(RAIZ, p).split(path.sep).join('/');
}

function texto(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function listaTextos(v, maxItems = 15) {
  if (!Array.isArray(v)) return [];
  return v.filter(x => typeof x === 'string' && x.trim())
    .map(x => x.trim().slice(0, 40))
    .slice(0, maxItems);
}

function esUrl(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch (e) {
    return false;
  }
}

function carpetas(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();
}

function revisarActividad(act, dirAlumno, donde) {
  if (!act || typeof act !== 'object') {
    errores.push(`${donde}: la actividad no es un objeto`);
    return null;
  }

  const id = texto(act.id, 60);
  if (!SLUG.test(id)) {
    errores.push(`${donde}: "id" debe ser minusculas, numeros y guiones (ej. act01-calculadora)`);
    return null;
  }

  const tipo = TIPOS.includes(act.tipo) ? act.tipo : null;
  if (!tipo) {
    errores.push(`${donde} (${id}): "tipo" debe ser uno de ${TIPOS.join(', ')}`);
    return null;
  }

  const limpia = {
    id,
    tipo,
    titulo: texto(act.titulo, 100) || id,
    descripcion: texto(act.descripcion, 400),
    fecha: texto(act.fecha, 20),
    tecnologias: listaTextos(act.tecnologias)
  };

  if (act.repo) {
    if (esUrl(act.repo)) limpia.repo = act.repo;
    else avisos.push(`${donde} (${id}): "repo" no es una URL valida, se ignora`);
  }

  if (tipo === 'enlace' || (act.url && !act.ruta)) {
    if (!esUrl(act.url)) {
      errores.push(`${donde} (${id}): "url" debe empezar con https://`);
      return null;
    }
    limpia.url = act.url;
    return limpia;
  }

  // archivo local: tiene que existir y quedarse dentro de la carpeta del alumno
  const ruta = texto(act.ruta, 300);
  if (!ruta) {
    errores.push(`${donde} (${id}): falta "ruta" (o "url" si esta desplegado afuera)`);
    return null;
  }

  const abs = path.resolve(dirAlumno, ruta);
  if (!abs.startsWith(dirAlumno + path.sep)) {
    errores.push(`${donde} (${id}): "ruta" no puede salirse de tu carpeta`);
    return null;
  }
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    errores.push(`${donde} (${id}): no existe el archivo ${ruta}`);
    return null;
  }

  const ext = path.extname(abs).toLowerCase();
  if (!EXT_POR_TIPO[tipo].includes(ext)) {
    errores.push(`${donde} (${id}): un tipo "${tipo}" debe apuntar a ${EXT_POR_TIPO[tipo].join(' / ')}`);
    return null;
  }

  limpia.ruta = rel(abs);
  return limpia;
}

function revisarAlumno(gid, carpeta) {
  const dir = path.join(RAIZ, 'grupos', gid, 'alumnos', carpeta);
  const archivo = path.join(dir, 'alumno.json');
  const donde = rel(archivo);

  if (!SLUG.test(carpeta)) {
    errores.push(`${rel(dir)}: el nombre de la carpeta debe ser tipo nombre-apellido (minusculas, sin acentos ni espacios)`);
    return null;
  }
  if (!fs.existsSync(archivo)) {
    errores.push(`${donde}: falta el archivo`);
    return null;
  }

  const datos = leerJson(archivo);
  if (!datos || typeof datos !== 'object') return null;

  const nombre = texto(datos.nombre, 80);
  if (!nombre) {
    errores.push(`${donde}: falta "nombre"`);
    return null;
  }

  const acts = Array.isArray(datos.actividades) ? datos.actividades : [];
  if (!Array.isArray(datos.actividades)) avisos.push(`${donde}: "actividades" deberia ser una lista`);

  const vistos = new Set();
  const actividades = [];
  for (const act of acts.slice(0, 60)) {
    const ok = revisarActividad(act, dir, donde);
    if (!ok) continue;
    if (vistos.has(ok.id)) {
      errores.push(`${donde}: la actividad "${ok.id}" esta repetida`);
      continue;
    }
    vistos.add(ok.id);
    actividades.push(ok);
  }

  const github = texto(datos.github, 40);

  return {
    id: carpeta,
    nombre,
    github: /^[A-Za-z0-9-]+$/.test(github) ? github : '',
    sobreMi: texto(datos.sobreMi, 400),
    tecnologias: [...new Set(actividades.flatMap(a => a.tecnologias))],
    actividades
  };
}

function main() {
  const topico = leerJson(path.join(RAIZ, 'data', 'topico.json')) || {
    titulo: 'Topico 2',
    periodo: '2026',
    resumen: ''
  };

  const grupos = [];
  for (const gid of carpetas(path.join(RAIZ, 'grupos'))) {
    const alumnos = [];
    for (const carpeta of carpetas(path.join(RAIZ, 'grupos', gid, 'alumnos'))) {
      try {
        const a = revisarAlumno(gid, carpeta);
        if (a) alumnos.push(a);
      } catch (e) {
        errores.push(`grupos/${gid}/alumnos/${carpeta}: error inesperado (${e.message})`);
      }
    }
    alumnos.sort((x, y) => x.nombre.localeCompare(y.nombre, 'es'));
    grupos.push({ id: gid, alumnos });
  }

  const tecnologias = [...new Set(
    grupos.flatMap(g => g.alumnos.flatMap(a => a.tecnologias))
  )].sort((x, y) => x.localeCompare(y, 'es'));

  const catalogo = {
    generado: new Date().toISOString(),
    topico,
    tecnologias,
    grupos
  };

  fs.writeFileSync(path.join(RAIZ, 'data', 'catalogo.json'), JSON.stringify(catalogo, null, 2) + '\n');

  const totalAlumnos = grupos.reduce((n, g) => n + g.alumnos.length, 0);
  console.log(`Catalogo listo: ${grupos.length} grupo(s), ${totalAlumnos} alumno(s).`);

  for (const a of avisos) console.log('  aviso: ' + a);
  for (const e of errores) console.log('  ERROR: ' + e);

  if (estricto && errores.length) {
    console.log(`\n${errores.length} error(es). Corrigelos antes de hacer merge.`);
    process.exit(1);
  }
}

main();
