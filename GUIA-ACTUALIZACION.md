# Cómo actualizar la web de FotoMaliayo cada año

La web es una carpeta de archivos. No hay base de datos ni programas que instalar. Para actualizarla editas unos pocos archivos de texto, compruebas el resultado en tu ordenador y subes la carpeta de nuevo.

## Qué hay en la carpeta

| Archivo o carpeta | Qué contiene | ¿Se toca cada año? |
|---|---|---|
| `datos.js` | Año, cartel, calendario, fechas, categorías, portada, responsable y logotipos | Sí |
| `ganadores.js` | Los ganadores de todas las ediciones | Sí, se añaden los nuevos |
| `bases.js` | El texto de las bases de la edición actual | Sí |
| `img/` | El cartel de cada edición | Sí, se añade el nuevo |
| `fotos/` | Las fotos premiadas, en una carpeta por año, y la foto de portada | Sí, se añade la carpeta del año |
| `logos/` | Logotipos de organizadores y colaboradores | Solo si cambian |
| `index.html` | El diseño y el funcionamiento de la web | No |
| `Code.gs` | El script de Google que recibe las inscripciones | Solo los ajustes del principio |

## Herramienta para editar

Usa un editor de texto, nunca Word. Sirven el Bloc de notas, aunque es más cómodo **Visual Studio Code** o **Notepad++** (gratuitos), porque colorean el texto y se ven mejor los errores.

## Paso a paso

### 1. Cuando termina una edición: añadir los ganadores

1. Crea la carpeta `fotos/2026/` (con el año que corresponda).
2. Reduce cada foto premiada a **1600 píxeles en el lado mayor**, en JPG de calidad 80 aproximadamente. Cada foto debería quedar entre 300 y 600 KB. Puedes hacerlo con:
   - **Squoosh** (squoosh.app), en el navegador, foto a foto.
   - En Windows, **PowerToys Image Resizer**: seleccionas todas las fotos, botón derecho, "Cambiar tamaño de imágenes".
   - En Mac, la app **Vista Previa**: seleccionas todas, Herramientas, "Ajustar tamaño".
3. Pon a las fotos nombres sencillos, sin espacios ni tildes: `etno-ganador-nombre-autor.jpg`.
4. Abre `ganadores.js`, copia una línea existente y cambia sus datos. Por ejemplo:

```
  {"edicion": 2026, "certamen": "etno", "categoria": "", "premio": "Ganador", "autor": "Nombre Apellido", "titulo": "", "img": "fotos/2026/etno-ganador-nombre-apellido.jpg"},
```

   - `certamen` es `"etno"` o `"paisaje"`.
   - En etno, `"categoria": ""` es la categoría única. Para la especial: `"categoria": "Categoría especial: El hórreo"`.
   - Las líneas de la miniatura (`mini`, `w`, `h`) son opcionales; no hace falta ponerlas.
   - Cada línea termina en coma, menos la última de la lista.

La galería, el botón del año nuevo y los botones de categorías aparecen solos.

### 2. Cambiar la foto de portada (opcional)

Copia la foto en `fotos/portada/` y cambia en `datos.js` el apartado `portada`: el archivo (`img`), el pie de foto (`pie`) y la descripción para personas ciegas (`alt`).

### 3. Preparar la nueva edición

En `datos.js`, apartado "Edición actual":

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

En la lista de logotipos (al final de `datos.js`):

10. Si entra un colaborador nuevo, copia su logo en `logos/` y añade una línea. Si alguno deja de colaborar, borra su línea.

### 4. Actualizar las bases

Abre `bases.js` y edita el texto. Al principio del archivo está explicado el formato: `##` para títulos, `-` para listas, tablas con `|`. Donde pone `{{año}}` aparece automáticamente el año de `datos.js`.

Revisa especialmente: la categoría especial, el plazo, la fecha de entrega y las tablas de premios.

### 5. Comprobar en tu ordenador

Abre `index.html` con doble clic. Se verá en el navegador tal como quedará publicada. Revisa la portada, los ganadores, las bases y el formulario.

**Si una sección sale vacía**, casi siempre es una coma o unas comillas mal puestas en el último archivo que tocaste. Pulsa F12 en el navegador, ve a la pestaña "Consola" y verás en rojo el archivo y el número de línea del error.

### 6. Formulario de inscripción

Si usáis el formulario, abre el proyecto de Google Apps Script y cambia al principio de `Code.gs` el año (`EDICION`), la fecha límite (`FECHA_LIMITE`), la categoría especial (`ESPECIAL`) y las categorías si han cambiado. Después: Implementar, Gestionar implementaciones, editar (icono del lápiz), Versión: "Nueva versión", Implementar. La dirección no cambia, así que no hay que tocar `datos.js`.

Antes de abrir el plazo, haz una inscripción de prueba y comprueba que llegan las fotos a Drive y el correo de confirmación. Después borra la fila de prueba de la hoja de cálculo.

### 7. Publicar

En Netlify: entra en el sitio, pestaña "Deploys", y arrastra la carpeta completa de la web a la zona indicada. En un minuto estará actualizada en fotomaliayo.es.

Guarda siempre una copia de la carpeta anterior antes de hacer cambios. Si algo sale mal, basta con volver a subir la copia.

## Resumen rápido

| Momento | Archivos |
|---|---|
| Tras la entrega de premios | `fotos/<año>/` y `ganadores.js` |
| Al lanzar la nueva edición | `datos.js`, `img/`, `bases.js` y `Code.gs` |
| Si cambian los colaboradores | `logos/` y el final de `datos.js` |
| Si cambia el responsable | apartado `titular` de `datos.js` |
