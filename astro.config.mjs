import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// En desarrollo servimos /grupos/* desde la raiz del repo (en el build se copian a dist/).
// Va al inicio de la pila para adelantarse al filtro de Astro que bloquea archivos de la raiz.
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.pdf': 'application/pdf', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};

const servirGrupos = {
  name: 'servir-grupos',
  configureServer(server) {
    const base = path.resolve('grupos');
    const handle = (req, res, next) => {
      const url = (req.url || '').split('?')[0];
      if (!url.startsWith('/grupos/')) return next();
      let archivo;
      try { archivo = path.resolve(base, '.' + decodeURIComponent(url.slice('/grupos'.length))); } catch { return next(); }
      if (!archivo.startsWith(base + path.sep) || !fs.existsSync(archivo)) return next();
      if (fs.statSync(archivo).isDirectory()) archivo = path.join(archivo, 'index.html');
      if (!fs.existsSync(archivo)) return next();
      res.setHeader('Content-Type', TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream');
      fs.createReadStream(archivo).pipe(res);
    };
    // se registra al final (post-hook) y se coloca al inicio de la pila
    return () => server.middlewares.stack.unshift({ route: '', handle });
  }
};

export default defineConfig({
  site: 'https://topico2.goverstudioforge.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss(), servirGrupos] }
});
