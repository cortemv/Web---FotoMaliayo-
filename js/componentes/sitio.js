/* =====================================================================
   COMPORTAMIENTO COMÚN A TODAS LAS PÁGINAS
   ---------------------------------------------------------------------
   - Rellena los textos marcados con data-config (año, responsable…).
   - Muestra los logotipos de organizadores y colaboradores en el pie desde el
     JSON, cada uno con su nombre debajo.
   ===================================================================== */

(() => {
  function crearImagen(entidad) {
    const imagen = document.createElement("img");
    imagen.src = entidad.logo;
    imagen.alt = "";
    imagen.loading = "lazy";
    return imagen;
  }

  function crearEnlace(url, contenido) {
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.append(...contenido);
    return enlace;
  }

  /* Ficha: recuadro con el logotipo y, debajo, el nombre de la entidad */
  function crearLogo(entidad) {
    const elemento = document.createElement("li");

    const recuadro = document.createElement("span");
    recuadro.className = "logo-entidad";
    recuadro.style.setProperty("--fondo", entidad.fondo);
    recuadro.append(crearImagen(entidad));

    const nombre = document.createElement("span");
    nombre.className = "nombre-entidad";
    nombre.textContent = entidad.nombre;

    const contenido = [recuadro, nombre];
    if (entidad.url) elemento.append(crearEnlace(entidad.url, contenido));
    else elemento.append(...contenido);

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