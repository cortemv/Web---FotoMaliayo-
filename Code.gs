/**
 * FotoMaliayo · Recepción de inscripciones (Google Apps Script)
 *
 * Guarda las fotografías en Google Drive, ordenadas por edición, certamen y categoría,
 * con nombres anónimos (código), y los datos de los participantes en una hoja de cálculo.
 *
 * PUESTA EN MARCHA (una sola vez, con la cuenta concursofotografiavillaviciosa@gmail.com):
 *  1. Entra en https://script.google.com y crea un proyecto nuevo.
 *  2. Borra el contenido de Code.gs, pega este archivo y guarda.
 *  3. Elige la función «setup» en el desplegable y pulsa Ejecutar. Acepta los permisos.
 *     Se crearán la carpeta «FotoMaliayo · Inscripciones» y la hoja «FotoMaliayo · Participantes».
 *  4. Implementar > Nueva implementación > Tipo: Aplicación web.
 *       Ejecutar como: Yo.   Quién tiene acceso: Cualquier usuario.
 *  5. Copia la URL que termina en /exec y pégala en js/datos/config.js, en «endpoint».
 *
 * CADA EDICIÓN: cambia EDICION y FECHA_LIMITE aquí y en js/datos/config.js, y vuelve a implementar
 * (Implementar > Gestionar implementaciones > editar > Nueva versión).
 *
 * PARA EL JURADO: comparte solo la carpeta de la edición (fotos con código, sin nombres).
 * La hoja de cálculo con los datos personales no se comparte nunca con el jurado.
 */

const AJUSTES = {
  EDICION: '2026',
  FECHA_LIMITE: '2026-10-01T23:59:59+02:00',
  EMAIL_ORGANIZACION: 'concursofotografiavillaviciosa@gmail.com',
  MAX_MB: 20,
  MAX: { etno: 3, paisaje: 5 },
  CERTAMENES: {
    etno: { carpeta: 'Semeyes etnográfiques', categorias: ['Categoría única'] },
    paisaje: {
      carpeta: 'Fotografía paisajística',
      categorias: [
        'Montaña, media montaña, bosques y ríos',
        'Deportes en el mediu natural',
        'Accésit Carreres por montaña en Asturies',
        "La mar d'Asturies y su franja costera",
        'Accésit Villaviciosa',
        'Socios LlamaEllo'
      ]
    }
  },
  ESPECIAL: 'El hórreo'
};

/* ------------------------------------------------------------------ */

function setup() {
  const props = PropertiesService.getScriptProperties();
  let root = props.getProperty('ROOT_ID') ? DriveApp.getFolderById(props.getProperty('ROOT_ID')) : null;
  if (!root) {
    root = DriveApp.createFolder('FotoMaliayo · Inscripciones');
    props.setProperty('ROOT_ID', root.getId());
  }
  if (!props.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('FotoMaliayo · Participantes');
    const p = ss.getSheets()[0];
    p.setName('Participantes');
    p.appendRow(['Código', 'Fecha', 'Edición', 'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Localidad',
                 'Socio LlamaEllo', 'Nº socio', 'Acepta avisos', 'Fotos previstas', 'Fotos recibidas', 'Estado']);
    p.setFrozenRows(1);
    const f = ss.insertSheet('Fotografías');
    f.appendRow(['Código foto', 'Código participante', 'Fecha', 'Certamen', 'Categoría', 'Cat. especial',
                 'Título', 'Descripción', 'Archivo original', 'Enlace']);
    f.setFrozenRows(1);
    DriveApp.getFileById(ss.getId()).moveTo(root);
    props.setProperty('SHEET_ID', ss.getId());
  }
  Logger.log('Listo. Carpeta: ' + root.getUrl());
}

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    if (new Date() > new Date(AJUSTES.FECHA_LIMITE)) throw new Error('El plazo de inscripción está cerrado');
    let res;
    if (req.action === 'register') res = registrar_(req);
    else if (req.action === 'upload') res = subir_(req);
    else if (req.action === 'finalize') res = finalizar_(req);
    else throw new Error('Acción no válida');
    return json_(Object.assign({ ok: true }, res));
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return json_({ ok: true, info: 'FotoMaliayo: servicio de inscripción activo' });
}

/* ------------------------------------------------------------------ */

function registrar_(req) {
  const p = req.participante || {};
  const txt = (v, max) => String(v || '').trim().slice(0, max || 200);
  if (!txt(p.nombre) || !txt(p.apellidos)) throw new Error('Faltan el nombre o los apellidos');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt(p.email))) throw new Error('El correo electrónico no es válido');
  const total = Number(req.total);
  if (!(total >= 1 && total <= AJUSTES.MAX.etno + AJUSTES.MAX.paisaje)) throw new Error('Número de fotografías no válido');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = hoja_('Participantes');
    const n = sh.getLastRow(); // la fila 1 es la cabecera
    const codigo = 'P' + AJUSTES.EDICION.slice(-2) + '-' + String(n).padStart(4, '0');
    sh.appendRow([codigo, new Date(), AJUSTES.EDICION, txt(p.nombre), txt(p.apellidos), txt(p.email),
                  txt(p.telefono, 40), txt(p.localidad), p.socio ? 'Sí' : 'No', txt(p.numSocio, 40),
                  p.novedades ? 'Sí' : 'No', total, 0, 'Incompleta']);
    const token = Utilities.getUuid();
    CacheService.getScriptCache().put('t_' + codigo, JSON.stringify({
      token: token, fila: sh.getLastRow(), socio: !!p.socio, total: total, etno: 0, paisaje: 0, recibidas: 0,
      email: txt(p.email), nombre: txt(p.nombre)
    }), 21600);
    return { codigo: codigo, token: token };
  } finally {
    lock.releaseLock();
  }
}

function subir_(req) {
  const cache = CacheService.getScriptCache();
  const st = sesion_(req, cache);
  const cert = AJUSTES.CERTAMENES[req.certamen];
  if (!cert) throw new Error('Certamen no válido');
  if (cert.categorias.indexOf(req.categoria) === -1) throw new Error('Categoría no válida');
  if (req.categoria === 'Socios LlamaEllo' && !st.socio) throw new Error('La categoría Socios LlamaEllo es solo para socios');
  if (st[req.certamen] >= AJUSTES.MAX[req.certamen]) throw new Error('Se ha superado el máximo de fotografías de este certamen');
  if (st.recibidas >= st.total) throw new Error('Ya se han recibido todas las fotografías de esta inscripción');

  const bytes = Utilities.base64Decode(String(req.data || ''));
  if (bytes.length > AJUSTES.MAX_MB * 1048576) throw new Error('La fotografía supera los ' + AJUSTES.MAX_MB + ' MB');
  if (bytes.length < 4 || (bytes[0] & 0xff) !== 0xff || (bytes[1] & 0xff) !== 0xd8) throw new Error('El archivo no es un JPG válido');

  const codigoFoto = req.codigo + '-' + (st.recibidas + 1);
  const carpeta = carpeta_([AJUSTES.EDICION, cert.carpeta, req.categoria]);
  const archivo = carpeta.createFile(Utilities.newBlob(bytes, 'image/jpeg', codigoFoto + '.jpg'));
  const especial = req.certamen === 'etno' && req.especial && AJUSTES.ESPECIAL ? AJUSTES.ESPECIAL : '';
  if (especial) archivo.makeCopy(codigoFoto + '.jpg', carpeta_([AJUSTES.EDICION, cert.carpeta, 'Categoría especial · ' + especial]));

  hoja_('Fotografías').appendRow([codigoFoto, req.codigo, new Date(), cert.carpeta, req.categoria, especial,
    String(req.titulo || '').slice(0, 100), String(req.descripcion || '').slice(0, 1500),
    String(req.nombreArchivo || '').slice(0, 200), archivo.getUrl()]);

  st[req.certamen]++;
  st.recibidas++;
  cache.put('t_' + req.codigo, JSON.stringify(st), 21600);
  return { codigoFoto: codigoFoto };
}

function finalizar_(req) {
  const cache = CacheService.getScriptCache();
  const st = sesion_(req, cache);
  const sh = hoja_('Participantes');
  sh.getRange(st.fila, 13, 1, 2).setValues([[st.recibidas, st.recibidas === st.total ? 'Completa' : 'Incompleta']]);

  const fotos = hoja_('Fotografías').getDataRange().getValues()
    .filter(r => r[1] === req.codigo)
    .map(r => '· «' + r[6] + '», ' + r[3] + ' / ' + r[4] + (r[5] ? ' (y categoría especial ' + r[5] + ')' : ''));

  MailApp.sendEmail({
    to: st.email,
    replyTo: AJUSTES.EMAIL_ORGANIZACION,
    subject: 'FotoMaliayo ' + AJUSTES.EDICION + ': inscripción recibida (' + req.codigo + ')',
    body: 'Hola, ' + st.nombre + ':\n\n' +
      'Hemos recibido tu inscripción en FotoMaliayo ' + AJUSTES.EDICION + '. Tu código de participante es ' + req.codigo + '.\n\n' +
      'Fotografías recibidas (' + st.recibidas + '):\n' + fotos.join('\n') + '\n\n' +
      'Si necesitas corregir algo, responde a este correo indicando tu código.\n\n' +
      'Gracias por participar.\nOrganización de FotoMaliayo'
  });
  MailApp.sendEmail(AJUSTES.EMAIL_ORGANIZACION, 'Nueva inscripción ' + req.codigo + ' (' + st.recibidas + ' fotos)',
    'Nueva inscripción recibida. Consulta la hoja «FotoMaliayo · Participantes».');

  cache.remove('t_' + req.codigo);
  return { recibidas: st.recibidas };
}

/* ------------------------------------------------------------------ */

function sesion_(req, cache) {
  const raw = cache.get('t_' + req.codigo);
  if (!raw) throw new Error('La sesión de envío ha caducado. Vuelve a enviar la inscripción');
  const st = JSON.parse(raw);
  if (st.token !== req.token) throw new Error('Envío no autorizado');
  return st;
}

function hoja_(nombre) {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Falta ejecutar setup()');
  return SpreadsheetApp.openById(id).getSheetByName(nombre);
}

function carpeta_(ruta) {
  let f = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('ROOT_ID'));
  ruta.forEach(nombre => {
    const it = f.getFoldersByName(nombre);
    f = it.hasNext() ? it.next() : f.createFolder(nombre);
  });
  return f;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
