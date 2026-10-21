/* =====================================================================
   PÁGINA: inscripción (participar.html)
   ---------------------------------------------------------------------
   - Muestra el formulario o el aviso de plazo cerrado.
   - Añade y quita fotografías (plantilla <template id="tpl-foto">).
   - Comprueba cada archivo: JPG, peso máximo y tamaño mínimo.
   - Valida el formulario y lo envía al script de Google (Code.gs):
     primero registra al participante, luego sube las fotos una a una y
     por último cierra la inscripción.
   Sin CONFIG.endpoint, el formulario funciona en modo de prueba: valida
   todo pero no envía nada.
   ===================================================================== */

(() => {
  const { abierta, modoPrueba } = INSCRIPCION;
  const CATEGORIA_SOCIOS = "Socios LlamaEllo";
  const MAX_FOTOS = CERTAMENES.etno.max + CERTAMENES.paisaje.max;

  if (!abierta && !modoPrueba) {
    $("#cerrada").hidden = false;
    return;
  }

  const formulario = $("#inscripcion");
  const cajaErrores = $("#errores");
  const botonAnadir = $("#anadir");
  const casillaSocio = $("#socio");

  /** Fotografías del formulario: { id, bloque, campos, archivo, valida, mensaje } */
  let fotos = [];
  let siguienteId = 1;

  /* =====================================================================
     Fotografías
     ===================================================================== */

  const valor = (foto, campo) => foto.campos[campo].value.trim();
  const contar = (certamen) => fotos.filter((f) => f.campos.certamen.value === certamen).length;

  function rellenarCategorias(select, certamen, actual = select.value) {
    const opciones = [new Option(certamen ? "Elige una categoría" : "Elige primero el certamen", "")];
    if (certamen) {
      CERTAMENES[certamen].categorias
        .filter((c) => c !== CATEGORIA_SOCIOS || casillaSocio.checked)
        .forEach((c) => opciones.push(new Option(c, c, false, c === actual)));
    }
    select.replaceChildren(...opciones);
  }

  function actualizarContadores() {
    $("#contador-etno").textContent = contar("etno");
    $("#contador-paisaje").textContent = contar("paisaje");
    botonAnadir.disabled = fotos.length >= MAX_FOTOS;
    fotos.forEach((foto, i) => {
      foto.campos.encabezado.textContent = `Fotografía ${i + 1}`;
      foto.campos.quitar.setAttribute("aria-label", `Quitar la fotografía ${i + 1}`);
    });
  }

  /** Da a cada id de la plantilla un sufijo único para que las etiquetas sigan enlazadas a su campo. */
  function hacerIdsUnicos(fragmento, sufijo) {
    $$("[id]", fragmento).forEach((el) => (el.id = `${el.id}-${sufijo}`));
    $$("label[for]", fragmento).forEach((el) => (el.htmlFor = `${el.htmlFor}-${sufijo}`));
    $$("[aria-describedby], [aria-labelledby]", fragmento).forEach((el) => {
      for (const atributo of ["aria-describedby", "aria-labelledby"]) {
        const ids = el.getAttribute(atributo);
        if (ids) el.setAttribute(atributo, ids.split(/\s+/).map((id) => `${id}-${sufijo}`).join(" "));
      }
    });
  }

  function anadirFoto() {
    const id = siguienteId++;
    const fragmento = clonarPlantilla("tpl-foto");
    hacerIdsUnicos(fragmento, id);
    rellenarConfig(fragmento);

    const bloque = fragmento.firstElementChild;
    const campos = {};
    $$("[data-campo]", bloque).forEach((el) => (campos[el.dataset.campo] = el));
    const foto = { id, bloque, campos, archivo: null, valida: false, mensaje: "" };

    const especial = $("[data-especial]", bloque);
    if (!CERTAMENES.etno.especial) especial.remove();

    campos.certamen.addEventListener("change", () => {
      const certamen = campos.certamen.value;
      rellenarCategorias(campos.categoria, certamen, "");
      if (certamen === "etno") campos.categoria.value = "Categoría única";
      if (especial.isConnected) especial.hidden = certamen !== "etno";
      actualizarContadores();
    });
    campos.archivo.addEventListener("change", (e) => comprobarArchivo(foto, e.target.files[0]));
    campos.quitar.addEventListener("click", () => quitarFoto(foto));

    fotos.push(foto);
    $("#fotos").append(bloque);
    actualizarContadores();
  }

  function quitarFoto(foto) {
    fotos = fotos.filter((f) => f !== foto);
    foto.bloque.remove();
    actualizarContadores();
    if (!fotos.length) anadirFoto();
  }

  /* ---------- Comprobación del archivo ---------- */
  function mostrarInfo(foto, texto, estado = "") {
    const info = foto.campos.info;
    info.textContent = texto;
    info.classList.remove("bad", "good");
    if (estado) info.classList.add(estado);
  }

  function marcarError(foto, mensaje) {
    foto.mensaje = mensaje;
    mostrarInfo(foto, mensaje, "bad");
  }

  function comprobarArchivo(foto, archivo) {
    const miniatura = foto.campos.miniatura;
    foto.archivo = archivo || null;
    foto.valida = false;
    mostrarInfo(foto, "");

    if (!archivo) {
      miniatura.textContent = "Sin imagen";
      return;
    }

    const megas = archivo.size / 1048576;
    const esJpg = /image\/jpe?g/.test(archivo.type) || /\.jpe?g$/i.test(archivo.name);
    if (!esJpg) {
      marcarError(foto, "El archivo debe ser JPG.");
      miniatura.textContent = "Formato no válido";
      return;
    }
    if (megas > CONFIG.maxMB) {
      marcarError(foto, `Pesa ${megas.toFixed(1)} MB; el máximo es ${CONFIG.maxMB} MB.`);
      return;
    }

    const imagen = new Image();
    imagen.alt = "";
    imagen.onload = () => {
      const ancho = imagen.naturalWidth;
      const alto = imagen.naturalHeight;
      miniatura.replaceChildren(imagen);
      if (Math.max(ancho, alto) < CONFIG.minLado) {
        marcarError(foto, `Mide ${ancho} × ${alto} px; el lado mayor debe tener al menos ${CONFIG.minLado} px.`);
      } else {
        foto.valida = true;
        foto.mensaje = "";
        mostrarInfo(foto, `${ancho} × ${alto} px, ${megas.toFixed(1)} MB. Correcto.`, "good");
      }
    };
    imagen.onerror = () => marcarError(foto, "No se puede leer la imagen. Comprueba que el archivo no está dañado.");
    imagen.src = URL.createObjectURL(archivo);
  }

  /* =====================================================================
     Validación
     ===================================================================== */

  function validar() {
    const errores = [];
    const campo = (id) => $("#" + id).value.trim();

    if (!campo("nombre")) errores.push("Escribe tu nombre.");
    if (!campo("apellidos")) errores.push("Escribe tus apellidos.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo("email"))) errores.push("Escribe un correo electrónico válido.");
    if (campo("telefono").replace(/\D/g, "").length < 9) errores.push("Escribe un teléfono de contacto válido.");

    fotos.forEach((foto, i) => {
      const n = `Fotografía ${i + 1}`;
      if (!foto.archivo) errores.push(`${n}: añade el archivo.`);
      else if (!foto.valida) errores.push(`${n}: ${foto.mensaje || "el archivo aún se está comprobando."}`);
      if (!valor(foto, "certamen")) errores.push(`${n}: elige el certamen.`);
      if (!valor(foto, "categoria")) errores.push(`${n}: elige la categoría.`);
      if (!valor(foto, "titulo")) errores.push(`${n}: escribe el título.`);
      if (!valor(foto, "descripcion")) errores.push(`${n}: escribe una breve descripción.`);
    });

    if (contar("etno") > CERTAMENES.etno.max)
      errores.push(`Has añadido más de ${CERTAMENES.etno.max} fotografías al certamen etnográfico.`);
    if (contar("paisaje") > CERTAMENES.paisaje.max)
      errores.push(`Has añadido más de ${CERTAMENES.paisaje.max} fotografías al concurso de paisaje.`);

    if (!$("#d-bases").checked) errores.push("Acepta las bases y la política de privacidad.");
    if (!$("#d-autor").checked) errores.push("Confirma la autoría y el consentimiento de las personas fotografiadas.");
    if (!$("#d-edad").checked) errores.push("Confirma tu edad o la autorización de tu tutor.");
    return errores;
  }

  function mostrarErrores(introduccion, lista = []) {
    $("p", cajaErrores).replaceChildren(...introduccion);
    $("ul", cajaErrores).replaceChildren(
      ...lista.map((texto) => {
        const elemento = document.createElement("li");
        elemento.textContent = texto;
        return elemento;
      }),
    );
    $("ul", cajaErrores).hidden = !lista.length;
    cajaErrores.hidden = false;
    cajaErrores.focus();
  }

  /* =====================================================================
     Envío
     ===================================================================== */

  const aBase64 = (archivo) =>
    new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onload = () => resolver(String(lector.result).split(",")[1]);
      lector.onerror = () => rechazar(new Error("No se pudo leer el archivo " + archivo.name));
      lector.readAsDataURL(archivo);
    });

  async function llamarApi(datos) {
    // Sin cabeceras: el navegador lo envía como text/plain y Google Apps Script lo acepta sin bloqueo CORS.
    const respuesta = await fetch(CONFIG.endpoint, { method: "POST", body: JSON.stringify(datos) });
    const json = await respuesta.json();
    if (!json.ok) throw new Error(json.error || "Error desconocido");
    return json;
  }

  function progreso(texto, porcentaje) {
    $("#envio-texto").textContent = texto;
    $("#envio-barra").value = porcentaje;
  }

  const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

  async function enviar(participante, lista) {
    if (modoPrueba) {
      for (let i = 0; i < lista.length; i++) {
        progreso(`Enviando fotografía ${i + 1} de ${lista.length}…`, ((i + 1) / (lista.length + 1)) * 100);
        await esperar(500);
      }
      return "PRUEBA";
    }

    progreso("Registrando tus datos…", 5);
    const registro = await llamarApi({ action: "register", participante, total: lista.length });
    const { codigo, token } = registro;

    for (let i = 0; i < lista.length; i++) {
      const x = lista[i];
      progreso(`Enviando fotografía ${i + 1} de ${lista.length}…`, 5 + (i / lista.length) * 90);
      await llamarApi({
        action: "upload",
        codigo,
        token,
        indice: i + 1,
        certamen: x.certamen,
        categoria: x.categoria,
        especial: x.especial,
        titulo: x.titulo,
        descripcion: x.descripcion,
        nombreArchivo: x.archivo.name,
        data: await aBase64(x.archivo),
      });
    }

    progreso("Terminando…", 97);
    await llamarApi({ action: "finalize", codigo, token });
    return codigo;
  }

  function mostrarConfirmacion(codigo, total, email) {
    formulario.hidden = true;
    $("#aviso-prueba").hidden = true;
    const confirmacion = $("#enviado");
    $("#enviado-codigo").textContent = codigo;
    $("#enviado-resumen").textContent =
      `Hemos recibido ${total} ${total === 1 ? "fotografía" : "fotografías"}. ` +
      (modoPrueba
        ? "En modo de prueba no se envía ningún correo."
        : `Te llegará un correo de confirmación a ${email}. Si no lo ves en unos minutos, revisa la carpeta de correo no deseado.`);
    confirmacion.hidden = false;
    confirmacion.focus();
  }

  function enlaceCorreo() {
    const enlace = document.createElement("a");
    enlace.href = `mailto:${CONFIG.email}`;
    enlace.textContent = CONFIG.email;
    return enlace;
  }

  async function alEnviar(evento) {
    evento.preventDefault();

    const errores = validar();
    if (errores.length) {
      mostrarErrores(["Revisa estos puntos antes de enviar:"], errores);
      return;
    }
    cajaErrores.hidden = true;
    if ($("#web").value) return; // trampa anti-spam

    const participante = {
      nombre: $("#nombre").value.trim(),
      apellidos: $("#apellidos").value.trim(),
      email: $("#email").value.trim(),
      telefono: $("#telefono").value.trim(),
      localidad: $("#localidad").value.trim(),
      socio: casillaSocio.checked,
      numSocio: $("#numSocio").value.trim(),
      novedades: $("#d-news").checked,
    };
    const lista = fotos.map((foto) => ({
      archivo: foto.archivo,
      certamen: foto.campos.certamen.value,
      categoria: foto.campos.categoria.value,
      especial: !!foto.campos.especial?.checked && foto.campos.certamen.value === "etno",
      titulo: valor(foto, "titulo"),
      descripcion: valor(foto, "descripcion"),
    }));

    const botonEnviar = $("#enviar");
    botonEnviar.disabled = true;
    $("#envio").hidden = false;

    try {
      const codigo = await enviar(participante, lista);
      progreso("Enviado", 100);
      mostrarConfirmacion(codigo, lista.length, participante.email);
    } catch (error) {
      $("#envio").hidden = true;
      botonEnviar.disabled = false;
      mostrarErrores([
        `No se ha podido completar el envío: ${error.message}. Comprueba tu conexión y vuelve a intentarlo. Si el problema continúa, escribe a `,
        enlaceCorreo(),
        ".",
      ]);
    }
  }

  /* =====================================================================
     Arranque
     ===================================================================== */

  $("#aviso-prueba").hidden = !modoPrueba;
  formulario.hidden = false;
  botonAnadir.addEventListener("click", anadirFoto);
  casillaSocio.addEventListener("change", () => {
    $("#socio-num").hidden = !casillaSocio.checked;
    fotos.forEach((foto) => rellenarCategorias(foto.campos.categoria, foto.campos.certamen.value));
  });
  formulario.addEventListener("submit", alEnviar);
  anadirFoto();
})();
