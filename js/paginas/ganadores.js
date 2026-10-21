/* =====================================================================
   PÁGINA: ganadores de ediciones anteriores (ganadores.html)
   ---------------------------------------------------------------------
   Crea una pestaña por edición y, para la edición elegida, el índice de
   categorías y la galería de obras premiadas, a partir de
   js/datos/ganadores.js. La estructura de cada pieza está en los
   <template> de ganadores.html.
   Se puede enlazar a una edición o categoría concreta:
     ganadores.html#2024   ganadores.html#2025-paisaje-montana
   ===================================================================== */

(() => {
  const ORDINALES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const PRIMERA_EDICION = 2023;
  const CATEGORIA_UNICA = "Categoría única";

  const listaPestanas = $("#pestanas");
  const panel = $("#panel");
  const ediciones = [...new Set(GANADORES.map((g) => g.edicion))].sort((a, b) => b - a);
  let edicionActual;

  /* ---------- Piezas de la galería ---------- */
  const pieDeFoto = (g) =>
    `${g.titulo ? "«" + g.titulo + "», " : ""}${g.autor}. ${g.premio}${g.categoria ? ", " + g.categoria : ""}, ${g.edicion}.`;

  function crearObra(g, nombreCategoria) {
    const figura = clonarPlantilla("tpl-obra").firstElementChild;
    const boton = $("button", figura);

    if (g.img) {
      const imagen = document.createElement("img");
      imagen.src = g.mini || g.img;
      if (g.w) imagen.width = g.w;
      if (g.h) imagen.height = g.h;
      imagen.alt = `Fotografía de ${g.autor}, ${g.premio.toLowerCase()} en ${nombreCategoria} ${g.edicion}`;
      imagen.loading = "lazy";
      boton.dataset.img = g.img;
      boton.dataset.cap = pieDeFoto(g);
      boton.append(imagen);
    } else {
      const hueco = document.createElement("p");
      hueco.className = "frame";
      hueco.textContent = "Fotografía pendiente";
      boton.replaceWith(hueco);
    }

    const premio = $(".prize", figura);
    premio.textContent = g.premio;
    premio.classList.toggle("win", g.premio === "Ganador");

    const titulo = $("cite", figura);
    if (g.titulo) titulo.textContent = g.titulo;
    else titulo.remove();

    $(".author", figura).textContent = g.autor;
    return figura;
  }

  function crearCategoria(id, certamen, nombre, obras) {
    const bloque = clonarPlantilla("tpl-categoria").firstElementChild;
    bloque.id = id;
    bloque.classList.add(certamen);
    $("h3", bloque).textContent = nombre;
    $("h3", bloque).id = `${id}-titulo`;
    bloque.setAttribute("aria-labelledby", `${id}-titulo`);
    $(".gallery", bloque).append(...obras.map((g) => crearObra(g, nombre)));
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
    const obras = GANADORES.filter((g) => g.edicion === edicion);
    const ordinal = ORDINALES[edicion - PRIMERA_EDICION] || "";
    $("#ordinal").textContent = `${ordinal ? ordinal + " edición, " : ""}${edicion}`;

    const enlaces = [];
    const contenido = [];
    for (const certamen of ["etno", "paisaje"]) {
      const delCertamen = obras.filter((g) => g.certamen === certamen);
      if (!delCertamen.length) continue;

      const titulo = clonarPlantilla("tpl-certamen").firstElementChild;
      titulo.textContent = CERTAMENES[certamen].nombre;
      titulo.classList.add(certamen);
      contenido.push(titulo);

      for (const categoria of new Set(delCertamen.map((g) => g.categoria))) {
        const nombre = categoria || CATEGORIA_UNICA;
        const id = `${edicion}-${certamen}-${slug(nombre)}`;
        const textoIndice = certamen === "etno" && !categoria ? CERTAMENES.etno.corto : nombre;
        enlaces.push(crearEnlaceIndice(id, certamen, textoIndice));
        contenido.push(crearCategoria(id, certamen, nombre, delCertamen.filter((g) => g.categoria === categoria)));
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
