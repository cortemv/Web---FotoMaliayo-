/* =====================================================================
   BASES DE LA EDICIÓN ACTUAL
   ---------------------------------------------------------------------
   Edita el texto que hay entre las dos comillas invertidas (`).
   Formato sencillo:
     ## Título de apartado
     Un párrafo es cualquier bloque de texto separado por una línea en blanco.
     - Una línea que empieza por guion es un elemento de lista.
     **negrita**   *cursiva*   [texto del enlace](https://direccion.com)
     Tablas: | celda | celda |  (la segunda fila, con guiones, separa la cabecera)
   Automáticos: {{año}} pone el año de la edición y {{titular}} el nombre
   del responsable (ambos se cambian en datos.js).
   No uses la comilla invertida (`) dentro del texto.
   ===================================================================== */

const BASES = `
# Bases de la edición {{año}}

FotoMaliayo {{año}}: IV Certamen rexonal de semeyes etnográfiques d'Asturies e IV Concurso de fotografía paisajística de Villaviciosa.

## 1. Organización

El concurso lo organizan el Grupo de Montaña Llamaello, el Ayuntamiento de Villaviciosa y Rodiles Surf Llar, con la colaboración de las entidades que figuran en el cartel. El responsable del concurso y del tratamiento de los datos de los participantes es {{titular}} (datos de contacto en el [aviso legal](#aviso-legal)).

## 2. Participantes

Puede participar cualquier persona aficionada o profesional de la fotografía, de España o de fuera, que sea mayor de 18 años. Las personas menores de edad pueden participar con la autorización de su padre, madre o tutor legal, que deberá enviarse a la organización antes de que finalice el plazo.

Los miembros del jurado y sus familiares directos no pueden participar.

## 3. Certámenes y categorías

**Certamen rexonal de semeyes etnográfiques d'Asturies.** Categoría única, más una categoría especial cada edición (en {{año}}, «El hórreo»). Se buscan las mejores fotografías que representen los usos y tradiciones de Asturias, y se valora tanto la calidad técnica como el valor documental.

**Concurso de fotografía paisajística «Villaviciosa de Asturies».** Categorías:

- Montaña, media montaña, bosques y ríos.
- Deportes en el mediu natural.
- Accésit Carreres por montaña en Asturies: deportistas corriendo por el monte, la costa o similares, en prueba deportiva o en sesión libre. No se admiten cross ni carreras en asfalto. Ámbito de Asturias y zonas limítrofes, como la vertiente sur de la Cordillera Cantábrica.
- La mar d'Asturies y su franja costera.
- Accésit Villaviciosa: temática libre, siempre que la fotografía esté tomada dentro del concejo.
- Socios LlamaEllo: imágenes de cualquier actividad del socio, no solo con el club. Los socios deben indicarlo expresamente.

En todas las categorías de paisaje el jurado valorará que el paisaje sea predominantemente natural. Se admite algún elemento humano por motivos compositivos, de escala o por su valor histórico o artístico. El jurado podrá cambiar una fotografía de categoría si con ello gana valor.

## 4. Requisitos de las fotografías

- Formato JPG sin compresión adicional, de al menos 1920 píxeles en el lado mayor y un máximo de 20 MB por archivo.
- Sin marcos, bordes, firmas ni marcas de agua.
- Se admiten imágenes en blanco y negro o escala de grises.
- No se admiten imágenes creadas o modificadas sustancialmente con inteligencia artificial, ni montajes o ediciones que desvirtúen la fotografía original. La organización podrá pedir el archivo RAW o el original de cualquier fotografía.
- No hay límite de antigüedad, pero la fotografía debe ser obra del participante.
- Máximo de 3 fotografías al Certamen de semeyes etnográfiques y de 5 al Concurso de fotografía paisajística.

## 5. Inscripción

La participación se realiza mediante el [formulario de inscripción](#participar) de esta web, indicando para cada fotografía el título, una breve descripción y la categoría. Se recomienda contar en la descripción la técnica empleada y la historia de la imagen: ayuda al jurado a interpretarla.

La participación es gratuita. El contacto con los participantes se hará por correo electrónico o por teléfono, incluido WhatsApp.

## 6. Plazo

El plazo de admisión termina el 1 de octubre de {{año}} a las 23:59 (hora peninsular española).

## 7. Jurado

El jurado está formado por personas de reconocida experiencia en los temas a evaluar. Recibe las fotografías de forma anónima, identificadas solo con un código, para garantizar la imparcialidad. El fallo es inapelable. El jurado puede declarar desierto cualquier premio si considera que las obras no alcanzan el nivel suficiente.

## 8. Premios

La entrega de premios será el sábado 17 de octubre de {{año}} en el Teatro Riera de Villaviciosa.

*Certamen rexonal de semeyes etnográfiques d'Asturies*

| Premio | Importe |
|---|---|
| Ganador | 250 € |
| Mención de honor | 150 € |
| Finalista | 75 € |
| Categoría especial {{año}} «El hórreo» | 150 € |

*Concurso de fotografía paisajística de Villaviciosa*

| Categoría | Ganador | Finalista |
|---|---|---|
| Montaña | 250 € | 100 € |
| Mar | 250 € | 100 € |
| Deportes | 250 € | 100 € |
| Accésit Carreres por montaña | 100 € | — |
| Accésit Villaviciosa | 150 € | — |

Los premios están sujetos a la normativa fiscal vigente.

## 9. Ganadores y finalistas

- Tras el fallo, la organización contactará con los seleccionados para pedirles el archivo a máxima resolución, destinado a la impresión en gran formato y a la exposición en el casco antiguo de Villaviciosa. Esta petición es un aviso oficioso, no la comunicación oficial del resultado.
- Los seleccionados tienen un plazo de 2 días desde el fallo para enviar el archivo. Si no responden, y tras agotar las vías de contacto, se pasará al siguiente clasificado.
- Los premiados deben recoger el premio en el acto de entrega, en persona o mediante un representante.
- Durante el acto de entrega se tomarán fotografías que podrán publicarse en esta web y en las redes sociales del concurso. Quien no desee aparecer en ellas puede indicarlo a la organización antes o durante el acto.

## 10. Autoría, derecho a la propia imagen y uso de las obras

- Cada participante declara ser el único autor y titular de los derechos de las fotografías que presenta, y que no infringen derechos de terceros.
- Si en una fotografía aparecen personas reconocibles, el participante declara contar con su consentimiento para presentarla al concurso y para los usos descritos en estas bases. En el caso de menores, el consentimiento debe darlo su padre, madre o tutor. El participante asume la responsabilidad ante cualquier reclamación de terceros.
- El autor conserva en todo momento sus derechos de autor. Al participar, autoriza a la organización a mostrar las fotografías presentadas durante el desarrollo del concurso y a comunicar el resultado.
- Para las fotografías premiadas y finalistas, el autor concede a la organización una licencia no exclusiva, gratuita, sin límite de tiempo ni territorio, para reproducirlas y comunicarlas públicamente en exposiciones, proyecciones, esta web, redes sociales y material de difusión del propio concurso, citando siempre el nombre del autor. Esta licencia no permite vender las fotografías ni cederlas a terceros para fines comerciales.

## 11. Protección de datos

Los datos de los participantes se tratan según la [política de privacidad](#privacidad). El nombre de los premiados y finalistas se publicará junto a sus obras en esta web, en redes sociales y en la exposición.

## 12. Aceptación y modificaciones

Participar supone aceptar estas bases. La organización puede descalificar las fotografías que no las cumplan. Si por causa de fuerza mayor o para mejorar las condiciones de los participantes (ampliación de plazos, mejora de premios) fuese necesario modificarlas, los cambios se publicarán en esta web y en las redes sociales del concurso.

## Recomendaciones

El concurso se inspira en la máxima «No se puede amar lo que no se conoce, ni defender lo que no se ama»: mostrar la belleza que nos rodea para despertar respeto y cariño por nuestro paisaje, nuestro paisanaje y su historia. Pedimos a los participantes que sigan el [decálogo ético de AEFONA](https://www.aefona.org/wp-content/uploads/2021/11/decalogo-etico-v2021-09.pdf) (Asociación Española de Fotógrafos de Naturaleza).
`;
