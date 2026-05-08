/* =============================================================================
   Tooltip portaleado — un único helper que se monta en <body> al cargar.
   Cualquier elemento con `data-tooltip="texto"` muestra una bubble flotante
   al hover/focus. El tooltip vive en <body> con position: fixed, así que
   escapa de overflow:hidden y stacking contexts (como .sidebar__nav).
   ========================================================================== */

let _instalado = false;
let _bubble = null;
let _activo = null;

const crearBubble = () => {
  const b = document.createElement('div');
  b.className = 'tooltip-portal';
  b.setAttribute('role', 'tooltip');
  b.setAttribute('aria-hidden', 'true');
  document.body.appendChild(b);
  return b;
};

const mostrar = (el) => {
  const texto = el.getAttribute('data-tooltip');
  if (!texto) return;
  if (!_bubble) _bubble = crearBubble();
  _bubble.textContent = texto;
  _bubble.dataset.placement = el.getAttribute('data-tooltip-placement') || 'right';
  _bubble.classList.add('is-visible');
  posicionar(el);
  _activo = el;
};

const ocultar = () => {
  if (!_bubble) return;
  _bubble.classList.remove('is-visible');
  _activo = null;
};

const posicionar = (el) => {
  if (!_bubble || !el) return;
  const placement = _bubble.dataset.placement;
  const r = el.getBoundingClientRect();
  const w = _bubble.offsetWidth;
  const h = _bubble.offsetHeight;
  const margen = 8;
  let top = 0, left = 0;
  if (placement === 'right') {
    left = r.right + margen;
    top  = r.top + (r.height - h) / 2;
  } else if (placement === 'left') {
    left = r.left - w - margen;
    top  = r.top + (r.height - h) / 2;
  } else if (placement === 'top') {
    top  = r.top - h - margen;
    left = r.left + (r.width - w) / 2;
  } else { // 'bottom'
    top  = r.bottom + margen;
    left = r.left + (r.width - w) / 2;
  }
  // Clamp dentro del viewport
  const vw = window.innerWidth, vh = window.innerHeight;
  left = Math.max(margen, Math.min(left, vw - w - margen));
  top  = Math.max(margen, Math.min(top,  vh - h - margen));
  _bubble.style.top = `${top}px`;
  _bubble.style.left = `${left}px`;
};

const elementoTooltipEnTarget = (target) => {
  if (!(target instanceof Element)) return null;
  const el = target.closest('[data-tooltip]');
  if (!el) return null;
  // Si el padre dice que NO mostrar tooltip (p.ej. dropdown abierto), respeta.
  if (el.getAttribute('data-tooltip-suprimido') === 'true') return null;
  // data-tooltip-when="<selector>" → sólo mostrar si un ancestro coincide.
  const condicion = el.getAttribute('data-tooltip-when');
  if (condicion && !el.closest(condicion)) return null;
  return el;
};

export const instalarTooltipPortal = () => {
  if (_instalado || typeof document === 'undefined') return;
  _instalado = true;

  document.addEventListener('mouseover', (e) => {
    const el = elementoTooltipEnTarget(e.target);
    if (!el) { if (_activo) ocultar(); return; }
    if (el === _activo) return;
    mostrar(el);
  }, true);

  document.addEventListener('mouseout', (e) => {
    const el = elementoTooltipEnTarget(e.target);
    if (!el) return;
    // Si el cursor sale del elemento sin entrar en un hijo del mismo, oculta
    const relacionado = e.relatedTarget;
    if (!relacionado || !el.contains(relacionado)) ocultar();
  }, true);

  document.addEventListener('focusin', (e) => {
    const el = elementoTooltipEnTarget(e.target);
    if (el) mostrar(el);
  });
  document.addEventListener('focusout', (e) => {
    const el = elementoTooltipEnTarget(e.target);
    if (el) ocultar();
  });

  window.addEventListener('scroll', () => { if (_activo) posicionar(_activo); }, true);
  window.addEventListener('resize', () => { if (_activo) posicionar(_activo); });
};
