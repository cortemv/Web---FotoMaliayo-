/* =====================================================================
   DATOS DE FOTOMALIAYO
   ---------------------------------------------------------------------
   Todo lo que cambia de un año a otro está en este archivo (salvo los
   ganadores, en ganadores.js, y las bases, en bases.js).
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
    img: 'fotos/portada/entrega-premios-2025.jpg',
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

/* ---------- Organizadores (org) y colaboradores (col) ----------
   logo: archivo dentro de la carpeta logos/
   fondo: color de fondo de la ficha, el mismo que el fondo del logo  */
const ENTIDADES = [
  {"nombre": "Grupo de Montaña Llamaello", "tipo": "org", "logo": "logos/llamaello.png", "fondo": "#000000"},
  {"nombre": "Ayuntamiento de Villaviciosa", "tipo": "org", "logo": "logos/ayuntamiento-villaviciosa.png", "fondo": "#ffffff"},
  {"nombre": "Rodiles Surf Llar", "tipo": "org", "logo": "logos/rodiles-surf-llar.png", "fondo": "#ffffff"},
  {"nombre": "Caja Rural de Asturias", "tipo": "col", "logo": "logos/caja-rural.png", "fondo": "#006039"},
  {"nombre": "Trail San Xuan d'Amandi", "tipo": "col", "logo": "logos/trail-san-xuan-amandi.png", "fondo": "#ffffff"},
  {"nombre": "Sidra Mayador", "tipo": "col", "logo": "logos/mayador.png", "fondo": "#ffffff"},
  {"nombre": "Ganadería Amable Vega", "tipo": "col", "logo": "logos/amable-vega.png", "fondo": "#fcf9f4"},
  {"nombre": "Ediciones Cordillera Cantábrica", "tipo": "col", "logo": "logos/cordillera-cantabrica.png", "fondo": "#fefefe"},
  {"nombre": "Destino Norte", "tipo": "col", "logo": "logos/destino-norte.png", "fondo": "#e24a3f"},
  {"nombre": "Indigo División", "tipo": "col", "logo": "logos/indigo-division.png", "fondo": "#ffffff"},
  {"nombre": "Los Caserinos", "tipo": "col", "logo": "logos/los-caserinos.png", "fondo": "#f7f7f7"},
  {"nombre": "Ignea Construcciones y Reformas", "tipo": "col", "logo": "logos/ignea.png", "fondo": "#ffffff"}
];
