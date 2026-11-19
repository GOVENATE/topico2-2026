const disciplines = [
    {
        name: 'Pensamiento sistémico',
        kind: 'La que integra',
        description: 'Permite observar interrelaciones y patrones de cambio, en lugar de explicar cada situación como un hecho aislado. Ayuda a detectar cómo las decisiones generan efectos en otras partes del sistema y a lo largo del tiempo.',
        practice: 'Traza qué influye sobre qué, dónde hay demoras y qué patrón reaparece. Pregunta qué estructura sostiene el resultado, además de quién tomó la decisión.'
    },
    {
        name: 'Dominio personal',
        kind: 'Claridad y práctica',
        description: 'Es la práctica de aclarar lo que importa, sostener una visión personal y observar la realidad con honestidad. No significa dominar a otras personas: se desarrolla mediante aprendizaje continuo y paciencia.',
        practice: 'Nombra una aspiración concreta y compárala con la situación actual. Identifica qué capacidad necesitas practicar para acercarte a ella.'
    },
    {
        name: 'Modelos mentales',
        kind: 'Supuestos a la vista',
        description: 'Son supuestos, generalizaciones e imágenes internas que influyen en lo que interpretamos y hacemos. A menudo operan sin que los notemos; examinarlos permite poner a prueba ideas arraigadas.',
        practice: 'Separa observaciones de interpretaciones. Pregunta qué evidencia apoya tu conclusión y qué cambiaría tu perspectiva.'
    },
    {
        name: 'Visión compartida',
        kind: 'Aspiración común',
        description: 'Consiste en construir una imagen de futuro que las personas quieran alcanzar en conjunto. Una visión genuina genera compromiso; no es solo una frase redactada por quien dirige ni una orden que se acata.',
        practice: 'Invita a cada persona a expresar qué futuro considera valioso y busca la aspiración común sin imponer una formulación prefabricada.'
    },
    {
        name: 'Aprendizaje en equipo',
        kind: 'Pensar en conjunto',
        description: 'Desarrolla la capacidad de conversar y coordinarse para producir comprensiones y resultados que no aparecen sumando esfuerzos individuales. Requiere diálogo, escucha y hacer visibles los patrones defensivos.',
        practice: 'Antes de debatir soluciones, comparte los supuestos que sostienen cada postura. Escucha para entender, no solo para responder.'
    }
];

const disciplineTabs = [...document.querySelectorAll('.qd-discipline-tab')];
const disciplineDetail = document.querySelector('#discipline-detail');

function showDiscipline(index) {
    const discipline = disciplines[index];
    disciplineTabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
    });
    disciplineDetail.setAttribute('aria-labelledby', `discipline-tab-${index}`);
    document.querySelector('#discipline-number').textContent = `DISCIPLINA ${String(index + 1).padStart(2, '0')}`;
    document.querySelector('#discipline-kind').textContent = discipline.kind.toLocaleUpperCase('es');
    document.querySelector('#discipline-name').textContent = discipline.name;
    document.querySelector('#discipline-description').textContent = discipline.description;
    document.querySelector('#discipline-practice').textContent = discipline.practice;
    document.querySelector('#discipline-progress').style.width = `${((index + 1) / disciplines.length) * 100}%`;
}

disciplineTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showDiscipline(index));
    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (index + direction + disciplineTabs.length) % disciplineTabs.length;
        showDiscipline(nextIndex);
        disciplineTabs[nextIndex].focus();
    });
});

const barrierNames = [
    '“Yo soy mi puesto”',
    'El enemigo externo',
    'La ilusión de hacerse cargo',
    'Fijación en los hechos',
    'La parábola de la rana hervida',
    'La ilusión de aprender con la experiencia',
    'El mito del equipo administrativo'
];
const barrierScores = new Map();
const barrierRows = [...document.querySelectorAll('.qd-barrier-row')];
const diagnosticResult = document.querySelector('#diagnostic-result');

function updateDiagnostic() {
    const answered = barrierScores.size;
    document.querySelector('#diagnostic-progress').textContent = `${answered} de 7 respuestas`;
    diagnosticResult.hidden = answered < barrierRows.length;
    if (answered < barrierRows.length) return;

    const ranked = [...barrierScores.entries()].sort((first, second) => second[1] - first[1]);
    const highestScore = ranked[0][1];
    const highestIndexes = ranked.filter((entry) => entry[1] === highestScore).map((entry) => entry[0]);
    const resultTitle = document.querySelector('#result-title');
    const resultCopy = document.querySelector('#result-copy');

    if (highestScore === 0) {
        resultTitle.textContent = 'No aparece una barrera dominante';
        resultCopy.textContent = 'Las respuestas sugieren que estas dinámicas no son frecuentes en el equipo. Conviene mantener espacios para observar cómo cambian con el tiempo.';
    } else if (highestIndexes.length > 1) {
        resultTitle.textContent = 'Hay varios patrones para explorar';
        resultCopy.textContent = `Las puntuaciones más altas coinciden en ${highestIndexes.map((index) => barrierNames[index]).join(' y ')}. Conversen sobre ejemplos concretos antes de decidir qué explica mejor la situación.`;
    } else {
        const barrierIndex = highestIndexes[0];
        resultTitle.textContent = `Un punto de partida: ${barrierNames[barrierIndex]}`;
        resultCopy.textContent = 'Esta respuesta no es una etiqueta. Úsenla para describir un caso reciente, identificar qué información falta y preguntar qué patrón se repite.';
    }
}

barrierRows.forEach((row, index) => {
    row.querySelectorAll('.qd-rating button').forEach((button) => {
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
            barrierScores.set(index, Number(button.dataset.score));
            row.classList.add('is-rated');
            row.querySelectorAll('.qd-rating button').forEach((option) => {
                option.setAttribute('aria-pressed', String(option === button));
            });
            updateDiagnostic();
        });
    });
});

document.querySelector('#reset-diagnostic').addEventListener('click', () => {
    barrierScores.clear();
    barrierRows.forEach((row) => {
        row.classList.remove('is-rated');
        row.querySelectorAll('.qd-rating button').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    });
    updateDiagnostic();
});

const lenses = [
    {
        label: 'LO QUE OCURRIÓ',
        question: '¿Qué pasó esta semana?',
        description: 'Una explicación centrada en los acontecimientos inmediatos invita a reaccionar a lo visible. Puede ser cierta, pero no muestra por qué la situación se repite.',
        example: '“No llegó el pedido; voy a pedir más.”'
    },
    {
        label: 'LO QUE SE REPITE',
        question: '¿Qué tendencia aparece en el tiempo?',
        description: 'Observar la secuencia permite reconocer ritmos y cambios: pedidos que suben, faltantes que persisten y entregas que llegan cuando la demanda ya cambió.',
        example: '“Los pedidos crecen y caen con retraso.”'
    },
    {
        label: 'QUÉ LO GENERA',
        question: '¿Qué relaciones producen ese patrón?',
        description: 'La lectura estructural conecta decisiones, información limitada, inventario y demoras. También permite buscar una intervención con mayor apalancamiento.',
        example: '“Cada pedido extra vacía al proveedor y alarga la espera.”'
    }
];
const lensTabs = [...document.querySelectorAll('.qd-lens-tabs [role="tab"]')];
const lensPanel = document.querySelector('#lens-panel');

function showLens(index) {
    const lens = lenses[index];
    lensTabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
    });
    lensPanel.setAttribute('aria-labelledby', `lens-tab-${index}`);
    document.querySelector('#lens-label').textContent = lens.label;
    document.querySelector('#lens-question').textContent = lens.question;
    document.querySelector('#lens-description').textContent = lens.description;
    document.querySelector('#lens-example').textContent = lens.example;
}

lensTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showLens(index));
    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + lensTabs.length) % lensTabs.length;
        showLens(nextIndex);
        lensTabs[nextIndex].focus();
    });
});

const game = {
    week: 0,
    inventory: 12,
    backlog: 0,
    shipments: [4, 4, 4],
    history: [],
    cost: 0
};
const orderInput = document.querySelector('#order-amount');

function demandForWeek(week) {
    return week <= 2 ? 4 : 8;
}

function setOrderAmount(amount) {
    orderInput.value = String(Math.max(0, Math.min(20, amount)));
    document.querySelector('#order-output').value = orderInput.value;
    document.querySelector('#order-output').textContent = orderInput.value;
}

function renderGameChart() {
    const chart = document.querySelector('#game-chart');
    chart.replaceChildren();
    if (!game.history.length) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'qd-chart-empty';
        emptyMessage.textContent = 'Avanza una semana para comenzar a comparar.';
        chart.append(emptyMessage);
        return;
    }

    const visibleHistory = game.history.slice(-12);
    const maxValue = Math.max(12, ...visibleHistory.flatMap((entry) => [entry.demand, entry.order]));

    visibleHistory.forEach((entry) => {
        const column = document.createElement('div');
        column.className = 'qd-week-column';
        column.setAttribute('aria-label', `Semana ${entry.week}: venta ${entry.demand}, pedido ${entry.order}`);
        const pair = document.createElement('div');
        pair.className = 'qd-bar-pair';

        [
            { value: entry.demand, className: 'qd-bar qd-bar-demand', label: 'Venta' },
            { value: entry.order, className: 'qd-bar qd-bar-order', label: 'Pedido' }
        ].forEach((barData) => {
            const bar = document.createElement('span');
            bar.className = barData.className;
            bar.style.height = `${Math.max(2, (barData.value / maxValue) * 100)}%`;
            bar.title = `${barData.label}: ${barData.value} cajas`;
            pair.append(bar);
        });

        const weekLabel = document.createElement('span');
        weekLabel.className = 'qd-week-label';
        weekLabel.textContent = `S${entry.week}`;
        column.append(pair, weekLabel);
        chart.append(column);
    });
}

function renderGame() {
    document.querySelector('#game-week').textContent = `SEMANA ${String(game.week + 1).padStart(2, '0')}`;
    document.querySelector('#inventory-value').textContent = String(game.inventory);
    document.querySelector('#backlog-value').textContent = String(game.backlog);
    document.querySelector('#pipeline-value').textContent = String(game.shipments.reduce((sum, amount) => sum + amount, 0));
    document.querySelector('#arrival-1').textContent = String(game.shipments[0] ?? 0);
    document.querySelector('#arrival-2').textContent = String(game.shipments[1] ?? 0);
    document.querySelector('#arrival-3').textContent = String(game.shipments[2] ?? 0);
    document.querySelector('#game-cost').textContent = String(game.cost);
    renderGameChart();
}

orderInput.addEventListener('input', () => {
    document.querySelector('#order-output').value = orderInput.value;
    document.querySelector('#order-output').textContent = orderInput.value;
});

document.querySelector('#match-demand').addEventListener('click', () => {
    setOrderAmount(demandForWeek(game.week + 1));
    document.querySelector('#game-feedback').textContent = 'Pedido ajustado a la venta observada. Lo registrado hoy llegará dentro de 3 semanas.';
});

document.querySelector('#chase-shortage').addEventListener('click', () => {
    const projectedPosition = game.inventory + game.shipments.reduce((sum, amount) => sum + amount, 0) - game.backlog;
    const suggestedOrder = demandForWeek(game.week + 1) + Math.max(0, 12 - projectedPosition);
    setOrderAmount(suggestedOrder);
    document.querySelector('#game-feedback').textContent = 'El pedido intenta cubrir la brecha visible. Parte del suministro ya viene en camino, aunque todavía no lo recibes.';
});

document.querySelector('#advance-week').addEventListener('click', () => {
    game.week += 1;
    const demand = demandForWeek(game.week);
    const delivery = game.shipments.shift() ?? 0;
    const available = game.inventory + delivery;
    const totalDemand = demand + game.backlog;
    game.backlog = Math.max(0, totalDemand - available);
    game.inventory = Math.max(0, available - totalDemand);
    const order = Number(orderInput.value);
    game.shipments.push(order);
    game.cost += game.backlog + Math.ceil(game.inventory / 2);
    game.history.push({ week: game.week, demand, order, delivery });

    const feedback = document.querySelector('#game-feedback');
    const insight = document.querySelector('#game-insight');
    if (game.week <= 2) {
        feedback.textContent = `Venta de ${demand} cajas y entrega de ${delivery}. El cambio de demanda todavía no ha llegado.`;
    } else if (game.backlog > 0) {
        feedback.textContent = `Faltan ${game.backlog} cajas por surtir. El pedido de esta semana no se convertirá en entrega hasta dentro de 3 semanas.`;
    } else if (game.inventory > 12) {
        feedback.textContent = `Hay ${game.inventory} cajas en inventario. Revisa si las entregas programadas superan la demanda estable.`;
    } else {
        feedback.textContent = `Venta de ${demand}, entrega de ${delivery} y ${game.inventory} cajas disponibles al cierre.`;
    }

    if (game.week >= 3) {
        insight.textContent = game.history.some((entry) => entry.order > entry.demand * 1.5)
            ? 'Observa los pedidos por encima de la venta: el inventario en tránsito también forma parte de tu decisión.'
            : 'La venta se mantiene en 8 cajas. Considera el inventario y los pedidos en tránsito antes de cambiar la orden.';
    }
    renderGame();
});

document.querySelector('#reset-game').addEventListener('click', () => {
    game.week = 0;
    game.inventory = 12;
    game.backlog = 0;
    game.shipments = [4, 4, 4];
    game.history = [];
    game.cost = 0;
    setOrderAmount(4);
    document.querySelector('#game-feedback').textContent = 'La demanda habitual es de 4 cajas. Observa el cambio antes de ajustar tus pedidos.';
    document.querySelector('#game-insight').textContent = 'Cuando la demanda cambie, recuerda que el pedido de hoy no llega de inmediato.';
    renderGame();
});

showDiscipline(0);
showLens(0);
renderGame();