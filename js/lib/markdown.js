/* =====================================================================
   CONVERSOR DE MARKDOWN A HTML
   ---------------------------------------------------------------------
   Convierte los documentos de /data (bases y textos legales) en HTML.
   Requiere js/lib/texto.js. Lo usan el navegador (js/componentes/documento.js)
   y la herramienta herramientas/generar-documentos.mjs, así que no debe
   depender de nada propio del navegador.

   Formato admitido (Markdown estándar):
     # Título  ## Apartado  ### Subapartado
     Párrafos separados por una línea en blanco. Una línea que termina en
     barra invertida (\) o en dos espacios fuerza un salto de línea.
     - Lista con guiones        1. Lista numerada
     > Cita o nota destacada    --- (línea horizontal)
     **negrita**  *cursiva* o _cursiva_  `código`  [enlace](https://…)
     Tablas con | celda | celda |; en la fila separadora, ---: alinea a la
     derecha y :---: al centro.
   Variables: {{año}}, {{titular}}… se sustituyen por los valores de
   VARIABLES_DOCUMENTOS (js/datos/config.js).
   ===================================================================== */

const Markdown = (() => {
  const RE_TITULO = /^(#{1,6})\s+(.*?)\s*#*$/;
  const RE_SEPARADOR = /^(?:-{3,}|\*{3,}|_{3,})$/;
  const RE_LISTA = /^[-*+]\s+(.*)$/;
  const RE_LISTA_NUMERADA = /^(\d+)[.)]\s+(.*)$/;
  const RE_ENLACE_EXTERNO = /^(?:[a-z]+:)?\/\//i;
  const RE_FILA_ALINEACION = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;
  const SALTO_DURO = "\u0001";

  /* ---------- Variables {{nombre}} ---------- */
  const sustituirVariables = (texto, variables = {}) =>
    texto.replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (original, clave) =>
      clave in variables ? String(variables[clave]) : original,
    );

  /* ---------- Formato dentro de una línea ---------- */
  const LETRA = "[\\p{L}\\p{N}_]";
  const enfasis = (html) =>
    html
      .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
      .replace(new RegExp(`(^|[^\\p{L}\\p{N}_])__(?=\\S)([\\s\\S]*?\\S)__(?!${LETRA})`, "gu"), "$1<strong>$2</strong>")
      .replace(/\*(?=\S)([^*]*?\S)\*/g, "<em>$1</em>")
      .replace(new RegExp(`(^|[^\\p{L}\\p{N}_])_(?=\\S)([^_]*?\\S)_(?!${LETRA})`, "gu"), "$1<em>$2</em>");

  function enLinea(texto) {
    // El código y los enlaces se apartan para que su contenido no se altere.
    const apartados = [];
    const apartar = (html) => `\u0000${apartados.push(html) - 1}\u0000`;

    let html = texto
      .replace(/`([^`]+)`/g, (m, codigo) => apartar(`<code>${escaparHtml(codigo)}</code>`))
      .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (m, texto, url, titulo) => {
        const atributos =
          ` href="${escaparHtml(url)}"` +
          (titulo ? ` title="${escaparHtml(titulo)}"` : "") +
          (RE_ENLACE_EXTERNO.test(url) ? ' target="_blank" rel="noopener"' : "");
        return apartar(`<a${atributos}>${enfasis(escaparHtml(texto))}</a>`);
      });

    html = enfasis(escaparHtml(html));
    while (/\u0000\d+\u0000/.test(html)) {
      html = html.replace(/\u0000(\d+)\u0000/g, (m, i) => apartados[i]);
    }
    return html.replace(new RegExp(`${SALTO_DURO}\\n`, "g"), "<br>\n");
  }

  /* ---------- Bloques ---------- */
  const esLista = (l) => RE_LISTA.test(l) || RE_LISTA_NUMERADA.test(l);
  const esInicioDeBloque = (l) =>
    RE_TITULO.test(l) || RE_SEPARADOR.test(l) || l.startsWith(">") || l.startsWith("|") || esLista(l);

  const celdas = (fila) =>
    fila
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  function idUnico(texto, usados) {
    const base = slug(texto) || "apartado";
    let id = base;
    for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
    usados.add(id);
    return id;
  }

  function tabla(filas) {
    const cabecera = celdas(filas[0]);
    let cuerpo = filas.slice(1);
    let alineaciones = [];
    if (cuerpo.length && RE_FILA_ALINEACION.test(cuerpo[0])) {
      alineaciones = celdas(cuerpo[0]).map((c) =>
        c.startsWith(":") && c.endsWith(":") ? "centro" : c.endsWith(":") ? "derecha" : "",
      );
      cuerpo = cuerpo.slice(1);
    }
    const clase = (k) => (alineaciones[k] ? ` class="alinear-${alineaciones[k]}"` : "");
    const fila = (valores, etiqueta) =>
      `<tr>${valores.map((v, k) => `<${etiqueta}${clase(k)}>${enLinea(v)}</${etiqueta}>`).join("")}</tr>`;

    return (
      '<div class="table-scroll" tabindex="0">\n<table>\n' +
      `<thead>${fila(cabecera, "th")}</thead>\n` +
      `<tbody>\n${cuerpo.map((f) => fila(celdas(f), "td")).join("\n")}\n</tbody>\n` +
      "</table>\n</div>"
    );
  }

  function bloques(lineas, idsUsados) {
    const html = [];
    let i = 0;

    while (i < lineas.length) {
      const l = lineas[i].trim();
      let m;

      if (!l) {
        i++;
      } else if ((m = l.match(RE_TITULO))) {
        const nivel = m[1].length;
        html.push(`<h${nivel} id="${idUnico(m[2], idsUsados)}">${enLinea(m[2])}</h${nivel}>`);
        i++;
      } else if (RE_SEPARADOR.test(l)) {
        html.push("<hr>");
        i++;
      } else if (l.startsWith(">")) {
        const cita = [];
        while (i < lineas.length && lineas[i].trim().startsWith(">")) {
          cita.push(lineas[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        html.push(`<blockquote>\n${bloques(cita, idsUsados)}\n</blockquote>`);
      } else if (l.startsWith("|")) {
        const filas = [];
        while (i < lineas.length && lineas[i].trim().startsWith("|")) {
          filas.push(lineas[i].trim());
          i++;
        }
        html.push(tabla(filas));
      } else if (esLista(l)) {
        const numerada = RE_LISTA_NUMERADA.test(l);
        const patron = numerada ? RE_LISTA_NUMERADA : RE_LISTA;
        const inicio = numerada ? parseInt(l, 10) : 1;
        const elementos = [];
        while (i < lineas.length) {
          const t = lineas[i].trim();
          const elemento = t.match(patron);
          if (elemento) elementos.push(elemento[numerada ? 2 : 1]);
          else if (t && !esInicioDeBloque(t)) elementos[elementos.length - 1] += "\n" + t;
          else break;
          i++;
        }
        const etiqueta = numerada ? "ol" : "ul";
        const atributoInicio = numerada && inicio !== 1 ? ` start="${inicio}"` : "";
        html.push(
          `<${etiqueta}${atributoInicio}>\n` +
            elementos.map((e) => `<li>${enLinea(e)}</li>`).join("\n") +
            `\n</${etiqueta}>`,
        );
      } else {
        const parrafo = [];
        while (i < lineas.length && lineas[i].trim() && !(parrafo.length && esInicioDeBloque(lineas[i].trim()))) {
          const linea = lineas[i];
          const saltoDuro = /(\\|\s{2,})$/.test(linea);
          parrafo.push(linea.trim().replace(/\\$/, "") + (saltoDuro ? SALTO_DURO : ""));
          i++;
        }
        const texto = parrafo.join("\n").replace(new RegExp(`${SALTO_DURO}$`), "");
        html.push(`<p>${enLinea(texto)}</p>`);
      }
    }
    return html.join("\n");
  }

  /** Convierte un texto Markdown en HTML, sustituyendo antes las {{variables}}. */
  function aHtml(fuente, variables = {}) {
    const texto = sustituirVariables(String(fuente).replace(/\r\n?/g, "\n"), variables);
    return bloques(texto.split("\n"), new Set());
  }

  return { aHtml };
})();
