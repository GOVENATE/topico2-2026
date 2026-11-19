const archetypes = [
    {
        title: 'Compensación entre proceso y demora', category: 'balance', categoryLabel: 'Equilibrio y demora', tag: 'Demora · Ajuste',
        summary: 'Una corrección llega tarde y provoca nuevas correcciones antes de que se note su efecto.',
        description: 'Una persona, un grupo o una organización adapta su conducta para alcanzar una meta a partir de la realimentación. Si la respuesta del sistema tarda y esa demora pasa inadvertida, se realizan más acciones correctivas de las necesarias o se desiste antes de ver progreso.',
        warning: '“Creíamos que estábamos en equilibrio, pero luego tomamos una medida excesiva”. Después, la corrección puede excederse en sentido contrario.',
        principle: 'En un sistema lento, la agresividad produce inestabilidad. Sé paciente o mejora la capacidad de respuesta del sistema.',
        example: 'Los agentes inmobiliarios siguen construyendo viviendas mientras el mercado tarda en absorber la oferta. Cuando las obras terminan, hay más propiedades en construcción de las que se necesitan.',
        more: 'La temperatura de una ducha que tarda en responder al grifo; ciclos de saturación y escasez en producción e inventario; oscilaciones excesivas en el mercado de valores.',
        pattern: 'Meta → brecha observada → acción correctiva → demora → nuevas condiciones reales.'
    },
    {
        title: 'Límites del crecimiento', category: 'growth', categoryLabel: 'Crecimiento y límites', tag: 'Crecimiento · Freno',
        summary: 'Un ciclo de crecimiento se encuentra con un factor que lo frena.',
        description: 'Un proceso reforzador impulsa un crecimiento acelerado, hasta que aparece una condición limitativa. Un proceso compensador desacelera el avance y puede detenerlo o revertirlo. El límite puede ser un recurso escaso o una reacción interna o externa al crecimiento.',
        warning: '“¿Por qué preocuparnos por problemas que no tenemos? Estamos creciendo muchísimo”. Más tarde: “Cuanto más corremos, más permanecemos en el mismo lugar”.',
        principle: 'No presiones el proceso reforzador: identifica y elimina, o debilita, el factor limitativo.',
        example: 'Una empresa incorpora personas calificadas a sus equipos y gana respaldo al principio. Cuando aumenta la resistencia interna, presionar aún más a los equipos para aceptar nuevos integrantes intensifica el rechazo.',
        more: 'Una nueva destreza que deja de mejorar con la práctica habitual; una firma que necesita capacidades administrativas al crecer; una ciudad que agota suelo disponible; una población animal que supera sus pasturas.',
        pattern: 'Acción creciente → resultados → condición limitativa → acción decreciente.'
    },
    {
        title: 'Desplazamiento de la carga', category: 'dependency', categoryLabel: 'Soluciones y dependencia', tag: 'Parche · Capacidad',
        summary: 'La solución sintomática desplaza a la fundamental y debilita la capacidad de resolver.',
        description: 'Se aplica una solución de corto plazo que produce alivio inmediato. Al depender cada vez más de ella, se invierte menos en la solución fundamental; con el tiempo, las aptitudes para resolver la causa se atrofian y aumenta la dependencia del parche.',
        warning: '“¡Esta solución ha funcionado hasta ahora! ¿Quién dice que nos esperan problemas?”.',
        principle: 'Concéntrate en la solución fundamental. Si el alivio sintomático es imprescindible, úsalo para ganar tiempo mientras trabajas en la solución de fondo.',
        example: 'Una nueva tecnología puede crear productos innovadores o simplemente sustituir componentes existentes. La presión por vender rápido favorece la sustitución; la tecnología no desarrolla una clientela propia y queda atrapada en márgenes bajos.',
        more: 'Pedir préstamos para pagar otras deudas; vender más a clientes existentes en vez de ampliar la clientela; aliviar el estrés sin reducir la carga laboral; cualquier adicción.',
        pattern: 'Síntoma → solución rápida; solución fundamental → capacidad de resolver a largo plazo.'
    },
    {
        title: 'Desplazamiento de la carga hacia la intervención', category: 'dependency', categoryLabel: 'Soluciones y dependencia', tag: 'Ayuda externa · Autonomía',
        summary: 'La intervención alivia el problema, pero puede restar autonomía al sistema.',
        description: 'Es un caso especial de desplazamiento de la carga: una intervención externa alivia tan eficazmente los síntomas que las personas del sistema dejan de aprender a afrontar la causa por sí mismas.',
        warning: 'La ayuda resuelve la crisis de hoy, pero cada nueva dificultad requiere volver a llamar a quien intervino.',
        principle: '“Enseña a la gente a pescar”. Fortalece las capacidades internas. Si hace falta ayuda externa, delimítala desde el inicio o úsala para desarrollar recursos e infraestructura propios.',
        example: 'Filiales locales de una aseguradora recurrieron al personal central para reorganizar sus tarifas durante una crisis. Años después, habían perdido la confianza y la capacidad de manejar por sí mismas ese proceso.',
        more: 'Dependencia de contratistas en lugar de equipos internos; programas de ayuda que no desarrollan capacidades; apoyos que, sin diseño de salida, perpetúan la necesidad de asistencia.',
        pattern: 'Intervención externa → alivio del síntoma; menor práctica → menor capacidad interna.'
    },
    {
        title: 'Erosión de metas', category: 'dependency', categoryLabel: 'Soluciones y dependencia', tag: 'Estándares · Metas',
        summary: 'Se reduce la meta para cerrar la brecha sin mejorar el desempeño real.',
        description: 'Es una estructura de desplazamiento de la carga: la solución de corto plazo consiste en deteriorar una meta de largo plazo. Al bajar el estándar, la brecha parece menor, pero la condición real no mejora.',
        warning: '“No importa que nuestras pautas de desempeño se deterioren un poco, sólo hasta que termine la crisis”.',
        principle: 'Sostén la visión y protege los estándares de largo plazo; trabaja sobre las condiciones que impiden alcanzarlos.',
        example: 'Una fábrica extiende repetidamente el plazo prometido de entrega cada vez que sufre retrasos. Aunque mantiene un alto porcentaje de entregas a tiempo, el plazo cada vez más largo insatisface a sus clientes.',
        more: 'Reducir metas personales ante dificultades; recortar calidad para ajustarse al presupuesto; rebajar objetivos de empleo, déficit o protección ambiental.',
        pattern: 'Brecha entre meta y condición → presión para ajustar la meta o mejorar la condición.'
    },
    {
        title: 'Escalada', category: 'competition', categoryLabel: 'Competencia y recursos', tag: 'Competencia · Espiral',
        summary: 'Cada parte responde a la otra intensificando una competencia que perjudica a ambas.',
        description: 'Dos personas u organizaciones creen que su bienestar depende de aventajar a la otra. Cuando una se adelanta, la otra se siente amenazada y responde con más agresividad; la primera interpreta esa defensa como una nueva amenaza y escala de nuevo.',
        warning: '“Si nuestro oponente se aplacara, podríamos dejar de librar esta batalla para hacer otras cosas”.',
        principle: 'Busca una forma de que ambas partes alcancen sus objetivos. Un acto unilateral de cooperación puede reducir la amenaza percibida y revertir la espiral.',
        example: 'Dos fabricantes de cochecitos compiten por participación de mercado. Cada uno responde a las rebajas de precio del otro hasta que las ganancias de ambos quedan comprometidas.',
        more: 'Guerras publicitarias, disputas legales, conflictos entre grupos, estimaciones presupuestarias infladas y carreras armamentistas.',
        pattern: 'Ventaja relativa de A → reacción de B → nueva reacción de A → escalada.'
    },
    {
        title: 'Éxito para quien tiene éxito', category: 'competition', categoryLabel: 'Competencia y recursos', tag: 'Asignación · Desigualdad',
        summary: 'Dos actividades compiten por recursos; la que empieza mejor recibe cada vez más.',
        description: 'Dos actividades compiten por recursos limitados. La que obtiene mejores resultados recibe más respaldo, lo que aumenta sus posibilidades de éxito y deja a la otra con menos recursos, aunque ambas tuvieran potencial comparable.',
        warning: 'Una actividad, grupo o persona comienza a prosperar mientras el otro apenas subsiste.',
        principle: 'Define una meta de logro equilibrado. Si la competencia por el mismo recurso no es necesaria, debilita o rompe ese vínculo.',
        example: 'Un gerente favorece a uno de dos colaboradores cuando el otro falta. El primero recibe más oportunidades y prospera; el segundo pierde confianza y oportunidades hasta abandonar la empresa.',
        more: 'Desequilibrio entre trabajo y vida familiar; productos que compiten por inversión; estudiantes que reciben menos apoyo tras un comienzo difícil.',
        pattern: 'Éxito → más recursos → más oportunidades → mayor éxito.'
    },
    {
        title: 'Tragedia del terreno común', category: 'competition', categoryLabel: 'Competencia y recursos', tag: 'Bien común · Capacidad',
        summary: 'El uso individual de un recurso compartido erosiona el beneficio colectivo.',
        description: 'Varias personas o grupos aprovechan un recurso común pero limitado atendiendo a su beneficio inmediato. Cuando las ganancias disminuyen, intensifican sus esfuerzos; al final, agotan o deterioran el recurso que comparten.',
        warning: '“Había en abundancia para todos. Ahora las cosas están difíciles. Si deseo sacar provecho este año, tendré que trabajar más”.',
        principle: 'Administra el recurso común: informa a quienes lo usan, acuerda reglas de autorregulación y crea mecanismos de seguimiento, idealmente diseñados por los propios participantes.',
        example: 'Varias divisiones comparten una fuerza de ventas. Cada una infla sus objetivos para recibir atención; la sobrecarga deteriora el servicio y obliga a reconstruir equipos separados.',
        more: 'Saturar un equipo compartido de apoyo, erosionar la reputación de una empresa con ofertas rivales y agotar recursos naturales o capacidad ambiental.',
        pattern: 'Actividad individual → beneficio individual; actividad total → límite del recurso común.'
    },
    {
        title: 'Soluciones rápidas que fallan', category: 'dependency', categoryLabel: 'Soluciones y dependencia', tag: 'Corto plazo · Efectos laterales',
        summary: 'Un remedio inmediato genera consecuencias que exigen más del mismo remedio.',
        description: 'Una solución eficaz a corto plazo produce consecuencias imprevistas a largo plazo. Estas empeoran el problema original y crean presión para aplicar de nuevo la misma solución.',
        warning: '“Siempre funcionó antes. ¿Por qué no funciona ahora?”.',
        principle: 'No descuides el largo plazo. Evita las soluciones cortoplacistas o úsalas sólo para ganar tiempo mientras construyes un remedio duradero.',
        example: 'Una empresa posterga la compra de maquinaria para reducir gastos. La calidad cae, la demanda disminuye y las menores ganancias hacen todavía menos probable la inversión que podría resolver el problema.',
        more: 'Pedir préstamos para pagar intereses de otras deudas y reducir el mantenimiento hasta provocar fallas y costos mayores.',
        pattern: 'Problema → solución rápida → consecuencias no buscadas (con demora) → problema mayor.'
    },
    {
        title: 'Crecimiento y subinversión', category: 'growth', categoryLabel: 'Crecimiento y límites', tag: 'Capacidad · Inversión',
        summary: 'La demanda crece más rápido que la capacidad que se necesita para atenderla.',
        description: 'El crecimiento puede continuar si se invierte a tiempo en capacidad adicional. Si la inversión no es intensa y rápida, el desempeño cae; a menudo se rebajan las metas para justificar la falta de inversión, lo que crea expectativas aún menores y confirma el deterioro.',
        warning: '“Éramos los mejores y lo seremos de nuevo, pero ahora tenemos que conservar los recursos y no invertir en exceso”.',
        principle: 'Si el potencial de crecimiento es genuino, construye capacidad anticipándote a la demanda. Sostén la visión y los estándares de desempeño.',
        example: 'People Express Airlines no amplió a tiempo la capacidad de servicio para seguir el ritmo de la demanda. La calidad cayó, aumentó la competencia y los clientes dejaron de volar con la compañía.',
        more: 'Empresas que atribuyen la caída de calidad a la competencia en vez de invertir; personas con visiones ambiciosas que no calculan el esfuerzo necesario.',
        pattern: 'Demanda → desempeño → necesidad de invertir → inversión en capacidad → desempeño.'
    }
];

const archetypeList = document.querySelector('#archetype-list');
const searchInput = document.querySelector('#archetype-search');
const filterSelect = document.querySelector('#archetype-filter');
const detailPanel = document.querySelector('#detail-panel');
const emptyState = document.querySelector('#empty-state');
let selectedIndex = 0;

function getVisibleIndexes() {
    const query = searchInput.value.trim().toLocaleLowerCase('es');
    const category = filterSelect.value;

    return archetypes.reduce((indexes, archetype, index) => {
        const searchableText = `${archetype.title} ${archetype.summary} ${archetype.tag} ${archetype.description} ${archetype.more}`.toLocaleLowerCase('es');
        if ((!query || searchableText.includes(query)) && (category === 'all' || archetype.category === category)) {
            indexes.push(index);
        }
        return indexes;
    }, []);
}

function renderDetail(index) {
    const archetype = archetypes[index];
    selectedIndex = index;
    document.querySelector('#detail-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(archetypes.length).padStart(2, '0')}`;
    document.querySelector('#detail-category').textContent = archetype.categoryLabel;
    document.querySelector('#detail-title').textContent = archetype.title;
    document.querySelector('#detail-description').textContent = archetype.description;
    document.querySelector('#detail-warning').textContent = archetype.warning;
    document.querySelector('#detail-principle').textContent = archetype.principle;
    document.querySelector('#detail-example').textContent = archetype.example;
    document.querySelector('#detail-more').textContent = archetype.more;
    document.querySelector('#detail-pattern').textContent = `Estructura: ${archetype.pattern}`;
    detailPanel.hidden = false;
}

function renderList() {
    const visibleIndexes = getVisibleIndexes();
    archetypeList.replaceChildren();
    emptyState.hidden = visibleIndexes.length > 0;
    detailPanel.hidden = visibleIndexes.length === 0;

    if (visibleIndexes.length && !visibleIndexes.includes(selectedIndex)) {
        selectedIndex = visibleIndexes[0];
        renderDetail(selectedIndex);
    }

    visibleIndexes.forEach((index) => {
        const archetype = archetypes[index];
        const button = document.createElement('button');
        button.className = 'archetype-option';
        button.type = 'button';
        button.setAttribute('aria-pressed', String(index === selectedIndex));
        button.innerHTML = `<span class="option-number">${String(index + 1).padStart(2, '0')}</span><span class="option-title">${archetype.title}</span><span class="option-arrow" aria-hidden="true">↗</span>`;
        button.addEventListener('click', () => {
            renderDetail(index);
            renderList();
        });
        archetypeList.append(button);
    });
}

function moveWithinResults(direction) {
    const visibleIndexes = getVisibleIndexes();
    if (!visibleIndexes.length) return;
    const currentPosition = visibleIndexes.indexOf(selectedIndex);
    const nextPosition = (currentPosition + direction + visibleIndexes.length) % visibleIndexes.length;
    renderDetail(visibleIndexes[nextPosition]);
    renderList();
}

searchInput.addEventListener('input', renderList);
filterSelect.addEventListener('change', renderList);
document.querySelector('#detail-previous').addEventListener('click', () => moveWithinResults(-1));
document.querySelector('#detail-next').addEventListener('click', () => moveWithinResults(1));

const steps = [
    { copy: 'Compara las condiciones actuales con lo que se desea alcanzar.', node: '.node-conditions', path: '.path-observe' },
    { copy: 'La brecha percibida impulsa una acción correctiva para cambiar el sistema.', node: '.node-action', path: '.path-observe' },
    { copy: 'La acción tarda en producir efecto: esa demora puede llevar a corregir de más.', node: '.node-conditions', path: '.path-effect', delay: true }
];
let currentStep = 0;

function renderStep() {
    const step = steps[currentStep];
    document.querySelector('#step-number').textContent = String(currentStep + 1).padStart(2, '0');
    document.querySelector('#step-copy').textContent = step.copy;
    document.querySelector('#step-progress-fill').style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    document.querySelectorAll('.diagram-node, .causal-path, .delay-marker').forEach((element) => element.classList.remove('is-active'));
    document.querySelector(step.node).classList.add('is-active');
    document.querySelector(step.path).classList.add('is-active');
    document.querySelector('.delay-marker').classList.toggle('is-active', Boolean(step.delay));
}

document.querySelector('#previous-step').addEventListener('click', () => {
    currentStep = (currentStep - 1 + steps.length) % steps.length;
    renderStep();
});
document.querySelector('#next-step').addEventListener('click', () => {
    currentStep = (currentStep + 1) % steps.length;
    renderStep();
});

const scenarios = {
    housing: 'Mientras las nuevas viviendas están en obra, el mercado cambia. Cuando terminan, puede haber más oferta de la necesaria.',
    shower: 'Giras el grifo y el agua tarda en cambiar de temperatura. Si sigues ajustándolo antes de notar el primer cambio, terminará demasiado caliente o fría.',
    inventory: 'La fábrica aumenta o reduce la producción según el inventario visible, pero los ciclos largos de manufactura hacen que cada ajuste llegue tarde.'
};

document.querySelector('#scenario-select').addEventListener('change', (event) => {
    document.querySelector('#scenario-copy').textContent = scenarios[event.target.value];
});

renderDetail(selectedIndex);
renderList();
renderStep();