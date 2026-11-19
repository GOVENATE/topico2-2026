const tarjetas = Array.from(document.querySelectorAll('.card'));
const botonesTemas = Array.from(document.querySelectorAll('.menu button'));
const barraProgreso = document.getElementById('progress');
const indicadorProgreso = barraProgreso.parentElement;
const contadorTemas = document.getElementById('stepCount');
const botonAnterior = document.getElementById('previousTopic');
const botonSiguiente = document.getElementById('nextTopic');

function mostrar(id, progreso) {
    const tarjetaActiva = document.getElementById(id);

    if (!tarjetaActiva) {
        return;
    }

    tarjetas.forEach(tarjeta => {
        tarjeta.classList.toggle('active', tarjeta === tarjetaActiva);
    });

    botonesTemas.forEach(boton => {
        boton.setAttribute('aria-pressed', String(boton.dataset.topic === id));
    });

    const indiceTema = botonesTemas.findIndex(boton => boton.dataset.topic === id);
    const avance = Number(progreso) || 0;

    barraProgreso.style.width = `${avance}%`;
    indicadorProgreso.setAttribute('aria-valuenow', String(avance));
    contadorTemas.textContent = `${Math.max(indiceTema + 1, 0)} / ${botonesTemas.length}`;

    const indiceTarjeta = tarjetas.indexOf(tarjetaActiva);
    botonAnterior.disabled = indiceTarjeta === 0;
    botonSiguiente.disabled = indiceTarjeta === tarjetas.length - 1;
}

function avanzarA(indice) {
    const tarjeta = tarjetas[indice];

    if (tarjeta.id === 'inicio') {
        mostrar('inicio', 0);
        return;
    }

    const botonTema = botonesTemas.find(boton => boton.dataset.topic === tarjeta.id);
    mostrar(tarjeta.id, botonTema.dataset.progress);
}

botonesTemas.forEach(boton => {
    boton.setAttribute('aria-pressed', 'false');
    boton.addEventListener('click', () => {
        mostrar(boton.dataset.topic, boton.dataset.progress);
    });
});

botonAnterior.addEventListener('click', () => {
    const indiceActual = tarjetas.findIndex(tarjeta => tarjeta.classList.contains('active'));
    avanzarA(Math.max(indiceActual - 1, 0));
});

botonSiguiente.addEventListener('click', () => {
    const indiceActual = tarjetas.findIndex(tarjeta => tarjeta.classList.contains('active'));
    avanzarA(Math.min(indiceActual + 1, tarjetas.length - 1));
});

document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.isContentEditable) {
        return;
    }

    if (event.key === 'ArrowRight' && !botonSiguiente.disabled) {
        event.preventDefault();
        botonSiguiente.click();
    } else if (event.key === 'ArrowLeft' && !botonAnterior.disabled) {
        event.preventDefault();
        botonAnterior.click();
    }
});

mostrar('inicio', 0);