
/* =====================================================================
   A partir de aquí está el funcionamiento de la web.
   Para actualizarla cada año no hace falta tocar nada de este archivo.
   ===================================================================== */
/* ---------------- utilidades ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fechaLimite = new Date(CONFIG.fechaLimite);
const abierta = CONFIG.inscripcionAbierta && new Date() <= fechaLimite;
const modoPrueba = !CONFIG.endpoint;
const fmtFecha = d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------------- navegación por secciones ---------------- */
const VIEWS = ['inicio','ganadores','bases','participar','aviso-legal','privacidad','cookies'];
function route() {
  const id = location.hash.slice(1);
  const view = VIEWS.includes(id) ? id : 'inicio';
  document.querySelectorAll('section[data-view]').forEach(s => s.classList.toggle('is-active', s.dataset.view === view));
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + view) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const t = { inicio:'', ganadores:'Ganadores', bases:'Bases ' + CONFIG.edicion, participar:'Inscripción', 'aviso-legal':'Aviso legal', privacidad:'Privacidad', cookies:'Cookies' }[view];
  document.title = (t ? t + ' · ' : '') + 'FotoMaliayo · Concurso de fotografía';
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------------- portada ---------------- */
function renderStatus() {
  $('#status').innerHTML = abierta
    ? `<strong>Inscripción abierta hasta el ${fmtFecha(fechaLimite)}</strong><a href="#participar">Inscríbete y envía tus fotografías</a>`
    : `<strong>El plazo de inscripción está cerrado</strong>Entrega de premios: ${esc(CONFIG.entregaPremios)}.`;
  const P = CONFIG.portada;
  let img, cap, alt;
  if (P.img) { img = P.img; cap = P.pie; alt = P.alt || P.pie; }
  else {
    const g = GANADORES.find(x => x.edicion === P.premiada.edicion && x.autor === P.premiada.autor) || GANADORES[0];
    img = g.img; alt = `Fotografía de ${g.autor}, premiada en ${g.edicion}`;
    cap = `${g.autor}. ${g.premio}${g.categoria ? ', ' + g.categoria : ''}, ${CERTAMENES[g.certamen].corto}, ${g.edicion}.`;
  }
  $('#hero-photo').innerHTML = `<button type="button" data-img="${esc(img)}" data-cap="${esc(cap)}"><img src="${esc(img)}" alt="${esc(alt)}"></button><figcaption>${esc(cap)}</figcaption>`;
  $('#hero-photo button').onclick = e => openLightbox(e.currentTarget);
}

/* ---------------- ganadores ---------------- */
function renderWinners(year) {
  const years = [...new Set(GANADORES.map(g => g.edicion))].sort((a, b) => b - a);
  year = year || years[0];
  $('#year-tabs').innerHTML = years.map((y, i) =>
    `<button role="tab" type="button" aria-selected="${y === year}" data-year="${y}">${y}</button>`).join('');
  $('#year-tabs').onclick = e => { const b = e.target.closest('button'); if (b) renderWinners(+b.dataset.year); };

  const items = GANADORES.filter(g => g.edicion === year);
  const ordinal = ['I','II','III','IV','V','VI','VII','VIII','IX','X'][year - 2023] || '';
  const groups = [];
  for (const key of ['etno', 'paisaje']) {
    const list = items.filter(g => g.certamen === key);
    const cats = [...new Set(list.map(g => g.categoria))];
    groups.push({ key, cats: cats.map(c => ({ name: c || 'Categoría única', list: list.filter(g => g.categoria === c) })) });
  }
  let n = 0;
  let html = `<p class="meta">${ordinal ? ordinal + ' edición, ' : ''}${year}</p>`;
  html += `<nav class="cat-index" aria-label="Categorías de ${year}">` + groups.map(gr => gr.cats.map(c =>
    `<button type="button" class="chip ${gr.key}" data-target="cat-${n++}">${esc(gr.key === 'etno' && c.name === 'Categoría única' ? 'Semeyes etnográfiques' : c.name)}</button>`).join('')).join('') + `</nav>`;
  n = 0;
  for (const gr of groups) {
    if (!gr.cats.length) continue;
    html += `<h3 class="contest-title ${gr.key}">${esc(CERTAMENES[gr.key].nombre)}</h3>`;
    for (const c of gr.cats) {
      html += `<section class="cat-block ${gr.key}" id="cat-${n++}"><h4 class="cat-title">${esc(c.name)}</h4><div class="gallery">` + c.list.map(g => {
        const cap = `${g.titulo ? '«' + g.titulo + '», ' : ''}${g.autor}. ${g.premio}${g.categoria ? ', ' + g.categoria : ''}, ${g.edicion}.`;
        const frame = g.img
          ? `<button type="button" data-img="${esc(g.img)}" data-cap="${esc(cap)}"><img src="${esc(g.mini || g.img)}" width="${g.w || ''}" height="${g.h || ''}" alt="Fotografía de ${esc(g.autor)}, ${esc(g.premio.toLowerCase())} en ${esc(c.name)} ${g.edicion}" loading="lazy"></button>`
          : `<div class="frame">Fotografía pendiente</div>`;
        return `<figure class="work">${frame}<figcaption><span class="prize ${g.premio === 'Ganador' ? 'win' : ''}">${esc(g.premio)}</span>${g.titulo ? `<span class="title">${esc(g.titulo)}</span>` : ''}<span class="author">${esc(g.autor)}</span></figcaption></figure>`;
      }).join('') + `</div></section>`;
    }
  }
  $('#winners').innerHTML = html;
}
function openLightbox(b) {
  $('#lb-img').src = b.dataset.img; $('#lb-img').alt = b.dataset.cap; $('#lb-cap').textContent = b.dataset.cap;
  $('#lightbox').showModal();
}
$('#winners').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) { document.getElementById(chip.dataset.target).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return; }
  const b = e.target.closest('button[data-img]'); if (b) openLightbox(b);
});
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.target.close(); });

/* ---------------- formulario ---------------- */
let fotos = [];   // {id, file, ok}
let nextId = 1;

function renderFormArea() {
  const area = $('#form-area');
  if (!abierta && !modoPrueba) {
    area.innerHTML = `<div class="prose"><p>El plazo de inscripción de la edición ${CONFIG.edicion} terminó el ${fmtFecha(fechaLimite)}.</p>
      <p>Las bases de la próxima edición se publicarán en esta web y en las redes sociales del concurso. Mientras tanto, puedes ver los <a href="#ganadores">ganadores de ediciones anteriores</a>.</p></div>`;
    return;
  }
  const esp = CERTAMENES.etno.especial;
  area.innerHTML = `
    ${modoPrueba ? `<p class="demo">Vista de prueba: el formulario funciona y valida las fotografías, pero todavía no envía nada. Se activará al conectar el almacenamiento.</p>` : ''}
    <form class="form" id="form" novalidate>
      <p class="prose">Rellena tus datos, añade tus fotografías y envíalo todo de una vez. Puedes presentar hasta ${CERTAMENES.etno.max} fotografías al certamen etnográfico y hasta ${CERTAMENES.paisaje.max} al de paisaje. Los campos con <span class="req">*</span> son obligatorios.</p>
      <div id="errors" class="errors" hidden tabindex="-1"></div>

      <fieldset>
        <legend>Tus datos</legend>
        <div class="grid">
          <div><label for="nombre">Nombre <span class="req">*</span></label><input id="nombre" name="nombre" type="text" autocomplete="given-name" required></div>
          <div><label for="apellidos">Apellidos <span class="req">*</span></label><input id="apellidos" name="apellidos" type="text" autocomplete="family-name" required></div>
          <div><label for="email">Correo electrónico <span class="req">*</span></label><input id="email" name="email" type="email" autocomplete="email" required></div>
          <div><label for="telefono">Teléfono <span class="req">*</span></label><input id="telefono" name="telefono" type="tel" autocomplete="tel" required><p class="hint">También para avisos por WhatsApp.</p></div>
          <div class="full"><label for="localidad">Localidad</label><input id="localidad" name="localidad" type="text" autocomplete="address-level2"></div>
          <div class="full">
            <div class="check"><input id="socio" name="socio" type="checkbox"><label for="socio">Soy socio o socia del Grupo de Montaña Llamaello</label></div>
            <div id="socio-num" hidden><label for="numSocio">Número de socio</label><input id="numSocio" name="numSocio" type="text"></div>
          </div>
        </div>
        <input class="hp" type="text" name="web" id="web" tabindex="-1" autocomplete="off" aria-hidden="true">
      </fieldset>

      <fieldset>
        <legend>Tus fotografías</legend>
        <p class="hint" style="margin-top:0">JPG de al menos ${CONFIG.minLado} px en el lado mayor y hasta ${CONFIG.maxMB} MB. Sin marcos, bordes ni firmas.</p>
        <div class="counters" aria-live="polite"><span>Semeyes etnográfiques: <strong id="c-etno">0</strong> de ${CERTAMENES.etno.max}</span><span>Paisaje: <strong id="c-paisaje">0</strong> de ${CERTAMENES.paisaje.max}</span></div>
        <div id="photos"></div>
        <button type="button" class="btn ghost" id="add">Añadir fotografía</button>
      </fieldset>

      <fieldset>
        <legend>Declaraciones</legend>
        <div class="check"><input id="d-bases" type="checkbox" required><label for="d-bases">He leído y acepto las <a href="#bases" target="_blank">bases del concurso</a> y la <a href="#privacidad" target="_blank">política de privacidad</a>. <span class="req">*</span></label></div>
        <div class="check"><input id="d-autor" type="checkbox" required><label for="d-autor">Soy el autor o autora de las fotografías y tengo el consentimiento de las personas reconocibles que aparecen en ellas. <span class="req">*</span></label></div>
        <div class="check"><input id="d-edad" type="checkbox" required><label for="d-edad">Soy mayor de 18 años, o cuento con la autorización de mi padre, madre o tutor y la enviaré a la organización. <span class="req">*</span></label></div>
        <div class="check"><input id="d-news" type="checkbox"><label for="d-news">Quiero recibir avisos de futuras ediciones del concurso (opcional).</label></div>

        <div class="layer">
          <p style="margin-top:0">Información básica sobre protección de datos</p>
          <div class="table-scroll"><table><tbody>
            <tr><th>Responsable</th><td>${esc(CONFIG.titular.nombre)}</td></tr>
            <tr><th>Finalidad</th><td>Gestionar tu participación en el concurso y, si lo autorizas, avisarte de futuras ediciones.</td></tr>
            <tr><th>Legitimación</th><td>Aceptación de las bases del concurso y, en su caso, tu consentimiento.</td></tr>
            <tr><th>Destinatarios</th><td>No se ceden datos a terceros. El jurado recibe las fotografías de forma anónima. Los datos se almacenan en Google Drive.</td></tr>
            <tr><th>Derechos</th><td>Acceso, rectificación, supresión y otros, escribiendo a ${esc(CONFIG.email)}.</td></tr>
            <tr><th>Más información</th><td><a href="#privacidad" target="_blank">Política de privacidad</a></td></tr>
          </tbody></table></div>
        </div>
      </fieldset>

      <div id="sending" hidden><p id="sending-text">Enviando…</p><div class="progress"><span id="bar"></span></div><p class="hint">No cierres esta página hasta que termine el envío.</p></div>
      <button type="submit" class="btn" id="submit">Enviar inscripción</button>
    </form>`;

  fotos = []; nextId = 1;
  $('#add').onclick = () => addPhoto();
  $('#socio').onchange = () => { $('#socio-num').hidden = !$('#socio').checked; refreshCategoryOptions(); };
  $('#form').onsubmit = onSubmit;
  addPhoto();
}

function count(key) { return fotos.filter(f => $(`#cert-${f.id}`)?.value === key).length; }

function updateCounters() {
  $('#c-etno').textContent = count('etno');
  $('#c-paisaje').textContent = count('paisaje');
  const full = fotos.length >= CERTAMENES.etno.max + CERTAMENES.paisaje.max;
  $('#add').disabled = full;
  document.querySelectorAll('.photo h4').forEach((h, i) => h.textContent = `Fotografía ${i + 1}`);
}

function categoryOptions(certKey, current) {
  if (!certKey) return '<option value="">Elige primero el certamen</option>';
  const socio = $('#socio')?.checked;
  return '<option value="">Elige una categoría</option>' + CERTAMENES[certKey].categorias
    .filter(c => c !== 'Socios LlamaEllo' || socio)
    .map(c => `<option ${c === current ? 'selected' : ''}>${esc(c)}</option>`).join('');
}
function refreshCategoryOptions() {
  fotos.forEach(f => { const s = $(`#cat-${f.id}`); s.innerHTML = categoryOptions($(`#cert-${f.id}`).value, s.value); });
}

function addPhoto() {
  const id = nextId++;
  const f = { id, file: null, ok: false, msg: '' };
  fotos.push(f);
  const esp = CERTAMENES.etno.especial;
  const div = document.createElement('div');
  div.className = 'photo'; div.id = `photo-${id}`;
  div.innerHTML = `
    <div class="thumb" id="thumb-${id}">Sin imagen</div>
    <div class="fields">
      <div class="photo-head"><h4></h4><button type="button" class="link-btn" data-remove="${id}">Quitar</button></div>
      <div><label for="file-${id}">Archivo JPG <span class="req">*</span></label><input id="file-${id}" type="file" accept="image/jpeg,.jpg,.jpeg"><p class="file-info" id="info-${id}"></p></div>
      <div class="grid">
        <div><label for="cert-${id}">Certamen <span class="req">*</span></label>
          <select id="cert-${id}"><option value="">Elige un certamen</option><option value="etno">${esc(CERTAMENES.etno.corto)}</option><option value="paisaje">${esc(CERTAMENES.paisaje.corto)}</option></select></div>
        <div><label for="cat-${id}">Categoría <span class="req">*</span></label><select id="cat-${id}">${categoryOptions('')}</select></div>
      </div>
      ${esp ? `<div class="check" id="esp-wrap-${id}" hidden><input id="esp-${id}" type="checkbox"><label for="esp-${id}">Participa también en la categoría especial «${esc(esp)}»</label></div>` : ''}
      <div><label for="tit-${id}">Título <span class="req">*</span></label><input id="tit-${id}" type="text" maxlength="100"></div>
      <div><label for="desc-${id}">Descripción <span class="req">*</span></label><textarea id="desc-${id}" maxlength="1500" placeholder="Dónde y cuándo se tomó, la técnica empleada y la historia del momento."></textarea></div>
    </div>`;
  $('#photos').appendChild(div);

  $(`#cert-${id}`).onchange = e => {
    const k = e.target.value;
    $(`#cat-${id}`).innerHTML = categoryOptions(k);
    if (k === 'etno') $(`#cat-${id}`).value = 'Categoría única';
    if ($(`#esp-wrap-${id}`)) $(`#esp-wrap-${id}`).hidden = k !== 'etno';
    updateCounters();
  };
  $(`#file-${id}`).onchange = e => checkFile(f, e.target.files[0]);
  div.querySelector('[data-remove]').onclick = () => {
    fotos = fotos.filter(x => x.id !== id); div.remove(); updateCounters();
    if (!fotos.length) addPhoto();
  };
  updateCounters();
}

function checkFile(f, file) {
  const info = $(`#info-${f.id}`), thumb = $(`#thumb-${f.id}`);
  f.file = file || null; f.ok = false; info.className = 'file-info';
  if (!file) { info.textContent = ''; thumb.textContent = 'Sin imagen'; return; }
  const mb = file.size / 1048576;
  const isJpg = /image\/jpe?g/.test(file.type) || /\.jpe?g$/i.test(file.name);
  if (!isJpg) { f.msg = 'El archivo debe ser JPG.'; info.textContent = f.msg; info.classList.add('bad'); thumb.textContent = 'Formato no válido'; return; }
  if (mb > CONFIG.maxMB) { f.msg = `Pesa ${mb.toFixed(1)} MB; el máximo es ${CONFIG.maxMB} MB.`; info.textContent = f.msg; info.classList.add('bad'); return; }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const lado = Math.max(img.naturalWidth, img.naturalHeight);
    thumb.innerHTML = ''; thumb.appendChild(img);
    if (lado < CONFIG.minLado) {
      f.msg = `Mide ${img.naturalWidth} × ${img.naturalHeight} px; el lado mayor debe tener al menos ${CONFIG.minLado} px.`;
      info.textContent = f.msg; info.classList.add('bad');
    } else {
      f.ok = true; f.msg = '';
      info.textContent = `${img.naturalWidth} × ${img.naturalHeight} px, ${mb.toFixed(1)} MB. Correcto.`; info.classList.add('good');
    }
  };
  img.onerror = () => { f.msg = 'No se puede leer la imagen. Comprueba que el archivo no está dañado.'; info.textContent = f.msg; info.classList.add('bad'); };
  img.alt = ''; img.src = url;
}

function validate() {
  const errs = [];
  const v = id => $('#' + id).value.trim();
  if (!v('nombre')) errs.push('Escribe tu nombre.');
  if (!v('apellidos')) errs.push('Escribe tus apellidos.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) errs.push('Escribe un correo electrónico válido.');
  if (v('telefono').replace(/\D/g, '').length < 9) errs.push('Escribe un teléfono de contacto válido.');
  fotos.forEach((f, i) => {
    const n = `Fotografía ${i + 1}`;
    if (!f.file) errs.push(`${n}: añade el archivo.`);
    else if (!f.ok) errs.push(`${n}: ${f.msg || 'el archivo aún se está comprobando.'}`);
    if (!$(`#cert-${f.id}`).value) errs.push(`${n}: elige el certamen.`);
    if (!$(`#cat-${f.id}`).value) errs.push(`${n}: elige la categoría.`);
    if (!$(`#tit-${f.id}`).value.trim()) errs.push(`${n}: escribe el título.`);
    if (!$(`#desc-${f.id}`).value.trim()) errs.push(`${n}: escribe una breve descripción.`);
  });
  if (count('etno') > CERTAMENES.etno.max) errs.push(`Has añadido más de ${CERTAMENES.etno.max} fotografías al certamen etnográfico.`);
  if (count('paisaje') > CERTAMENES.paisaje.max) errs.push(`Has añadido más de ${CERTAMENES.paisaje.max} fotografías al concurso de paisaje.`);
  if (!$('#d-bases').checked) errs.push('Acepta las bases y la política de privacidad.');
  if (!$('#d-autor').checked) errs.push('Confirma la autoría y el consentimiento de las personas fotografiadas.');
  if (!$('#d-edad').checked) errs.push('Confirma tu edad o la autorización de tu tutor.');
  return errs;
}

const toBase64 = file => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = () => rej(new Error('No se pudo leer el archivo ' + file.name));
  r.readAsDataURL(file);
});

async function api(payload) {
  // Sin cabeceras: el navegador lo envía como text/plain y Google Apps Script lo acepta sin bloqueo CORS
  const r = await fetch(CONFIG.endpoint, { method: 'POST', body: JSON.stringify(payload) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'Error desconocido');
  return j;
}

async function onSubmit(e) {
  e.preventDefault();
  const box = $('#errors');
  const errs = validate();
  if (errs.length) {
    box.innerHTML = `Revisa estos puntos antes de enviar:<ul>${errs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    box.hidden = false; box.focus(); return;
  }
  box.hidden = true;
  if ($('#web').value) return; // trampa anti-spam

  const participante = {
    nombre: $('#nombre').value.trim(), apellidos: $('#apellidos').value.trim(),
    email: $('#email').value.trim(), telefono: $('#telefono').value.trim(),
    localidad: $('#localidad').value.trim(), socio: $('#socio').checked,
    numSocio: $('#numSocio').value.trim(), novedades: $('#d-news').checked
  };
  const lista = fotos.map(f => ({
    f, certamen: $(`#cert-${f.id}`).value, categoria: $(`#cat-${f.id}`).value,
    especial: !!$(`#esp-${f.id}`)?.checked && $(`#cert-${f.id}`).value === 'etno',
    titulo: $(`#tit-${f.id}`).value.trim(), descripcion: $(`#desc-${f.id}`).value.trim()
  }));

  const btn = $('#submit'); btn.disabled = true;
  $('#sending').hidden = false;
  const setProg = (txt, p) => { $('#sending-text').textContent = txt; $('#bar').style.width = p + '%'; };

  try {
    let codigo;
    if (modoPrueba) {
      for (let i = 0; i < lista.length; i++) { setProg(`Enviando fotografía ${i + 1} de ${lista.length}…`, ((i + 1) / (lista.length + 1)) * 100); await new Promise(r => setTimeout(r, 500)); }
      codigo = 'PRUEBA';
    } else {
      setProg('Registrando tus datos…', 5);
      const reg = await api({ action: 'register', participante, total: lista.length });
      codigo = reg.codigo;
      for (let i = 0; i < lista.length; i++) {
        const x = lista[i];
        setProg(`Enviando fotografía ${i + 1} de ${lista.length}…`, 5 + (i / lista.length) * 90);
        const data = await toBase64(x.f.file);
        await api({ action: 'upload', codigo, token: reg.token, indice: i + 1,
          certamen: x.certamen, categoria: x.categoria, especial: x.especial,
          titulo: x.titulo, descripcion: x.descripcion, nombreArchivo: x.f.file.name, data });
      }
      setProg('Terminando…', 97);
      await api({ action: 'finalize', codigo, token: reg.token });
    }
    setProg('Enviado', 100);
    $('#form-area').innerHTML = `<div class="done" tabindex="-1" id="done">
      <p style="margin-top:0">Inscripción enviada. Tu código de participante es</p>
      <p class="code">${esc(codigo)}</p>
      <p>Hemos recibido ${lista.length} ${lista.length === 1 ? 'fotografía' : 'fotografías'}. ${modoPrueba ? 'En modo de prueba no se envía ningún correo.' : `Te llegará un correo de confirmación a ${esc(participante.email)}. Si no lo ves en unos minutos, revisa la carpeta de correo no deseado.`}</p>
      <p>Si necesitas cambiar algo, escribe a <a href="mailto:${CONFIG.email}">${CONFIG.email}</a> indicando tu código.</p></div>`;
    $('#done').focus();
  } catch (err) {
    $('#sending').hidden = true; btn.disabled = false;
    box.innerHTML = `No se ha podido completar el envío: ${esc(err.message)}. Comprueba tu conexión y vuelve a intentarlo. Si el problema continúa, escribe a <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
    box.hidden = false; box.focus();
  }
}

/* ---------------- textos con formato sencillo (bases) ---------------- */
function inline(t) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) =>
      url.startsWith('#') ? `<a href="${url}">${txt}</a>` : `<a href="${url}" target="_blank" rel="noopener">${txt}</a>`);
}
function markdown(src) {
  const lines = src.replace(/\{\{año\}\}/g, CONFIG.edicion).replace(/\{\{titular\}\}/g, CONFIG.titular.nombre).split('\n');
  let html = '', i = 0, firstPara = true;
  const isNum = c => /€$|^—$|^\d/.test(c.trim());
  while (i < lines.length) {
    const l = lines[i].trim();
    if (!l) { i++; continue; }
    if (l.startsWith('# ')) { html += `<h2 id="t-bases">${inline(l.slice(2))}</h2>`; i++; continue; }
    if (l.startsWith('## ')) { html += `<h3>${inline(l.slice(3))}</h3>`; i++; continue; }
    if (l.startsWith('- ')) {
      html += '<ul>';
      while (i < lines.length && lines[i].trim().startsWith('- ')) { html += `<li>${inline(lines[i].trim().slice(2))}</li>`; i++; }
      html += '</ul>'; continue;
    }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = cells(rows[0]), body = rows.slice(1).filter(r => !/^\|[\s|:-]+\|$/.test(r)).map(cells);
      html += '<div class="table-scroll"><table><thead><tr>' + head.map((c, k) => `<th${k ? ' style="text-align:right"' : ''}>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' + body.map(r => '<tr>' + r.map((c, k) => `<td${k && isNum(c) ? ' class="n"' : ''}>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#|- |\|)/.test(lines[i].trim())) { para.push(lines[i].trim()); i++; }
    html += `<p${firstPara ? ' class="meta"' : ''}>${inline(para.join(' '))}</p>`;
    firstPara = false;
  }
  return html;
}

/* ---------------- edición actual y datos del titular ---------------- */
function renderEdicion() {
  const C = CONFIG;
  $('#ed-cartel').src = C.cartel; $('#ed-cartel').alt = C.cartelAlt;
  $('#t-edicion').textContent = `Edición ${C.edicion}`;
  $('#ed-meta').textContent = `${C.numeroEdicion} edición${C.dedicatoria ? ', ' + C.dedicatoria : ''}.`;
  $('#ed-premios').textContent = C.resumenPremios;
  $('#ed-calendario').innerHTML = C.calendario.map(x => `<li><span class="d">${esc(x.fecha)}</span>${esc(x.texto)}</li>`).join('');
  $('#ed-bases-link').textContent = `Leer las bases de la edición ${C.edicion}`;
  $('#bases-doc').innerHTML = markdown(BASES);
  document.querySelectorAll('[data-dato]').forEach(el => el.textContent = C.titular[el.dataset.dato] || '');
}

/* ---------------- logotipos ---------------- */
function renderLogos() {
  for (const tipo of ['org', 'col']) {
    $('#logos-' + tipo).innerHTML = ENTIDADES.filter(x => x.tipo === tipo).map(x =>
      `<li style="background:${esc(x.fondo)}" title="${esc(x.nombre)}"><img src="${esc(x.logo)}" alt="${esc(x.nombre)}" loading="lazy"></li>`).join('');
  }
}

/* ---------------- arranque ---------------- */
renderEdicion();
renderLogos();
renderStatus();
renderWinners();
renderFormArea();
route();
