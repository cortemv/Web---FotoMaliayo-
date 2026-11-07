/* =====================================================================
   PÁGINA: fotografías seleccionadas de cada edición (seleccionados.html)
   ---------------------------------------------------------------------
   Crea una pestaña por edición y, para la edición elegida, el índice de
   categorías y la galería de obras seleccionadas, a partir de
   js/datos/seleccionados.js. La estructura de cada pieza está en los
   <template> de seleccionados.html.
   Se puede enlazar a una edición o categoría concreta:
     seleccionados.html#2024   seleccionados.html#2025-paisaje-montana
   ===================================================================== */

(() => {
  const ORDINALES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const CATEGORIA_UNICA = "Categoría única";

  const listaPestanas = $("#pestanas");
  const panel = $("#panel");
  const ediciones = [...new Set(SELECCIONADOS.map((s) => s.edicion))].sort((a, b) => b - a);
  let edicionActual;

  /* ---------- Piezas de la galería ---------- */
  const pieDeFoto = (s) =>
    `${s.titulo ? "«" + s.titulo + "», " : ""}${s.autor}. ${s.premio}${s.categoria ? ", " + s.categoria : ""}, ${s.edicion}.`;

  function crearObra(s, nombreCategoria) {
    const figura = clonarPlantilla("tpl-obra").firstElementChild;
    const boton = $("button", figura);

    if (s.img) {
      const imagen = document.createElement("img");
      imagen.src = s.mini || s.img;
      if (s.w) imagen.width = s.w;
      if (s.h) imagen.height = s.h;
      imagen.alt = `Fotografía de ${s.autor}, ${s.premio.toLowerCase()} en ${nombreCategoria} ${s.edicion}`;
      imagen.loading = "lazy";
      boton.dataset.img = s.img;
      boton.dataset.cap = pieDeFoto(s);
      boton.append(imagen);
    } else {
      const hueco = document.createElement("p");
      hueco.className = "frame";
      hueco.textContent = "Fotografía pendiente";
      boton.replaceWith(hueco);
    }

    const premio = $(".prize", figura);
    premio.textContent = s.premio;
    premio.classList.toggle("win", s.premio === "Ganador");

    const titulo = $("cite", figura);
    if (s.titulo) titulo.textContent = s.titulo;
    else titulo.remove();

    $(".author", figura).textContent = s.autor;
    return figura;
  }

  function crearCategoria(id, certamen, nombre, obras) {
    const bloque = clonarPlantilla("tpl-categoria").firstElementChild;
    bloque.id = id;
    bloque.classList.add(certamen);
    $("h3", bloque).textContent = nombre;
    $("h3", bloque).id = `${id}-titulo`;
    bloque.setAttribute("aria-labelledby", `${id}-titulo`);
    $(".gallery", bloque).append(...obras.map((s) => crearObra(s, nombre)));
    return bloque;
  }

  function crearEnlaceIndice(id, certamen, texto) {
    const enlace = clonarPlantilla("tpl-enlace-categoria").firstElementChild;
    enlace.href = `#${id}`;
    enlace.classList.add(certamen);
    enlace.textContent = texto;
    return enlace;
  }

  /* ---------- Una edición ---------- */
  function mostrarEdicion(edicion) {
    const obras = SELECCIONADOS.filter((s) => s.edicion === edicion);
    const ordinal = ORDINALES[edicion - CONFIG.primeraEdicion] || "";
    $("#ordinal").textContent = `${ordinal ? ordinal + " edición, " : ""}${edicion}`;

    const enlaces = [];
    const contenido = [];
    for (const certamen of ["etno", "paisaje"]) {
      const delCertamen = obras.filter((s) => s.certamen === certamen);
      if (!delCertamen.length) continue;

      const titulo = clonarPlantilla("tpl-certamen").firstElementChild;
      titulo.textContent = CERTAMENES[certamen].nombre;
      titulo.classList.add(certamen);
      contenido.push(titulo);

      for (const categoria of new Set(delCertamen.map((s) => s.categoria))) {
        const nombre = categoria || CATEGORIA_UNICA;
        const id = `${edicion}-${certamen}-${slug(nombre)}`;
        const textoIndice = certamen === "etno" && !categoria ? CERTAMENES.etno.corto : nombre;
        enlaces.push(crearEnlaceIndice(id, certamen, textoIndice));
        contenido.push(crearCategoria(id, certamen, nombre, delCertamen.filter((s) => s.categoria === categoria)));
      }
    }

    const indice = $("#indice-categorias");
    indice.setAttribute("aria-label", `Categorías de ${edicion}`);
    indice.replaceChildren(...enlaces);
    $("#galerias").replaceChildren(...contenido);
  }

  /* ---------- Pestañas (patrón ARIA «tabs», con teclado) ---------- */
  function seleccionar(edicion, conFoco = false) {
    edicionActual = edicion;
    $$('[role="tab"]', listaPestanas).forEach((pestana) => {
      const activa = Number(pestana.dataset.edicion) === edicion;
      pestana.setAttribute("aria-selected", String(activa));
      pestana.tabIndex = activa ? 0 : -1;
      if (activa && conFoco) pestana.focus();
    });
    panel.setAttribute("aria-labelledby", `pestana-${edicion}`);
    mostrarEdicion(edicion);
  }

  function crearPestanas() {
    listaPestanas.replaceChildren(
      ...ediciones.map((edicion) => {
        const pestana = clonarPlantilla("tpl-pestana").firstElementChild;
        pestana.id = `pestana-${edicion}`;
        pestana.dataset.edicion = edicion;
        pestana.textContent = edicion;
        return pestana;
      }),
    );

    listaPestanas.addEventListener("click", (evento) => {
      const pestana = evento.target.closest('[role="tab"]');
      if (pestana) seleccionar(Number(pestana.dataset.edicion));
    });

    listaPestanas.addEventListener("keydown", (evento) => {
      const actual = ediciones.indexOf(Number(evento.target.dataset.edicion));
      const ultima = ediciones.length - 1;
      const nueva = {
        ArrowRight: actual === ultima ? 0 : actual + 1,
        ArrowLeft: actual === 0 ? ultima : actual - 1,
        Home: 0,
        End: ultima,
      }[evento.key];
      if (nueva === undefined || actual < 0) return;
      evento.preventDefault();
      seleccionar(ediciones[nueva], true);
    });
  }

  /* ---------- Enlaces a una edición o categoría (#2024, #2025-paisaje-montana) ---------- */
  function irAlEnlace() {
    const destino = decodeURIComponent(location.hash.slice(1));
    const edicion = parseInt(destino, 10);
    if (ediciones.includes(edicion) && edicion !== edicionActual) {
      seleccionar(edicion);
      document.getElementById(destino)?.scrollIntoView();
    }
  }

  /* ---------- Arranque ---------- */
  crearPestanas();
  irAlEnlace();
  if (edicionActual === undefined) seleccionar(ediciones[0]);
  window.addEventListener("hashchange", irAlEnlace);
})();
