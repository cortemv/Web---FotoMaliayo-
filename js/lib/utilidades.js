/* =====================================================================
   UTILIDADES COMUNES
   ---------------------------------------------------------------------
   Funciones pequeñas que usan varias páginas. Requiere js/datos/config.js.
   ===================================================================== */

/** Primer elemento que coincide con el selector. */
const $ = (selector, raiz = document) => raiz.querySelector(selector);

/** Todos los elementos que coinciden con el selector, como array. */
const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

/** Fecha en formato largo: «1 de octubre de 2026». */
const formatearFecha = (fecha) =>
  fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

/** Estado de la inscripción de la edición actual, calculado a partir de CONFIG. */
const INSCRIPCION = (() => {
  const fechaLimite = new Date(CONFIG.fechaLimite);
  return {
    fechaLimite,
    abierta: CONFIG.inscripcionAbierta && new Date() <= fechaLimite,
    modoPrueba: !CONFIG.endpoint,
  };
})();

/** Datos que pueden mostrarse en el HTML con el atributo data-config. */
const DATOS_PAGINA = { ...CONFIG, certamenes: CERTAMENES };

/** Lee un valor anidado: leerRuta(objeto, "titular.nombre"). */
const leerRuta = (objeto, ruta) =>
  ruta.split(".").reduce((valor, clave) => (valor == null ? valor : valor[clave]), objeto);

/**
 * Rellena los textos que dependen de la configuración:
 *   <span data-config="edicion">2026</span>      → año de la edición
 *   <span data-config="titular.nombre"></span>  → nombre del responsable
 *   <span data-fecha-limite></span>             → fecha límite formateada
 * Funciona tanto en el documento como en fragmentos clonados de un <template>.
 */
function rellenarConfig(raiz = document) {
  $$("[data-config]", raiz).forEach((el) => {
    const valor = leerRuta(DATOS_PAGINA, el.dataset.config);
    if (valor != null) el.textContent = valor;
  });
  $$("[data-fecha-limite]", raiz).forEach((el) => {
    el.textContent = formatearFecha(INSCRIPCION.fechaLimite);
  });
}

/** Clona el contenido de un <template> por su id. */
const clonarPlantilla = (id) => document.getElementById(id).content.cloneNode(true);
