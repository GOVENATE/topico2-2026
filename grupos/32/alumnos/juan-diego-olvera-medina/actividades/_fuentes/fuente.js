// Antes de exportar: deja en el titulo si las fuentes de Google ya cargaron
// y el alto real de la pagina (para el tamano de la infografia).
// Si sale "FUENTES:false" no se exporta, porque saldria con la fuente de respaldo.
document.fonts.ready.then(function () {
  var ok = document.fonts.check('16px "Source Serif 4"') && document.fonts.check('700 16px "Archivo"');
  document.title = 'FUENTES:' + ok + '|ALTO:' + Math.ceil(document.documentElement.scrollHeight);
});
