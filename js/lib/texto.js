/* =====================================================================
   UTILIDADES DE TEXTO
   ---------------------------------------------------------------------
   Sin dependencias del navegador: las usa también la herramienta
   herramientas/generar-documentos.mjs.
   ===================================================================== */

const ESCAPES_HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapa un texto para insertarlo en HTML de forma segura. */
const escaparHtml = (texto) => String(texto ?? "").replace(/[&<>"']/g, (c) => ESCAPES_HTML[c]);

/** Convierte un texto en un identificador para URL: «Accésit Villaviciosa» → «accesit-villaviciosa». */
const slug = (texto) =>
  String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
