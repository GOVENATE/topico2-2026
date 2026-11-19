import data from '../../data/catalogo.json';

export type Actividad = {
  id: string; tipo: 'web' | 'pdf' | 'imagen' | 'enlace'; titulo: string; descripcion: string;
  fecha?: string; tecnologias: string[]; ruta?: string; url?: string; repo?: string;
};
export type Alumno = { id: string; nombre: string; github: string; sobreMi: string; tecnologias: string[]; actividades: Actividad[] };
export type Grupo = { id: string; alumnos: Alumno[] };
export type Tema = {
  id: string; nombre: string; resumen: string; alumnos: number; actividades: number;
  ejemplos: { grupo: string; alumno: string; nombre: string; actividad: string; titulo: string }[];
};

export const catalogo = data as unknown as {
  generado: string;
  topico: { titulo: string; periodo: string; profesor?: string; resumen: string };
  tecnologias: string[];
  temas: Tema[];
  grupos: Grupo[];
};

export const NOMBRE_TIPO: Record<string, string> = { web: 'Web', pdf: 'PDF', imagen: 'Imagen', enlace: 'Enlace' };

export const iniciales = (n: string) =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

export function urlSegura(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch { return null; }
}

/** ruta publica de un archivo de alumno (encodeURI conserva el #ancla) */
export const rutaArchivo = (r?: string) => (r ? '/' + encodeURI(r) : null);

export const totalActividades = catalogo.grupos.reduce((n, g) => n + g.alumnos.reduce((m, a) => m + a.actividades.length, 0), 0);
export const totalAlumnos = catalogo.grupos.reduce((n, g) => n + g.alumnos.length, 0);
export const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;
