/* =========================================================
   CONFIGURACIÓN — edita aquí fotos, proyectos y WhatsApp.
   Las fotos van en la carpeta "Imagenes" junto al sitio.
   ========================================================= */
const W  = "Imagenes/Web/";        // fotos optimizadas para la web
const WT = "Imagenes/Web/thumb/";  // miniaturas pequeñas (mismo nombre de archivo)
const IMAGENES = {
  hero:                  "Imagenes/Portada/hero-web.jpg",
  servicioDiseno:        W + "countryclub3.jpg",
  servicioInstalacion:   W + "countryclub6.jpg",
  servicioRiego:         W + "altaplaza2.jpg",
  servicioMantenimiento: W + "countryclub4.jpg",
  nosotros:              W + "countryclub14.jpg",
  contacto:              W + "Contacto.jpg",
  altaplaza1:            W + "altaplaza3.jpg",
  countryclub1:          W + "countryclub5.jpg",
  metromall1:            W + "metromall1.jpg",
  golfgarden1:           W + "golfgarden1.jpg"
};

/* Proyectos del portafolio: la primera foto es la portada del proyecto */
const PROYECTOS = {
  altaplaza: {
    titulo: "Altaplaza",
    desc: "Diseño, instalación y mantenimiento de áreas verdes en un entorno comercial de alto tránsito.",
    fotos: ["altaplaza4","altaplaza3","altaplaza2","altaplaza5","altaplaza1"]
  },
  countryclub: {
    titulo: "Country Club",
    desc: "Cuidado integral de jardines y áreas recreativas, con céspedes y plantas ornamentales impecables todo el año.",
    fotos: ["countryclub5","countryclub3","countryclub14","countryclub1","countryclub2","countryclub11",
            "countryclub6","countryclub4","countryclub10","countryclub9","countryclub8"]
  },
  metromall: {
    titulo: "Metromall",
    desc: "Jardinería y mantenimiento de áreas verdes en un centro comercial de alto tránsito, con palmas y plantas ornamentales siempre impecables.",
    fotos: Array.from({length:12}, (_,i) => "metromall" + (i+1))
  },
  golfgarden: {
    titulo: "Golf Gardens",
    desc: "Diseño y cuidado de jardines, setos y palmas en áreas exteriores, con espacios verdes vivos y bien mantenidos.",
    fotos: Array.from({length:11}, (_,i) => "golfgarden" + (i+1))
  }
};

const WHATSAPP = "5076514-5580";
const CORREO   = "Anamata2203@hotmail.com";
/* ========================================================= */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---- Enlaces de contacto (WhatsApp / correo) ----
   Van primero y en su propio bloque: si algo más abajo falla,
   estos ya quedaron funcionando con el número/correo reales. */
try {
  const waMsg = 'Hola Garden Jireh, me gustaría cotizar un proyecto para mi espacio.';
  const mailBody = 'Hola Garden Jireh,\n\nMe gustaría cotizar un proyecto.\n\nNombre:\nTeléfono:\nUbicación:\nServicio que necesito:\nDetalles:\n';
  $('#waBtn').href = `https://wa.me/${WHATSAPP.replace(/\D/g,'')}?text=${encodeURIComponent(waMsg)}`;
  $('#mailBtn').href = `mailto:${CORREO}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(mailBody)}`;
} catch (e) { console.error('Contacto:', e); }

/* ---- Imágenes principales ----
   El HTML ya trae una foto real en cada src (funciona sin JS).
   Esto solo las confirma/actualiza desde un único lugar. */
try {
  function setImg(el, src){
    if (!src) return;
    el.onerror = () => el.classList.add('missing');
    el.src = src;
  }
  $$('img[data-img]').forEach(el => setImg(el, IMAGENES[el.dataset.img]));
} catch (e) { console.error('Imágenes:', e); }

/* ---- Aparición al hacer scroll (mejora progresiva) ----
   Los elementos .reveal son visibles por defecto (ver CSS).
   Solo si el observador arranca bien los ocultamos y animamos. */
try {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.1});
  document.documentElement.classList.add('js-ready');
  $$('.reveal').forEach(el => io.observe(el));
  if (reduceMotion) $$('.reveal').forEach(el => el.classList.add('in'));
} catch (e) {
  // Si algo falla a medio registrar los elementos, no dejamos nada
  // oculto: se quita js-ready y se fuerza visible todo lo demás.
  console.error('Aparición al scroll:', e);
  document.documentElement.classList.remove('js-ready');
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* ---- Carrusel del proyecto destacado ---- */
try {
  const keys = Object.keys(PROYECTOS);
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  let fi = 0, shownKey = keys[0], timer = null, paused = mqReduce.matches;
  const pad = n => String(n).padStart(2,'0');
  const pauseBtn = $('#featPause');
  const featCard = $('#featCard');

  $('#featTotal').textContent = pad(keys.length);

  function syncPauseButton(){
    if (!pauseBtn) return;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Reanudar carrusel de proyectos' : 'Pausar carrusel de proyectos');
  }

  function renderFeat(i){
    const instant = mqReduce.matches;
    featCard.style.opacity = instant ? 1 : 0;
    setTimeout(() => {
      const key = keys[i];
      const p = PROYECTOS[key];
      shownKey = key; // se actualiza junto con lo que el usuario ve, no antes
      $('#featTitle').textContent = p.titulo;
      $('#featImg').src = WT + p.fotos[0] + '.jpg';
      $('#featImg').alt = 'Proyecto ' + p.titulo;
      featCard.setAttribute('aria-label', 'Ver proyecto destacado: ' + p.titulo);
      $('#featNum').textContent = pad(i+1);
      $('#featBar').style.width = ((i+1)/keys.length*100) + '%';
      featCard.style.opacity = 1;
    }, instant ? 0 : 300);
  }
  function tick(){ fi = (fi+1) % keys.length; renderFeat(fi); }
  function play(){
    // Reducir movimiento evita el autoplay por defecto, pero un clic
    // explícito en "Reanudar" es una acción a propósito del usuario y sí
    // se respeta (el cambio de contenido queda sin animación igual).
    if (paused) return;
    clearInterval(timer);
    timer = setInterval(tick, 5000);
  }
  function setPaused(v){
    paused = v;
    syncPauseButton();
    if (v) clearInterval(timer); else play();
  }
  renderFeat(0);
  syncPauseButton();
  play();
  mqReduce.addEventListener('change', e => { if (e.matches) setPaused(true); });
  if (pauseBtn) pauseBtn.addEventListener('click', () => setPaused(!paused));
  featCard.addEventListener('mouseenter', () => clearInterval(timer));
  featCard.addEventListener('mouseleave', () => { if (!paused) play(); });
  featCard.addEventListener('focusin', () => clearInterval(timer));
  featCard.addEventListener('focusout', () => { if (!paused) play(); });
  featCard.addEventListener('click', () => openGallery(shownKey));
} catch (e) { console.error('Carrusel:', e); }

/* ---- Galería (modal accesible) ---- */
let openGallery = () => {}; // se reemplaza abajo si todo carga bien; evita ReferenceError en otros bloques
try {
  const modal = $('#modal');
  const mainImg = $('#mImg');
  let gal = null, gi = 0, lastFocus = null;

  function focusablesIn(container){
    return $$('button, a[href], [tabindex]:not([tabindex="-1"])').filter(el => container.contains(el) && el.offsetParent !== null);
  }

  function buildThumbs(){
    const box = $('#mThumbs');
    box.textContent = '';
    gal.fotos.forEach((f,i) => {
      const btn = document.createElement('button');
      btn.className = 'ph';
      btn.type = 'button';
      btn.dataset.i = String(i);
      btn.setAttribute('aria-label', `Foto ${i+1} de ${gal.titulo}`);
      const img = document.createElement('img');
      img.src = WT + f + '.jpg';
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.classList.add('missing'));
      btn.appendChild(img);
      btn.addEventListener('click', () => showG(i));
      box.appendChild(btn);
    });
  }

  window.openGallery = function openGalleryImpl(key){
    const data = PROYECTOS[key];
    if (!data) return;
    gal = { titulo: data.titulo, desc: data.desc, fotos: data.fotos };
    gi = 0;
    lastFocus = document.activeElement;
    $('#mTitle').textContent = gal.titulo;
    $('#mDesc').textContent = gal.desc;
    buildThumbs();
    showG(0);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    [...document.body.children].forEach(el => { if (el !== modal) el.inert = true; });
    $('.close').focus();
  };
  openGallery = window.openGallery;

  function showG(i){
    gi = (i + gal.fotos.length) % gal.fotos.length;
    const f = gal.fotos[gi];
    mainImg.onerror = () => mainImg.classList.add('missing');
    mainImg.classList.remove('missing');
    mainImg.src = W + f + '.jpg';
    mainImg.alt = `${gal.titulo} — foto ${gi+1} de ${gal.fotos.length}`;
    $$('#mThumbs button').forEach((b,k) => {
      const on = k === gi;
      b.classList.toggle('on', on);
      if (on){ b.setAttribute('aria-current', 'true'); b.scrollIntoView({block:'nearest', inline:'center'}); }
      else b.removeAttribute('aria-current');
    });
  }

  function closeG(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
    [...document.body.children].forEach(el => { el.inert = false; });
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  $('.close').addEventListener('click', closeG);
  $('.prev').addEventListener('click', () => showG(gi-1));
  $('.next').addEventListener('click', () => showG(gi+1));
  modal.addEventListener('click', e => { if (e.target === modal) closeG(); });

  modal.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape'){ e.preventDefault(); closeG(); return; }
    if (e.key === 'ArrowLeft'){ showG(gi-1); return; }
    if (e.key === 'ArrowRight'){ showG(gi+1); return; }
    if (e.key === 'Tab'){
      const items = focusablesIn(modal);
      if (!items.length) return;
      const first = items[0], last = items[items.length-1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  $$('[data-proyecto]').forEach(c => c.addEventListener('click', e => { e.preventDefault(); openGallery(c.dataset.proyecto); }));
} catch (e) { console.error('Galería:', e); }

/* ---- Tarjetas activables con teclado (Enter/Espacio) ---- */
try {
  $$('[role="button"]').forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
  }));
} catch (e) { console.error('Teclado en tarjetas:', e); }

/* ---- Header + enlace activo ---- */
try {
  const header = $('#top');
  const links = $$('#menu a');
  const secs = links.map(a => $(a.getAttribute('href')));
  addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 40);
    let cur = 0, bestTop = -Infinity;
    secs.forEach((s,i) => {
      const top = s.getBoundingClientRect().top;
      if (top < 180 && top > bestTop){ bestTop = top; cur = i; }
    });
    const atBottom = innerHeight + scrollY >= document.body.scrollHeight - 2;
    if (atBottom) cur = links.length - 1;
    links.forEach((a,i) => a.classList.toggle('active', i === cur));
  }, {passive:true});
} catch (e) { console.error('Enlace activo:', e); }

/* ---- Menú móvil ---- */
try {
  const menu = $('#menu'), burger = $('#burger');
  const mqMobile = matchMedia('(max-width:900px)');
  // inert solo aplica en el menú fuera de pantalla (móvil); en escritorio el
  // menú siempre está visible y debe seguir siendo accesible por teclado.
  function syncInert(){ menu.inert = mqMobile.matches && !menu.classList.contains('open'); }
  function setMenu(open){
    menu.classList.toggle('open', open);
    syncInert();
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    burger.setAttribute('aria-expanded', String(open));
    if (!open && menu.contains(document.activeElement)) burger.focus();
  }
  setMenu(false);
  mqMobile.addEventListener('change', syncInert);
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
} catch (e) { console.error('Menú móvil:', e); }

/* ---- Año del footer ---- */
try { $('#year').textContent = new Date().getFullYear(); } catch (e) { console.error('Año:', e); }
