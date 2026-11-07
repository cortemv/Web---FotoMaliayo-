# Cómo actualizar la web de FotoMaliayo cada año

La web es una carpeta de archivos estáticos (HTML, CSS, JavaScript y Markdown). No hay base de datos ni programas que instalar. Para actualizarla editas unos pocos archivos de texto, compruebas el resultado y subes la carpeta de nuevo.

## Qué hay en la carpeta

| Archivo o carpeta | Qué contiene | ¿Se toca cada año? |
|---|---|---|
| `js/datos/config.js` | Año, cartel, calendario, fechas, categorías, portada y responsable | Sí |
| `js/datos/seleccionados.js` | Las fotografías seleccionadas (ganadores, finalistas…) de todas las ediciones | Sí, se añaden las nuevas |
| `js/datos/galeria.js` | Las fotografías de la galería (de momento vacía) | Cuando se quieran añadir fotos |
| `data/entidades.json` | Logotipos de organizadores y colaboradores | Solo si cambian |
| `data/historia.md` | El texto de la página de historia | Solo si cambia |
| `data/bases.md` | El texto de las bases de la edición actual | Sí |
| `data/aviso-legal.md`, `data/privacidad.md`, `data/cookies.md` | Textos legales | Solo si cambian |
| `img/` | Cartel de cada edición, fotos premiadas (`img/fotos/<año>/`), foto de portada y logotipos | Sí |
| `*.html` | Una página por pantalla: `index.html` (portada), `historia.html`, `bases.html`, `seleccionados.html`, `galeria.html`, `participar.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html` | No (salvo al añadir páginas) |
| `img/decoracion/` | Imagen de fondo de la cabecera (`fondo-cabecera.jpg` y su versión para móvil), trisquel y textura | Solo si cambia el fondo |
| `img/logo-fotomaliayo.png` | Logotipo del banner | Solo si cambia |
| `css/` | Estilos: `variables.css` (colores), `global.css` (común), `componentes/` y `paginas/` | No |
| `js/lib/`, `js/componentes/`, `js/paginas/` | El funcionamiento de la web | No |
| `sitemap.xml`, `robots.txt` | Para los buscadores | Solo al añadir páginas |
| `herramientas/generar-documentos.mjs` | Copia los textos de `data/` dentro de sus páginas | Se ejecuta, no se edita |
| `Code.gs` | El script de Google que recibe las inscripciones | Solo los ajustes del principio |

## Herramienta para editar

Usa un editor de texto, nunca Word. Sirven el Bloc de notas o TextEdit, aunque es más cómodo **Visual Studio Code** o **Notepad++** (gratuitos), porque colorean el texto y se ven mejor los errores.

## Paso a paso

### 1. Cuando termina una edición: añadir los seleccionados

1. Crea la carpeta `img/fotos/2026/` (con el año que corresponda).
2. Reduce cada foto premiada a **1600 píxeles en el lado mayor**, en JPG de calidad 80 aproximadamente (entre 300 y 600 KB). Para la galería conviene también una miniatura de **720 px** terminada en `-mini.jpg`. Puedes hacerlo con:
   - **Squoosh** (squoosh.app), en el navegador, foto a foto.
   - En Windows, **PowerToys Image Resizer**: seleccionas todas las fotos, botón derecho, "Cambiar tamaño de imágenes".
   - En Mac, la app **Vista Previa**: seleccionas todas, Herramientas, "Ajustar tamaño".
3. Pon a las fotos nombres sencillos, sin espacios ni tildes: `etno-categoria-unica-nombre-autor.jpg`.
4. Abre `js/datos/seleccionados.js`, copia una línea existente y cambia sus datos. Por ejemplo:

```
  {"edicion": 2026, "certamen": "etno", "categoria": "", "premio": "Ganador", "autor": "Nombre Apellido", "titulo": "", "img": "img/fotos/2026/etno-categoria-unica-nombre-apellido.jpg", "mini": "img/fotos/2026/etno-categoria-unica-nombre-apellido-mini.jpg", "w": 720, "h": 480},
```

   - `certamen` es `"etno"` o `"paisaje"`.
   - En etno, `"categoria": ""` es la categoría única. Para la especial: `"categoria": "Categoría especial: El hórreo"`.
   - `mini`, `w` y `h` (ancho y alto de la miniatura) son opcionales.
   - Cada línea termina en coma, menos la última de la lista.

La pestaña del año nuevo, los botones de categorías y la galería aparecen solos. Cada categoría tiene su propia dirección para compartirla, por ejemplo `fotomaliayo.es/seleccionados.html#2025-paisaje-montana`.

### 2. Cambiar la foto de portada (opcional)

Copia la foto en `img/fotos/portada/` y cambia en `js/datos/config.js` el apartado `portada`: el archivo (`img`), el pie de foto (`pie`) y la descripción para personas ciegas (`alt`).

### 3. Preparar la nueva edición

En `js/datos/config.js`, apartado "Edición actual":

1. `edicion`: el año nuevo.
2. `numeroEdicion`: en romanos (V, VI, VII…).
3. `dedicatoria`: el homenaje de ese año, o `''` si no hay.
4. `cartel`: copia el cartel nuevo en `img/` (por ejemplo `img/cartel-2027.jpg`, de unos 900 px de ancho) y pon aquí su nombre. Cambia también `cartelAlt`.
5. `resumenPremios` y `calendario`: los textos de ese año.

En el apartado "Inscripción":

6. `fechaLimite`: la nueva fecha. Ojo al final: `+02:00` en horario de verano (de finales de marzo a finales de octubre) y `+01:00` en invierno.
7. `entregaPremios`: día y lugar.

En `CERTAMENES`:

8. `especial`: la categoría especial del año nuevo.
9. Revisa las categorías de paisaje por si cambia alguna.

Si entra un colaborador nuevo, copia su logo en `img/logos/` y añade una línea en `data/entidades.json`. Si alguno deja de colaborar, borra su línea.

**Imagen al compartir en redes.** Las páginas principales indican qué imagen muestran WhatsApp, Facebook, etc. al compartir un enlace (`og:image`, en la cabecera de `index.html`, `seleccionados.html`, `bases.html` y `participar.html`). Si cambias el cartel, busca `cartel-2026.jpg` en esos cuatro archivos y sustitúyelo por el nombre nuevo.

### 4. Actualizar las bases y los textos legales

Los textos están en la carpeta `data/`, en formato **Markdown**, un formato de texto sencillo:

```
# Título de la página
## Título de apartado

Un párrafo es cualquier bloque de texto separado por una línea en blanco.

- Una línea que empieza por guion es un elemento de lista.
1. Una línea que empieza por un número es una lista numerada.

**negrita**   *cursiva*   [texto del enlace](https://direccion.com)

| Premio  | Importe |
| ------- | ------: |
| Ganador | 250 €   |
```

- En las tablas, la segunda fila separa la cabecera; `------:` alinea esa columna a la derecha.
- Para forzar un salto de línea dentro de un párrafo, termina la línea con una barra invertida `\`.
- Los enlaces a otras páginas de la web se escriben con el nombre del archivo: `[aviso legal](aviso-legal.html)`.
- Textos automáticos: `{{año}}` (año de la edición), `{{titular}}`, `{{nif}}`, `{{domicilio}}`, `{{email}}`, `{{numeroEdicion}}` y `{{especial}}` se sustituyen por los valores de `js/datos/config.js`.

En las bases, revisa especialmente la categoría especial, el plazo, la fecha de entrega y las tablas de premios.

#### Copiar los textos dentro de las páginas (para los buscadores)

Cada página de texto (`bases.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html`) lleva dentro una copia del texto ya convertido, para que Google y los demás buscadores lo lean directamente y la página se vea completa aunque falle JavaScript. Después de editar un archivo de `data/` (o los datos del responsable en `config.js`), actualiza esas copias:

1. Necesitas **Node.js** instalado (nodejs.org, versión LTS). Solo la primera vez.
2. Abre una terminal en la carpeta de la web y ejecuta:

```
node herramientas/generar-documentos.mjs
```

Verás la lista de documentos actualizados. No se instala nada más.

Si se te olvida, la web sigue mostrando el texto nuevo a los visitantes (lo lee directamente del `.md` al abrir la página); solo la copia para buscadores se queda con la versión anterior hasta que lo ejecutes.

### 5. Comprobar en tu ordenador

Lo más fiable es verla a través de un pequeño servidor local, igual que quedará publicada:

- Con **Visual Studio Code**: instala la extensión "Live Server", abre la carpeta y pulsa "Go Live".
- O, en una terminal dentro de la carpeta: `python3 -m http.server` y abre `http://localhost:8000` en el navegador.

También puedes abrir `index.html` con doble clic: todo funciona, salvo que el logotipo de la cabecera abre la carpeta en lugar de la portada y los textos de `data/` se ven en la versión copiada en la página (la del paso 4).

Revisa la portada, los seleccionados, la historia, la galería, las bases y el formulario.

**Si una sección sale vacía**, casi siempre es una coma o unas comillas mal puestas en el último archivo `.js` que tocaste. Pulsa F12 en el navegador, ve a la pestaña "Consola" y verás en rojo el archivo y el número de línea del error.

### 6. Formulario de inscripción

Si usáis el formulario, abre el proyecto de Google Apps Script y cambia al principio de `Code.gs` el año (`EDICION`), la fecha límite (`FECHA_LIMITE`), la categoría especial (`ESPECIAL`) y las categorías si han cambiado. Después: Implementar, Gestionar implementaciones, editar (icono del lápiz), Versión: "Nueva versión", Implementar. La dirección no cambia, así que no hay que tocar `endpoint` en `js/datos/config.js`.

Antes de abrir el plazo, haz una inscripción de prueba y comprueba que llegan las fotos a Drive y el correo de confirmación. Después borra la fila de prueba de la hoja de cálculo.

### 7. Publicar

En Netlify: entra en el sitio, pestaña "Deploys", y arrastra la carpeta completa de la web a la zona indicada. En un minuto estará actualizada en fotomaliayo.es.

Guarda siempre una copia de la carpeta anterior antes de hacer cambios. Si algo sale mal, basta con volver a subir la copia.

## Añadir una página nueva

1. Copia una página parecida (por ejemplo `cookies.html` para un texto, o `seleccionados.html` para otra galería) con el nuevo nombre, en minúsculas y sin tildes: `jurado.html`.
2. Cambia en su cabecera el `<title>`, la `<meta name="description">` y la dirección de `<link rel="canonical">`. Cada página debe tener un título y una descripción propios.
3. Si es un texto, crea su archivo en `data/` (por ejemplo `data/jurado.md`), pon esa ruta en el `data-md` del `<article>` y ejecuta `node herramientas/generar-documentos.mjs`.
4. Si necesita estilos propios, crea `css/paginas/jurado.css` y enlázalo en su cabecera; si necesita comportamiento propio, crea `js/paginas/jurado.js`.
5. Añade el enlace en el menú (`<nav>` de la cabecera) o en el pie de **todas** las páginas, según corresponda.
6. Añade un bloque `<url>` en `sitemap.xml` con su dirección completa: `https://fotomaliayo.es/jurado.html`.

## Resumen rápido

| Momento | Archivos |
|---|---|
| Tras la entrega de premios | `img/fotos/<año>/` y `js/datos/seleccionados.js` |
| Al lanzar la nueva edición | `js/datos/config.js`, `img/`, `data/bases.md`, `og:image` si cambia el cartel, y `Code.gs` |
| Tras editar cualquier `.md` de `data/` | Ejecutar `node herramientas/generar-documentos.mjs` |
| Si cambian los colaboradores | `img/logos/` y `data/entidades.json` |
| Si cambia el responsable | apartado `titular` de `js/datos/config.js` y ejecutar la herramienta |
| Si se añade una página | La página, su enlace en el menú o el pie y `sitemap.xml` |
