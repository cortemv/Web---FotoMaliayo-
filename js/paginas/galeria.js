/* =====================================================================
   PÁGINA: galería de fotografías (galeria.html)
   ---------------------------------------------------------------------
   Muestra las fotografías de js/datos/galeria.js en una rejilla. Cada
   foto se abre ampliada en el visor (js/componentes/lightbox.js).
   Mientras la lista esté vacía, se muestra el aviso «Próximamente».
   La estructura de cada foto está en el <template> de galeria.html.
   ===================================================================== */

(() => {
  function crearFoto(foto) {
    const figura = clonarPlantilla("tpl-foto").firstElementChild;
    const boton = $("button", figura);
    const imagen = $("img", boton);

    imagen.src = foto.mini || foto.img;
    imagen.alt = foto.alt || foto.pie || "";
    boton.dataset.img = foto.img;
    boton.dataset.cap = foto.pie || "";

    const pie = $("figcaption", figura);
    if (foto.pie) pie.textContent = foto.pie;
    else pie.remove();

    return figura;
  }

  function mostrarGaleria() {
    const vacia = GALERIA.length === 0;
    $("#galeria-vacia").hidden = !vacia;
    $("#galeria").hidden = vacia;
    $("#galeria").replaceChildren(...GALERIA.map(crearFoto));
  }

  mostrarGaleria();
})();
