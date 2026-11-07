/* =====================================================================
   PÁGINA: historia del concurso (historia.html)
   ---------------------------------------------------------------------
   Crea la línea del tiempo con una entrada por edición, desde la
   primera (CONFIG.primeraEdicion) hasta la actual (CONFIG.edicion).
   El número de fotografías seleccionadas de cada año se cuenta en
   js/datos/seleccionados.js, así que no hay que escribirlo a mano.
   La estructura de cada entrada está en el <template> de historia.html.
   ===================================================================== */

(() => {
  const ORDINALES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  function textoEdicion(edicion) {
    const obras = SELECCIONADOS.filter((s) => s.edicion === edicion);
    if (edicion === CONFIG.edicion) {
      return `Edición en curso${CONFIG.dedicatoria ? ", " + CONFIG.dedicatoria : ""}.`;
    }
    if (!obras.length) return "Fotografías seleccionadas pendientes de publicar.";
    const categorias = new Set(obras.map((s) => `${s.certamen}-${s.categoria}`)).size;
    return `${obras.length} fotografías seleccionadas en ${categorias} categorías.`;
  }

  function crearEntrada(edicion) {
    const elemento = clonarPlantilla("tpl-edicion").firstElementChild;
    const ordinal = ORDINALES[edicion - CONFIG.primeraEdicion] || "";
    $("strong", elemento).textContent = `${ordinal ? ordinal + " edición · " : ""}${edicion}`;
    $("p", elemento).textContent = textoEdicion(edicion);

    const enlace = $("a", elemento);
    if (SELECCIONADOS.some((s) => s.edicion === edicion)) {
      enlace.href = `seleccionados.html#${edicion}`;
    } else if (edicion === CONFIG.edicion) {
      enlace.href = "bases.html";
      enlace.textContent = "Leer las bases";
    } else {
      enlace.remove();
    }

    elemento.classList.toggle("actual", edicion === CONFIG.edicion);
    return elemento;
  }

  function mostrarEdiciones() {
    const ediciones = [];
    for (let edicion = CONFIG.edicion; edicion >= CONFIG.primeraEdicion; edicion--) ediciones.push(edicion);
    $("#lista-ediciones").replaceChildren(...ediciones.map(crearEntrada));
  }

  mostrarEdiciones();
})();
