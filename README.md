# Topico 2 - 2026

Sitio donde se juntan las tecnologias y actividades que hicimos en el semestre. Cada alumno sube sus cosas en su carpeta y el sitio las acomoda solo.

```
Inicio (resumen de Topico 2)
  └── Grupo 32
        └── Lista de alumnos
              └── Actividades de cada alumno
```

## Indice

- [Como subir tus actividades](#como-subir-tus-actividades)
- [Que tecnologias se pueden subir](#que-tecnologias-se-pueden-subir)
- [El archivo alumno.json](#el-archivo-alumnojson)
- [Lo que no se acepta](#lo-que-no-se-acepta)
- [Revision automatica (guardia)](#revision-automatica-guardia)
- [Como esta armado](#como-esta-armado)
- [Probarlo en tu compu](#probarlo-en-tu-compu)
- [Para el administrador](#para-el-administrador)

---

## Como subir tus actividades

### 1. Haz fork y clonalo

Dale a **Fork** arriba a la derecha y luego clona tu fork:

```
git clone https://github.com/TU-USUARIO/topico2-2026.git
cd topico2-2026
```

### 2. Crea tu carpeta

Copia la plantilla con tu nombre. Minusculas, sin acentos, sin espacios y con guiones:

```
cp -r grupos/32/alumnos/_plantilla grupos/32/alumnos/juan-perez
```

| Bien | Mal |
|---|---|
| `juan-perez` | `Juan Perez` |
| `maria-lopez-garcia` | `maría_lópez` |

**Solo puedes modificar archivos dentro de tu carpeta.** Si tocas algo mas, el PR se rechaza solo.

### 3. Mete tus actividades

Cada actividad va en su propia carpeta dentro de `actividades/`:

```
grupos/32/alumnos/juan-perez/
├── alumno.json
└── actividades/
    ├── act01-calculadora/
    │   ├── index.html
    │   ├── estilos.css
    │   └── app.js
    ├── act02-reporte/
    │   └── reporte.pdf
    └── act03-app-movil/
        └── captura.png
```

Despues las registras en tu `alumno.json` ([ver abajo](#el-archivo-alumnojson)).

### 4. Revisa antes de subir

```
node scripts/armar-catalogo.mjs
node scripts/revisar-seguridad.mjs
```

Si sale un `ERROR` o una `FALLA` con tu carpeta, corrigelo. Para verlo en el navegador ve a [Probarlo en tu compu](#probarlo-en-tu-compu).

### 5. Commit y Pull Request

```
git add grupos/32/alumnos/juan-perez
git commit -m "Actividades de Juan Perez"
git push
```

En GitHub abre el **Pull Request** hacia `main`. Si la revision sale en rojo, entra a **Details** para ver que fallo, corrige y vuelve a hacer push. El PR se actualiza solo.

---

## Que tecnologias se pueden subir

Se puede usar cualquier tecnologia y no chocan entre si, porque cada actividad se abre aislada (en un iframe con `sandbox`). Lo unico que cambia es **como** se sube:

### 1. Se suben tal cual (`"tipo": "web"`)

- HTML, CSS y JavaScript normal
- Bootstrap, Tailwind (compilado o por CDN), jQuery
- Canvas, p5.js, Three.js, juegos en JS, Phaser

### 2. Se sube solo el build (`"tipo": "web"`)

- React, Vue, Angular, Svelte, Astro, Vite
- Next.js con `output: 'export'`
- TypeScript (se sube el JS ya compilado)

Corres `npm run build` y subes **solo** lo que sale en `dist/` o `build/`. Nunca `node_modules`.

Configura rutas relativas o saldra la pantalla en blanco:

| Herramienta | Que poner |
|---|---|
| Vite | `base: './'` en `vite.config.js` |
| Create React App | `"homepage": "."` en `package.json` |
| Angular | `ng build --base-href ./` |
| React Router | usar `HashRouter` en vez de `BrowserRouter` |

### 3. Se despliegan aparte y aqui va el enlace (`"tipo": "enlace"`)

Todo lo que necesite servidor o base de datos:

- Node / Express, NestJS, Next.js con servidor
- Python (Flask, Django, FastAPI, Streamlit)
- Java (Spring), PHP / Laravel, .NET, Go
- MySQL, PostgreSQL, MongoDB, Firebase
- Cualquier cosa que use API keys
- Juegos de Unity o Godot (en itch.io)

Despliegalo en Render, Railway, Vercel, Netlify, itch.io, etc. y pon el link en `url`. Si quieres que se vea el codigo, agrega `repo`.

### 4. Se sube evidencia (`"imagen"`, `"pdf"` o `"enlace"`)

- Apps moviles (Flutter, Kotlin, Swift, React Native): capturas o video en YouTube
- Programas de consola o escritorio (C, C++, Java, Python): capturas, PDF o el link a tu repo
- Diseno (Figma, diagramas): imagen o link
- Reportes e investigaciones: PDF

**En corto:** si corre en el navegador sin servidor, se sube. Si necesita servidor, va como enlace. Si no es web, va como evidencia.

---

## El archivo alumno.json

```json
{
  "nombre": "Juan Perez",
  "github": "juanperez",
  "sobreMi": "Opcional, una o dos lineas.",
  "actividades": [
    {
      "id": "act01-calculadora",
      "titulo": "Calculadora",
      "descripcion": "Calculadora con historial.",
      "fecha": "2026-09-15",
      "tipo": "web",
      "tecnologias": ["HTML", "CSS", "JavaScript"],
      "ruta": "actividades/act01-calculadora/index.html",
      "repo": "https://github.com/juanperez/calculadora"
    },
    {
      "id": "act02-api-tareas",
      "titulo": "API de tareas",
      "tipo": "enlace",
      "tecnologias": ["Node.js", "Express", "MongoDB"],
      "url": "https://api-tareas.onrender.com"
    }
  ]
}
```

| Campo | Obligatorio | Que es |
|---|---|---|
| `id` | si | Minusculas y guiones, sin repetir. Ej. `act01-calculadora` |
| `titulo` | si | Nombre de la actividad |
| `tipo` | si | `web`, `pdf`, `imagen` o `enlace` |
| `ruta` | para web, pdf e imagen | Archivo dentro de tu carpeta |
| `url` | para enlace | Debe empezar con `https://` |
| `descripcion` | no | Que hiciste |
| `tecnologias` | no | Lista, ej. `["React", "Tailwind"]` |
| `fecha` | no | `2026-09-15` |
| `repo` | no | Link al codigo |

Si tu `alumno.json` esta mal, el sitio no se cae: solo no apareces tu hasta que lo corrijas.

---

## Lo que no se acepta

- Ejecutables: `.exe`, `.bat`, `.sh`, `.jar`, `.apk`, `.msi`, `.wasm`...
- Comprimidos: `.zip`, `.rar`, `.7z`, `.tar.gz`
- `node_modules`, `.env`, contrasenas o llaves de APIs
- Archivos de mas de **10 MB** o carpetas de mas de **80 MB** (los videos van en YouTube o Drive)
- Codigo que intente redirigir el sitio, minar cripto o mandar datos a otro lado
- Tocar la carpeta de otro companero

---

## Revision automatica (guardia)

En cada PR corre `.github/workflows/guardia.yml` y revisa:

1. **Solo tu carpeta.** No puedes modificar nada fuera de `grupos/<grupo>/alumnos/<tu-carpeta>/`.
2. **Tipos de archivo.** Bloquea ejecutables y comprimidos. Detecta un `.exe` renombrado a `.png` y dobles extensiones como `tarea.exe.pdf`.
3. **Tamano.** 10 MB por archivo y 80 MB por alumno.
4. **Codigo sospechoso.** Mineros, `eval` ofuscado, redirecciones, robo de cookies.
5. **Llaves expuestas.** GitHub, AWS, OpenAI, cadenas de conexion con contrasena.
6. **alumno.json.** Que este bien escrito y que las rutas existan.
7. **Antivirus.** ClamAV con firmas actualizadas.

Si algo falla el PR queda en rojo y no se acepta.

---

## Como esta armado

- Sitio estatico: HTML, CSS y JS sin frameworks. No se compila nada.
- Todo sale de `data/catalogo.json`, que se genera leyendo los `alumno.json`.
- Un error de un alumno solo afecta a ese alumno.
- Las actividades web corren en iframe con `sandbox`, no pueden tocar la pagina principal.

```
data/topico.json                 texto de la portada
data/catalogo.json               se genera solo, no editar
grupos/32/alumnos/<carpeta>/     una carpeta por alumno
grupos/32/alumnos/_plantilla/    plantilla para copiar
scripts/armar-catalogo.mjs       junta y valida los alumno.json
scripts/revisar-seguridad.mjs    revision de archivos
.github/workflows/guardia.yml    revision automatica en cada PR
```

Para agregar otro grupo se crea `grupos/<numero>/alumnos/` y aparece solo en la portada.

---

## Probarlo en tu compu

Necesitas Node 18 o mas nuevo.

```
node scripts/armar-catalogo.mjs
python3 -m http.server 8080
```

Abre http://localhost:8080. Abrir el `index.html` con doble clic no funciona porque el navegador bloquea la carga del catalogo.

---

## Para el administrador

**Desplegar:** correr `node scripts/armar-catalogo.mjs`, hacer commit de `data/catalogo.json` y servir la carpeta en GitHub Pages, Netlify, Vercel o cualquier hosting estatico. En Netlify o Vercel se puede poner `node scripts/armar-catalogo.mjs` como comando de build.

**Configuracion en GitHub (una vez):**

1. Settings > Branches > regla para `main`:
   - Require a pull request before merging
   - Require approvals (1) y Require review from Code Owners
   - Require status checks to pass: `guardia`
2. Settings > Actions > General > Fork pull request workflows: *Require approval for first-time contributors*.
3. Los alumnos trabajan con fork y PR, sin permiso de escritura.

La guardia ayuda, pero siempre hay que ver el PR antes de aceptarlo, sobre todo lo que salga marcado como "revisar".
