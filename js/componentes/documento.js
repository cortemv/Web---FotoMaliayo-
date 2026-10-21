/* =====================================================================
   DOCUMENTOS EN MARKDOWN (bases, aviso legal, privacidad, cookies)
   ---------------------------------------------------------------------
   Cada página de documento tiene un <article data-md="data/archivo.md">
   que ya contiene el texto convertido a HTML, para que los buscadores y
   quien navega sin JavaScript lo vean siempre.
   Este script vuelve a leer el archivo .md y actualiza el artículo, de
   modo que un cambio en el .md se ve en la web aunque todavía no se haya
   ejecutado herramientas/generar-documentos.mjs. Si el archivo no se
   puede leer (por ejemplo, al abrir la página con doble clic), se
   mantiene el texto que ya trae la página.
   Requiere js/datos/config.js, js/lib/texto.js, js/lib/markdown.js y
   js/lib/utilidades.js.
   ===================================================================== */

(() => {
  async function actualizar(articulo) {
    try {
      const respuesta = await fetch(articulo.dataset.md, { cache: "no-cache" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      articulo.innerHTML = Markdown.aHtml(await respuesta.text(), VARIABLES_DOCUMENTOS);
    } catch (error) {
      console.warn(`No se ha podido actualizar ${articulo.dataset.md}; se muestra la versión incluida en la página.`, error);
    }
  }

  $$("article[data-md]").forEach(actualizar);
})();
