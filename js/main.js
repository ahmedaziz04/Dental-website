/* ================================================================
   main.js  –  Doctor Dentiste (Login & Sign Up)
   Animations communes aux deux pages
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

  /* ──────────────────────────────────────────────
     1. ANIMATION D'INTRO SÉQUENTIELLE
  ─────────────────────────────────────────────── */
  const introItems = [
    { el: qs('.site-header'),     delay: 0,   from: 'top' },
    { el: qs('.tagline-section'), delay: 280, from: 'left' },
    { el: qs('.login-card'),      delay: 520, from: 'right' },
    { el: qs('.site-footer'),     delay: 760, from: 'bottom' },
  ];

  introItems.forEach(({ el, delay, from }) => {
    if (!el) return;
    Object.assign(el.style, {
      opacity: '0',
      transform: offsetFor(from),
      transition: 'none',
    });
    setTimeout(() => {
      el.style.transition = 'opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1)';
      el.style.opacity    = '1';
      el.style.transform  = 'translate(0,0)';
    }, delay + 80);
  });

  function offsetFor(dir) {
    const d = 40;
    return dir === 'top'    ? `translateY(-${d}px)` :
           dir === 'bottom' ? `translateY(${d}px)`  :
           dir === 'left'   ? `translateX(-${d}px)` :
                              `translateX(${d}px)`;
  }

  /* ──────────────────────────────────────────────
     2. CANVAS PARTICULES DORÉES
  ─────────────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-bg';
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '0',
  });
  document.body.prepend(canvas);

  ['.site-header', '.page-main', '.site-footer', '.site-nav'].forEach(s => {
    const el = qs(s);
    if (el) { el.style.position = 'relative'; el.style.zIndex = '1'; }
  });

  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = 55;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle());

  function makeParticle(fromScratch = true) {
    return {
      x:          Math.random() * (W || window.innerWidth),
      y:          fromScratch ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 10,
      r:          1 + Math.random() * 2.2,
      alpha:      0.15 + Math.random() * 0.5,
      speedY:     -(0.25 + Math.random() * 0.55),
      speedX:     (Math.random() - 0.5) * 0.3,
      wobble:     Math.random() * Math.PI * 2,
      wobbleSpeed: 0.005 + Math.random() * 0.015,
    };
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.wobble += p.wobbleSpeed;
      p.x      += p.speedX + Math.sin(p.wobble) * 0.35;
      p.y      += p.speedY;

      if (p.y < -10) particles[i] = makeParticle(false);

      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
      grd.addColorStop(0,   `rgba(245, 210, 80, ${p.alpha})`);
      grd.addColorStop(0.5, `rgba(184, 149, 42, ${p.alpha * 0.6})`);
      grd.addColorStop(1,   `rgba(184, 149, 42, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ──────────────────────────────────────────────
     3. SHIMMER ANIMÉ SUR LA CARTE
  ─────────────────────────────────────────────── */
  const card = qs('.login-card');
  if (card) {
    const shimmer = document.createElement('div');
    shimmer.className = 'card-shimmer';
    card.style.position = 'relative';
    card.style.overflow  = 'hidden';
    card.prepend(shimmer);
  }

  /* ──────────────────────────────────────────────
     4. ÉCRITURE LETTRE PAR LETTRE DU TITRE
  ─────────────────────────────────────────────── */
  const cardTitle = qs('.card-title');
  if (cardTitle) {
    const text = cardTitle.textContent.trim();
    cardTitle.textContent = '';
    cardTitle.style.visibility = 'visible';

    let i = 0;
    const typeSpeed  = 90;
    const startDelay = 700;

    setTimeout(function type() {
      if (i <= text.length) {
        cardTitle.textContent = text.slice(0, i);
        i++;
        setTimeout(type, typeSpeed);
      }
    }, startDelay);
  }

  /* ──────────────────────────────────────────────
     5. FOCUS CHAMPS : surbrillance dorée
  ─────────────────────────────────────────────── */
  qsa('.field-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transition = 'box-shadow 0.3s ease, background 0.3s ease';
      input.style.boxShadow  = '0 0 0 2.5px #B8952A, 0 0 18px rgba(184,149,42,0.35)';
      input.style.background = '#e8e2d4';
    });
    input.addEventListener('blur', () => {
      input.style.boxShadow  = 'none';
      input.style.background = '';
    });
  });

  /* ──────────────────────────────────────────────
     6. RIPPLE AU CLIC — boutons communs
  ─────────────────────────────────────────────── */
  function addRipple(btn) {
    if (!btn) return;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 1.6;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position:      'absolute',
        width:          size + 'px',
        height:         size + 'px',
        left:           x + 'px',
        top:            y + 'px',
        background:    'rgba(184,149,42,0.35)',
        borderRadius:  '50%',
        transform:     'scale(0)',
        animation:     'rippleAnim 0.55s ease-out forwards',
        pointerEvents: 'none',
      });

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // Exposer addRipple pour les fichiers spécifiques
  window.addRipple = addRipple;

  /* ──────────────────────────────────────────────
     7. LOGO DENT : rotation douce en boucle
  ─────────────────────────────────────────────── */
  const tooth = qs('.tooth-icon');
  if (tooth) {
    let angle = 0;
    let dir   = 1;

    function rotateTooth() {
      angle += dir * 0.009;
      if (angle > 0.05 || angle < -0.05) dir *= -1;
      tooth.style.transform = `rotate(${angle}rad)`;
      requestAnimationFrame(rotateTooth);
    }
    setTimeout(rotateTooth, 1200);

    tooth.parentElement.addEventListener('mouseenter', () => {
      tooth.style.transition = 'filter 0.3s ease, transform 0.3s ease';
      tooth.style.filter     = 'drop-shadow(0 0 12px rgba(245,210,80,0.9))';
    });
    tooth.parentElement.addEventListener('mouseleave', () => {
      tooth.style.filter = 'drop-shadow(0 2px 6px rgba(184,149,42,0.35))';
    });
  }

  /* ──────────────────────────────────────────────
     8. CURSEUR PERSONNALISÉ
  ─────────────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  const hoverTargets = 'a, button, input, label, .tooth-icon';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('cursor-hover');
  });

  /* ──────────────────────────────────────────────
     9. ANIMATION TAGLINE : mot par mot
  ─────────────────────────────────────────────── */
  const tagline = qs('.tagline');
  if (tagline) {
    setTimeout(() => {
      const html    = tagline.innerHTML;
      const wrapped = html.replace(/(\w[\w,.']*)/g, w => `<span class="word-reveal">${w}</span>`);
      tagline.innerHTML = wrapped;

      qsa('.word-reveal').forEach((span, idx) => {
        span.style.opacity    = '0';
        span.style.transform  = 'translateY(14px)';
        span.style.display    = 'inline-block';
        span.style.transition = `opacity 0.45s ease ${idx * 80}ms, transform 0.45s ease ${idx * 80}ms`;
        requestAnimationFrame(() => {
          span.style.opacity   = '1';
          span.style.transform = 'translateY(0)';
        });
      });
    }, 400);
  }

});