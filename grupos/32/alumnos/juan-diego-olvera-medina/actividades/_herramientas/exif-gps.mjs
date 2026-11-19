// Revisa que ninguna foto .jpg de una carpeta traiga ubicacion GPS en su EXIF.
// Uso: node exif-gps.mjs <carpeta>   -> sale con 1 si alguna foto tiene GPS.
// Lee solo el segmento APP1 "Exif" y busca la etiqueta GPSInfo (0x8825) en IFD0,
// asi no hay falsos positivos por bytes sueltos dentro de la imagen.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function tieneGps(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return false; // no es JPEG
  let p = 2;
  while (p + 4 <= buf.length && buf[p] === 0xff) {
    const marca = buf[p + 1];
    if (marca === 0xda || marca === 0xd9) break; // empiezan los datos de imagen
    const largo = buf.readUInt16BE(p + 2);
    if (marca === 0xe1 && buf.toString('latin1', p + 4, p + 10) === 'Exif\0\0') {
      const t = p + 10; // inicio del encabezado TIFF
      const le = buf.toString('latin1', t, t + 2) === 'II';
      const u16 = o => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
      const u32 = o => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
      const ifd0 = t + u32(t + 4);
      if (ifd0 + 2 > buf.length) return false;
      const n = u16(ifd0);
      for (let i = 0; i < n; i++) {
        const e = ifd0 + 2 + i * 12;
        if (e + 2 > buf.length) break;
        if (u16(e) === 0x8825) return true;
      }
    }
    p += 2 + largo;
  }
  return false;
}

const carpeta = process.argv[2];
const esPrincipal = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (esPrincipal && carpeta) {
  let malas = 0;
  const archivos = fs.existsSync(carpeta) ? fs.readdirSync(carpeta) : [];
  for (const f of archivos) {
    if (!/\.jpe?g$/i.test(f)) continue;
    if (tieneGps(fs.readFileSync(path.join(carpeta, f)))) {
      console.error(`GPS encontrado en ${f}: quita la ubicacion antes de subirla (ver mis-fotos/LEEME.txt)`);
      malas++;
    }
  }
  if (malas) process.exit(1);
  console.log(`exif-gps: ${archivos.filter(f => /\.jpe?g$/i.test(f)).length} foto(s) sin GPS`);
}
