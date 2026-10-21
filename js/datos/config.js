/* =====================================================================
   DATOS DE FOTOMALIAYO
   ---------------------------------------------------------------------
   Todo lo que cambia de un año a otro está en este archivo, salvo:
     - los ganadores, en js/datos/ganadores.js
     - los logotipos, en js/datos/entidades.js
     - los textos (bases y textos legales), en los archivos .md de /data
   Reglas para no romper nada:
     - Los textos van entre comillas simples: 'así'. Si un texto lleva
       apóstrofo (d'Asturies), usa comillas dobles: "d'Asturies".
     - Cada línea de una lista termina en coma, salvo la última.
   ===================================================================== */

const CONFIG = {

  /* ---------- Edición actual ---------- */
  edicion: 2026,                 // año
  numeroEdicion: 'IV',           // en números romanos
  dedicatoria: 'en homenaje a Ambas y Ramses (ATOAM)',   // '' si no hay
  cartel: 'img/cartel-2026.jpg', // archivo del cartel dentro de la carpeta img/
  cartelAlt: 'Cartel de FotoMaliayo 2026: retratos de los homenajeados en un entorno rural asturiano, con la información del certamen.',
  resumenPremios: '3.000 € en premios y exposición de las obras seleccionadas en gran formato por el casco antiguo de Villaviciosa.',
  calendario: [
    { fecha: '1 de octubre',   texto: 'Último día para enviar fotografías, hasta las 23:59.' },
    { fecha: 'Tras el fallo',  texto: 'Los seleccionados tienen 2 días para enviar el archivo a máxima resolución.' },
    { fecha: '17 de octubre',  texto: 'Entrega de premios en el Teatro Riera de Villaviciosa.' }
  ],

  /* ---------- Inscripción ---------- */
  // Fecha y hora límite (el +02:00 es la hora de verano española; en invierno, +01:00)
  fechaLimite: '2026-10-01T23:59:59+02:00',
  entregaPremios: 'sábado 17 de octubre, en el Teatro Riera de Villaviciosa',
  // false = inscripción cerrada aunque no haya llegado la fecha límite
  inscripcionAbierta: true,
  // Dirección del script de Google (ver Code.gs). Vacío = formulario en modo de prueba.
  endpoint: '',
  maxMB: 20,
  minLado: 1920,

  /* ---------- Portada ---------- */
  portada: {
    img: 'img/fotos/portada/entrega-premios-2025.jpg',
    pie: 'Entrega de premios de la edición 2025 en el Teatro Riera de Villaviciosa.',
    alt: 'Premiados de FotoMaliayo 2025 posando con sus diplomas en el escenario del Teatro Riera de Villaviciosa.',
    // Si dejas img: '' se muestra esta foto premiada en su lugar
    premiada: { edicion: 2024, autor: 'Gerardo Alonso' }
  },

  /* ---------- Responsable (aviso legal y privacidad) ---------- */
  titular: {
    nombre: 'Manuel Ángel Toral Fernández',
    nif: '[COMPLETAR]',
    domicilio: '[COMPLETAR]'
  },
  email: 'concursofotografiavillaviciosa@gmail.com'
};

/* ---------- Certámenes y categorías del formulario de inscripción ---------- */
const CERTAMENES = {
  etno: {
    nombre: "Certamen rexonal de semeyes etnográfiques d'Asturies",
    corto: 'Semeyes etnográfiques',
    max: 3,
    categorias: ['Categoría única'],
    especial: 'El hórreo'      // categoría especial de este año; '' si no hay
  },
  paisaje: {
    nombre: 'Concurso de fotografía paisajística de Villaviciosa',
    corto: 'Fotografía paisajística',
    max: 5,
    categorias: [
      'Montaña, media montaña, bosques y ríos',
      'Deportes en el mediu natural',
      'Accésit Carreres por montaña en Asturies',
      "La mar d'Asturies y su franja costera",
      'Accésit Villaviciosa',
      'Socios LlamaEllo'       // solo se ofrece a quien marca que es socio
    ]
  }
};

/* ---------- Textos automáticos de los documentos de /data ----------
   En los archivos .md, {{año}} se sustituye por el año de la edición,
   {{titular}} por el nombre del responsable, etc. No hace falta tocarlo. */
const VARIABLES_DOCUMENTOS = {
  "año": CONFIG.edicion,
  numeroEdicion: CONFIG.numeroEdicion,
  titular: CONFIG.titular.nombre,
  nif: CONFIG.titular.nif,
  domicilio: CONFIG.titular.domicilio,
  email: CONFIG.email,
  especial: CERTAMENES.etno.especial
};
