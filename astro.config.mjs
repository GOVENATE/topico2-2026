import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// En desarrollo servimos /grupos desde la raiz del repo (en el build se copian a dist/).
const servirGrupos = {
  name: 'servir-grupos',
  configureServer(server) {
    server.middlewares.use('/grupos', (req, res, next) => {
      const ruta = decodeURIComponent((req.url || '').split('?')[0].split('#')[0]);
      const base = path.resolve('grupos');
      const archivo = path.resolve(base, '.' + ruta);
      if (!archivo.startsWith(base) || !fs.existsSync(archivo) || !fs.statSync(archivo).isFile()) return next();
      const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
      res.setHeader('Content-Type', tipos[path.extname(archivo).toLowerCase()] || 'application/octet-stream');
      fs.createReadStream(archivo).pipe(res);
    });
  }
};

export default defineConfig({
  site: 'https://topico2.goverstudioforge.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss(), servirGrupos] }
});
