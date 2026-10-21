/* =====================================================================
   COMPORTAMIENTO COMÚN A TODAS LAS PÁGINAS
   ---------------------------------------------------------------------
   - Rellena los textos marcados con data-config (año, responsable…).
   - Muestra los logotipos de organizadores y colaboradores en el pie.
   Requiere js/datos/config.js, js/datos/entidades.js y js/lib/utilidades.js.
   ===================================================================== */

(() => {
  function crearLogo(entidad) {
    const elemento = document.createElement("li");
    elemento.title = entidad.nombre;
    elemento.style.setProperty("--fondo", entidad.fondo);

    const imagen = document.createElement("img");
    imagen.src = entidad.logo;
    imagen.alt = entidad.nombre;
    imagen.loading = "lazy";

    elemento.append(imagen);
    return elemento;
  }

  function mostrarLogos() {
    $$("ul[data-entidades]").forEach((lista) => {
      const tipo = lista.dataset.entidades;
      lista.replaceChildren(...ENTIDADES.filter((e) => e.tipo === tipo).map(crearLogo));
    });
  }

  rellenarConfig();
  mostrarLogos();
})();
