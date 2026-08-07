// Click en el icono de la extensión → abre el campus.
// Reemplaza a popup.html, que eran 437 líneas de folleto estático cuyo
// único botón usaba un onclick inline que la CSP de MV3 bloquea.
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://frcon.cvg.utn.edu.ar/' });
});
