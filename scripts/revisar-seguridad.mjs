// Revision de lo que suben los alumnos. No reemplaza al antivirus
// (eso lo hace ClamAV en el workflow), esto cubre lo que el antivirus
// no ve: ejecutables disfrazados, archivos enormes, codigo raro en el
// html/js y que nadie se meta a la carpeta de otro.
//
// Uso:
//   node scripts/revisar-seguridad.mjs                 revisa todo grupos/
//   node scripts/revisar-seguridad.mjs a.html b.js     revisa solo esos (lo usa el CI con los archivos del PR)
//   node scripts/revisar-seguridad.mjs --una-carpeta archivos...   ademas exige que sean de un solo alumno

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MAX_ARCHIVO = 10 * 1024 * 1024;   // 10 MB por archivo
const MAX_ALUMNO = 80 * 1024 * 1024;    // 80 MB por alumno

// lo que de plano no se acepta
const EXT_PROHIBIDAS = new Set([
  '.exe', '.dll', '.msi', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.vbe',
  '.ps1', '.psm1', '.sh', '.bash', '.zsh', '.jar', '.apk', '.app', '.dmg', '.pkg',
  '.deb', '.rpm', '.bin', '.iso', '.img', '.lnk', '.reg', '.hta', '.cpl', '.msc',
  '.so', '.dylib', '.class', '.wasm', '.docm', '.xlsm', '.pptm',
  '.zip', '.rar', '.7z', '.tar', '.gz', '.tgz', '.bz2', '.xz',
  '.env', '.pem', '.key', '.p12', '.pfx', '.sqlite', '.db'
]);

// todo lo que no este aqui se marca para revision manual
const EXT_PERMITIDAS = new Set([
  '.html', '.htm', '.css', '.js', '.mjs', '.json', '.md', '.txt', '.csv', '.xml',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.avif',
  '.pdf', '.mp4', '.webm', '.mp3', '.ogg', '.wav',
  '.woff', '.woff2', '.ttf', '.otf', '.map',
  '.py', '.java', '.c', '.cpp', '.h', '.cs', '.ts', '.tsx', '.jsx', '.vue', '.php',
  '.kt', '.swift', '.dart', '.go', '.rs', '.rb', '.sql', '.yml', '.yaml', '.gitkeep'
]);

// firmas de ejecutables por si alguien renombra un .exe a .png
const FIRMAS = [
  { nombre: 'ejecutable de Windows', bytes: [0x4d, 0x5a] },
  { nombre: 'ejecutable de Linux', bytes: [0x7f, 0x45, 0x4c, 0x46] },
  { nombre: 'ejecutable de Mac', bytes: [0xcf, 0xfa, 0xed, 0xfe] },
  { nombre: 'ejecutable de Mac', bytes: [0xfe, 0xed, 0xfa, 0xcf] },
  { nombre: 'ejecutable de Mac', bytes: [0xca, 0xfe, 0xba, 0xbe] },
  { nombre: 'archivo comprimido', bytes: [0x50, 0x4b, 0x03, 0x04] },
  { nombre: 'archivo comprimido', bytes: [0x52, 0x61, 0x72, 0x21] },
  { nombre: 'archivo comprimido', bytes: [0x37, 0x7a, 0xbc, 0xaf] }
];

// patrones que en una practica escolar no tienen razon de estar
const PATRONES = [
  { re: /coinhive|cryptonight|coin-hive|cryptoloot|webminer|minero\.cc/i, msg: 'parece un minero de criptomonedas' },
  { re: /eval\s*\(\s*(atob|unescape|decodeURIComponent)\s*\(/i, msg: 'eval de codigo ofuscado' },
  { re: /new\s+Function\s*\(\s*atob/i, msg: 'Function() con codigo ofuscado' },
  { re: /(window\.)?(top|parent)\.location(\.href)?\s*=/i, msg: 'intenta redirigir la pagina principal' },
  { re: /document\.cookie[^;]{0,80}(fetch|XMLHttpRequest|new Image|sendBeacon)/i, msg: 'manda cookies a otro lado' },
  { re: /localStorage[^;]{0,80}(fetch|sendBeacon)\s*\(\s*['"]https?:/i, msg: 'manda datos del navegador a otro servidor' },
  { re: /<meta[^>]+http-equiv\s*=\s*["']?refresh[^>]+url\s*=\s*https?:/i, msg: 'redireccion automatica a otro sitio' },
  { re: /(\\x[0-9a-f]{2}){40,}/i, msg: 'texto muy ofuscado (\\x..)' },
  { re: /[A-Za-z0-9+/=]{3000,}/, msg: 'bloque base64 enorme' }
];

// llaves que no deben quedar en un repo publico
const SECRETOS = [
  { re: /AKIA[0-9A-Z]{16}/, msg: 'llave de AWS' },
  { re: /AIza[0-9A-Za-z_-]{35}/, msg: 'llave de Google/Firebase (revisa que tenga restricciones)' },
  { re: /gh[pousr]_[A-Za-z0-9]{36,}/, msg: 'token de GitHub' },
  { re: /sk-[A-Za-z0-9_-]{20,}/, msg: 'llave tipo sk- (OpenAI, Stripe, etc)' },
  { re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, msg: 'llave privada' },
  { re: /mongodb(\+srv)?:\/\/[^\s'"]+:[^\s'"]+@/, msg: 'cadena de conexion a MongoDB con contrasena' },
  { re: /postgres(ql)?:\/\/[^\s'"]+:[^\s'"]+@/, msg: 'cadena de conexion a Postgres con contrasena' }
];

const EXT_TEXTO = new Set(['.html', '.htm', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.vue', '.json', '.svg', '.php', '.py', '.css', '.yml', '.yaml', '.txt', '.md']);

const fallas = [];
const revisar = [];

function rel(p) {
  return path.relative(RAIZ, p).split(path.sep).join('/');
}

function listarTodo(dir, salida = []) {
  if (!fs.existsSync(dir)) return salida;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) listarTodo(p, salida);
    else salida.push(p);
  }
  return salida;
}

function carpetaAlumno(relPath) {
  const m = relPath.match(/^grupos\/([^/]+)\/alumnos\/([^/]+)\//);
  return m ? `grupos/${m[1]}/alumnos/${m[2]}` : null;
}

function revisarArchivo(abs) {
  const r = rel(abs);
  let st;
  try {
    st = fs.lstatSync(abs);
  } catch (e) {
    return; // borrado en el PR, no hay nada que revisar
  }

  if (st.isSymbolicLink()) {
    fallas.push(`${r}: no se permiten enlaces simbolicos`);
    return;
  }
  if (!st.isFile()) return;

  const nombre = path.basename(abs).toLowerCase();
  const ext = path.extname(nombre);

  // doble extension tipo tarea.exe.pdf
  if (EXT_PROHIBIDAS.has(ext) || /\.(exe|bat|cmd|scr|vbs|ps1|msi)\./.test(nombre)) {
    fallas.push(`${r}: tipo de archivo no permitido (${ext})`);
    return;
  }
  if (!EXT_PERMITIDAS.has(ext) && nombre !== '.gitkeep') {
    revisar.push(`${r}: extension poco comun (${ext || 'sin extension'}), revisar a mano`);
  }

  if (st.size > MAX_ARCHIVO) {
    fallas.push(`${r}: pesa ${(st.size / 1024 / 1024).toFixed(1)} MB (maximo ${MAX_ARCHIVO / 1024 / 1024} MB)`);
    return;
  }

  const buf = fs.readFileSync(abs);

  for (const f of FIRMAS) {
    if (f.bytes.every((b, i) => buf[i] === b)) {
      fallas.push(`${r}: el contenido es un ${f.nombre} aunque diga ${ext}`);
      return;
    }
  }

  if (!EXT_TEXTO.has(ext)) return;

  const txt = buf.toString('utf8');
  for (const p of PATRONES) {
    if (p.re.test(txt)) fallas.push(`${r}: ${p.msg}`);
  }
  for (const s of SECRETOS) {
    if (s.re.test(txt)) fallas.push(`${r}: parece contener ${s.msg}. Quitala y regenerala, ya quedo expuesta`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const unaCarpeta = args.includes('--una-carpeta');
  const lista = args.filter(a => !a.startsWith('--'));

  const archivos = lista.length
    ? lista.map(a => path.resolve(RAIZ, a))
    : listarTodo(path.join(RAIZ, 'grupos'));

  for (const abs of archivos) revisarArchivo(abs);

  // tamano total por alumno
  const tocadas = new Set(archivos.map(a => carpetaAlumno(rel(a))).filter(Boolean));
  for (const c of tocadas) {
    const total = listarTodo(path.join(RAIZ, c)).reduce((n, f) => {
      try { return n + fs.statSync(f).size; } catch (e) { return n; }
    }, 0);
    if (total > MAX_ALUMNO) {
      fallas.push(`${c}: la carpeta pesa ${(total / 1024 / 1024).toFixed(1)} MB (maximo ${MAX_ALUMNO / 1024 / 1024} MB). Sube videos a YouTube/Drive y pon el enlace`);
    }
  }

  if (unaCarpeta) {
    const fuera = archivos.map(rel).filter(r => !carpetaAlumno(r));
    if (fuera.length) {
      fallas.push('El PR modifica archivos fuera de grupos/<grupo>/alumnos/<tu-carpeta>/:\n      ' + fuera.join('\n      '));
    }
    if (tocadas.size > 1) {
      fallas.push('El PR toca la carpeta de mas de un alumno: ' + [...tocadas].join(', '));
    }
  }

  console.log(`Revisados ${archivos.length} archivo(s).`);
  for (const r of revisar) console.log('  revisar: ' + r);
  for (const f of fallas) console.log('  FALLA: ' + f);

  if (fallas.length) {
    console.log(`\n${fallas.length} problema(s). El PR no se puede aceptar asi.`);
    process.exit(1);
  }
  console.log('Todo bien.');
}

main();
