/* =====================================================================
   VISOR DE FOTOGRAFÍAS AMPLIADAS
   ---------------------------------------------------------------------
   Cualquier <button data-img="ruta.jpg" data-cap="Pie de foto"> de la
   página abre la imagen en el <dialog id="lightbox">. El botón «Cerrar»
   funciona sin JavaScript (form method="dialog"); aquí solo se añade el
   cierre al pulsar fuera de la imagen.
   Requiere js/lib/utilidades.js.
   ===================================================================== */

(() => {
  const dialogo = document.getElementById("lightbox");
  if (!dialogo) return;

  const figura = $("figure", dialogo);
  const pie = $("figcaption", dialogo);
  const imagen = document.createElement("img");
  figura.prepend(imagen);

  function abrir(boton) {
    imagen.src = boton.dataset.img;
    imagen.alt = $("img", boton)?.alt || "";
    pie.textContent = boton.dataset.cap || "";
    dialogo.showModal();
  }

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-img]");
    if (boton) abrir(boton);
  });

  // Un clic en el fondo oscuro (fuera de la imagen) cierra el visor.
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
})();
