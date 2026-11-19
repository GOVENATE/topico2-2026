window.BOSENMORI_MEDIA = {
  "folder": {
    "id": "1DfL4uJlr1Z_MR4g_IBs2_QbXrnjSVqJu",
    "url": "https://drive.google.com/drive/folders/1DfL4uJlr1Z_MR4g_IBs2_QbXrnjSVqJu",
    "access": "anyone-with-link-reader"
  },
  "images": {
    "logo-bosenmori.jpg": {
      "id": "1s8vlLL96JGv8V6N3j1DNGTbKqalAW03T",
      "url": "https://drive.google.com/file/d/1s8vlLL96JGv8V6N3j1DNGTbKqalAW03T/view?usp=drivesdk"
    },
    "infografia-poder-empresas.png": {
      "id": "1rY7ZNaJS8HFfhnOhjZw1aCV2QshMtW0A",
      "url": "https://drive.google.com/file/d/1rY7ZNaJS8HFfhnOhjZw1aCV2QshMtW0A/view?usp=drivesdk"
    },
    "Ozymandiasrendercomic.webp": {
      "id": "1wYx7R5h0sSqR5ES3fKj75TBwBYroY-Dy",
      "url": "https://drive.google.com/file/d/1wYx7R5h0sSqR5ES3fKj75TBwBYroY-Dy/view?usp=drivesdk"
    },
    "autor-01.png": {
      "id": "15sMOb14owj02FW-VvPUruIDIiAoPTB6g",
      "url": "https://drive.google.com/file/d/15sMOb14owj02FW-VvPUruIDIiAoPTB6g/view?usp=drivesdk"
    },
    "autor-02.png": {
      "id": "1LXlhbnxmMMOiqg6-i6XhO6x1sIr4jPZj",
      "url": "https://drive.google.com/file/d/1LXlhbnxmMMOiqg6-i6XhO6x1sIr4jPZj/view?usp=drivesdk"
    },
    "autor-03.png": {
      "id": "1H64PwOJhgbQLYWvDXJXFL1lkfxJpGbMF",
      "url": "https://drive.google.com/file/d/1H64PwOJhgbQLYWvDXJXFL1lkfxJpGbMF/view?usp=drivesdk"
    },
    "autor-04.jpg": {
      "id": "1HIINtbqz1XK-1zh4ljCyrOLqpQUZllMs",
      "url": "https://drive.google.com/file/d/1HIINtbqz1XK-1zh4ljCyrOLqpQUZllMs/view?usp=drivesdk"
    },
    "autor-05.jpg": {
      "id": "1M6qTS7mrDi2NFbWnK3Urb_d9OIMJmeQz",
      "url": "https://drive.google.com/file/d/1M6qTS7mrDi2NFbWnK3Urb_d9OIMJmeQz/view?usp=drivesdk"
    },
    "autor-06.jpg": {
      "id": "1c0Twv9kNyBaLBuWa7POZVPHKfvQjlfB-",
      "url": "https://drive.google.com/file/d/1c0Twv9kNyBaLBuWa7POZVPHKfvQjlfB-/view?usp=drivesdk"
    },
    "autor-07.png": {
      "id": "177gJ-TCqmcD9Af7a1On6nKfUSGNfDx49",
      "url": "https://drive.google.com/file/d/177gJ-TCqmcD9Af7a1On6nKfUSGNfDx49/view?usp=drivesdk"
    },
    "autor-08.jpg": {
      "id": "1W5bHp6uz3TXRclbdR3Q4uibAUwHqJqI7",
      "url": "https://drive.google.com/file/d/1W5bHp6uz3TXRclbdR3Q4uibAUwHqJqI7/view?usp=drivesdk"
    },
    "autor-09.png": {
      "id": "1sdcrznBm3JDZWL2MJNNc2hotwRNPStx4",
      "url": "https://drive.google.com/file/d/1sdcrznBm3JDZWL2MJNNc2hotwRNPStx4/view?usp=drivesdk"
    },
    "autor.jpg": {
      "id": "10eCKgDQC8wipYTWxiJLzN1GhNngLGhhC",
      "url": "https://drive.google.com/file/d/10eCKgDQC8wipYTWxiJLzN1GhNngLGhhC/view?usp=drivesdk"
    },
    "cuarto.jpg": {
      "id": "1SLj1k7Kcq-44pgA9YLEF8v8GX4uxrtvU",
      "url": "https://drive.google.com/file/d/1SLj1k7Kcq-44pgA9YLEF8v8GX4uxrtvU/view?usp=drivesdk"
    },
    "mascota.jpg": {
      "id": "1c0Twv9kNyBaLBuWa7POZVPHKfvQjlfB-",
      "url": "https://drive.google.com/file/d/1c0Twv9kNyBaLBuWa7POZVPHKfvQjlfB-/view?usp=drivesdk"
    },
    "paisaje.jpg": {
      "id": "1M6qTS7mrDi2NFbWnK3Urb_d9OIMJmeQz",
      "url": "https://drive.google.com/file/d/1M6qTS7mrDi2NFbWnK3Urb_d9OIMJmeQz/view?usp=drivesdk"
    }
  },
  "video": {
    "id": "1iHn5mDJeujmQPDJYsj3pGPbH2wq30l45",
    "url": "https://drive.google.com/file/d/1iHn5mDJeujmQPDJYsj3pGPbH2wq30l45/view?usp=drivesdk"
  }
};
/* Recursos del portafolio. Los IDs de Drive son públicos, nunca credenciales. */
(function () {
  'use strict';
  const media = window.BOSENMORI_MEDIA;
  const session = new Map();
  const resolutions = new Map();
  function imageCandidates(file) {
    const item = media.images[file];
    return [...(item && item.id ? ['https://drive.google.com/thumbnail?id=' + encodeURIComponent(item.id) + '&sz=w1600'] : []), 'imagenes/' + encodeURIComponent(file)];
  }
  function resolveImage(file) {
    if (resolutions.has(file)) return resolutions.get(file);
    const promise = new Promise((resolve, reject) => {
      const paths = imageCandidates(file);
      function attempt(index) {
        if (index >= paths.length) { reject(new Error('No se pudo cargar la imagen: ' + file)); return; }
        const probe = new Image();
        let finished = false;
        const done = (ok) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          probe.onload = probe.onerror = null;
          if (ok) resolve(paths[index]); else attempt(index + 1);
        };
        const timer = setTimeout(() => done(false), index === 0 && paths.length > 1 ? 3500 : 10000);
        probe.onload = () => done(true);
        probe.onerror = () => done(false);
        probe.src = paths[index];
      }
      attempt(0);
    });
    resolutions.set(file, promise);
    return promise;
  }
  function setImage(img, file) {
    img.src = 'imagenes/' + encodeURIComponent(file);
    resolveImage(file).then(src => { img.src = src; }).catch(() => {});
  }
  function storageGet(key) {
    if (session.has(key)) return session.get(key);
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function storageSet(key, value) {
    session.set(key, value);
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
  }
  window.BosenmoriResources = { imageCandidates, resolveImage, setImage, storageGet, storageSet };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-media-file]').forEach(img => setImage(img, img.dataset.mediaFile));
    document.querySelectorAll('[data-resource-link]').forEach(link => {
      const item = media.images[link.dataset.resourceLink];
      if (item && item.url) link.href = item.url;
    });
    const video = media.video;
    const player = document.getElementById('videoPlayer');
    const status = document.getElementById('videoStatus');
    const open = document.getElementById('videoOpen');
    if (video && video.id && video.url) {
      open.href = video.url;
      open.hidden = false;
      status.textContent = 'Reproduce el video aquí o ábrelo en Drive. Si la vista integrada no está disponible, utiliza el enlace.';
      const loadVideo = () => {
        if (location.hash !== '#video-presentacion' || player.childElementCount) return;
        const iframe = document.createElement('iframe');
        iframe.title = 'Presentación en video de Alan Salvador Rojas Piña';
        iframe.src = 'https://drive.google.com/file/d/' + encodeURIComponent(video.id) + '/preview';
        iframe.allow = 'fullscreen';
        iframe.allowFullscreen = true;
        player.appendChild(iframe);
      };
      window.addEventListener('hashchange', loadVideo);
      loadVideo();
    }
    // Accessible image dialog: focus, Escape and return to the opening control.
    const modal = document.getElementById('modal');
    const close = document.getElementById('closeModal');
    let opener = null;
    document.querySelectorAll('.imgbox').forEach(box => {
      box.tabIndex = 0;
      box.setAttribute('role', 'button');
      box.setAttribute('aria-label', 'Ampliar: ' + box.innerText.trim());
      box.addEventListener('click', () => { opener = box; });
      box.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); box.click(); }
      });
    });
    if (modal && close) {
      new MutationObserver(() => {
        if (modal.classList.contains('active')) close.focus();
        else if (opener) opener.focus();
      }).observe(modal, {attributes:true, attributeFilter:['class']});
      modal.addEventListener('keydown', event => {
        if (event.key === 'Escape') modal.classList.remove('active');
        if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
      });
    }
  });
})();
