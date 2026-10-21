#!/usr/bin/env node
/* =====================================================================
   GENERAR LOS DOCUMENTOS DENTRO DE LAS PÁGINAS
   ---------------------------------------------------------------------
   Copia el texto de cada archivo .md de /data, ya convertido a HTML,
   dentro del <article data-md="..."> de su página (bases.html,
   aviso-legal.html, privacidad.html, cookies.html…).

   Así el texto forma parte del HTML publicado: los buscadores lo leen
   directamente y la página se ve completa aunque falle JavaScript.

   Uso, desde la carpeta de la web (solo necesita Node.js, sin instalar nada):
       node herramientas/generar-documentos.mjs

   Ejecútalo después de editar un .md o js/datos/config.js y antes de
   publicar. Usa el mismo conversor que la web (js/lib/markdown.js), así
   que el resultado es idéntico al que se ve en el navegador.
   ===================================================================== */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPTS = ["js/datos/config.js", "js/lib/texto.js", "js/lib/markdown.js"];
const RE_ARTICULO = /(<article\b[^>]*\bdata-md="([^"]+)"[^>]*>)[\s\S]*?(<\/article>)/g;

// Carga la configuración y el conversor tal como los carga el navegador.
const contexto = vm.createContext({});
for (const script of SCRIPTS) {
  vm.runInContext(readFileSync(join(RAIZ, script), "utf8"), contexto, { filename: script });
}
const { Markdown, VARIABLES_DOCUMENTOS } = vm.runInContext("({ Markdown, VARIABLES_DOCUMENTOS })", contexto);

let total = 0;
for (const pagina of readdirSync(RAIZ).filter((f) => f.endsWith(".html"))) {
  const ruta = join(RAIZ, pagina);
  const original = readFileSync(ruta, "utf8");
  const generado = original.replace(RE_ARTICULO, (coincidencia, apertura, archivoMd, cierre) => {
    const markdown = readFileSync(join(RAIZ, archivoMd), "utf8");
    total++;
    console.log(`  ${archivoMd}  →  ${pagina}`);
    return `${apertura}\n${Markdown.aHtml(markdown, VARIABLES_DOCUMENTOS)}\n${cierre}`;
  });
  if (generado !== original) writeFileSync(ruta, generado);
}
console.log(total ? `Listo: ${total} documento(s) actualizados.` : "No se ha encontrado ningún <article data-md>.");
