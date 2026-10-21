/* =====================================================================
   COMPORTAMIENTO COMÚN A TODAS LAS PÁGINAS
   ---------------------------------------------------------------------
   - Rellena los textos marcados con data-config (año, responsable…).
   - Muestra los logotipos de organizadores y colaboradores en el pie desde el JSON.
   ===================================================================== */

(() => {
  function crearImagen(entidad) {
    const imagen = document.createElement("img");
    imagen.src = entidad.logo;
    imagen.alt = entidad.nombre;
    imagen.loading = "lazy";
    return imagen;
  }

  function crearEnlace(url, imagen) {
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.append(imagen);
    return enlace;
  }

  function crearLogo(entidad) {
    const elemento = document.createElement("li");
    elemento.title = entidad.nombre;
    elemento.style.setProperty("--fondo", entidad.fondo);

    const imagen = crearImagen(entidad);
    elemento.append(entidad.url ? crearEnlace(entidad.url, imagen) : imagen);

    return elemento;
  }

  async function mostrarLogos() {
    try {
      const respuesta = await fetch("data/entidades.json");
      const datos = await respuesta.json();

      const mapa = {
        org: datos.organizan,
        col: datos.colaboran,
      };

      $$("ul[data-entidades]").forEach((lista) => {
        const tipo = lista.dataset.entidades;
        const entidadesLista = mapa[tipo] || [];
        lista.replaceChildren(...entidadesLista.map(crearLogo));
      });
    } catch (error) {
      console.error("Error al cargar data/entidades.json:", error);
    }
  }

  rellenarConfig();
  mostrarLogos();
})();