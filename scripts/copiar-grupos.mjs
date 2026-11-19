// Copia grupos/ a dist/grupos/ despues del build de Astro.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origen = path.join(RAIZ, 'grupos');
const destino = path.join(RAIZ, 'dist', 'grupos');

fs.rmSync(destino, { recursive: true, force: true });
fs.cpSync(origen, destino, { recursive: true, filter: s => !path.basename(s).startsWith('.git') });
console.log('grupos/ copiado a dist/grupos/');
