/* =====================================================================
   PÁGINA: portada (index.html)
   ---------------------------------------------------------------------
   Actualiza la foto de portada, los datos de la edición actual y el
   estado de la inscripción a partir de js/datos/config.js.
   ===================================================================== */

(() => {
  /* ---------- Enlaces antiguos ----------
     La web anterior era una sola página con secciones (#bases, #ganadores…).
     Si alguien llega con uno de esos enlaces, se le lleva a la página nueva. */
  const PAGINAS_ANTIGUAS = {
    inicio: "./",
    ganadores: "ganadores.html",
    bases: "bases.html",
    participar: "participar.html",
    "aviso-legal": "aviso-legal.html",
    privacidad: "privacidad.html",
    cookies: "cookies.html",
  };
  function redirigirEnlaceAntiguo() {
    const destino = PAGINAS_ANTIGUAS[location.hash.slice(1)];
    if (!destino || destino === "./") return false;
    location.replace(destino);
    return true;
  }
  window.addEventListener("hashchange", redirigirEnlaceAntiguo);
  if (redirigirEnlaceAntiguo()) return;

  /* ---------- Foto de portada ---------- */
  function datosPortada() {
    const portada = CONFIG.portada;
    if (portada.img) {
      return { img: portada.img, alt: portada.alt || portada.pie, pie: portada.pie };
    }
    // Sin foto propia: se muestra una de las fotografías premiadas.
    const g =
      GANADORES.find((x) => x.edicion === portada.premiada.edicion && x.autor === portada.premiada.autor) ||
      GANADORES[0];
    return {
      img: g.img,
      alt: `Fotografía de ${g.autor}, premiada en ${g.edicion}`,
      pie: `${g.autor}. ${g.premio}${g.categoria ? ", " + g.categoria : ""}, ${CERTAMENES[g.certamen].corto}, ${g.edicion}.`,
    };
  }

  function mostrarPortada() {
    const { img, alt, pie } = datosPortada();
    const figura = $("#portada");
    const boton = $("button", figura);
    const imagen = $("img", boton);
    boton.dataset.img = img;
    boton.dataset.cap = pie;
    if (imagen.getAttribute("src") !== img) {
      imagen.removeAttribute("width");
      imagen.removeAttribute("height");
      imagen.src = img;
    }
    imagen.alt = alt;
    $("figcaption", figura).textContent = pie;
  }

  /* ---------- Edición actual ---------- */
  function mostrarEdicion() {
    const cartel = $("#cartel");
    if (cartel.getAttribute("src") !== CONFIG.cartel) cartel.src = CONFIG.cartel;
    cartel.alt = CONFIG.cartelAlt;

    $("#edicion-meta").textContent =
      `${CONFIG.numeroEdicion} edición${CONFIG.dedicatoria ? ", " + CONFIG.dedicatoria : ""}.`;

    $("#calendario").replaceChildren(
      ...CONFIG.calendario.map(({ fecha, texto }) => {
        const elemento = clonarPlantilla("tpl-fecha");
        $("strong", elemento).textContent = fecha;
        $("span", elemento).textContent = texto;
        return elemento;
      }),
    );
  }

  /* ---------- Estado de la inscripción ---------- */
  function mostrarEstado() {
    $("#estado-abierta").hidden = !INSCRIPCION.abierta;
    $("#estado-cerrada").hidden = INSCRIPCION.abierta;
  }

  mostrarPortada();
  mostrarEdicion();
  mostrarEstado();
})();
