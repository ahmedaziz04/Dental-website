/* ================================================================
   signup.js  –  Doctor Dentiste (Sign Up uniquement)
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const qs = s => document.querySelector(s);

  // Ripple sur le bouton exclusif à signup
  addRipple(qs('.btn-signup'));

  /* ── Auto-focus : JJ → MM → AAAA ── */
  const dayInput  = document.getElementById('dateDay');
  const monInput  = document.getElementById('dateMonth');
  const yearInput = document.getElementById('dateYear');

  dayInput?.addEventListener('input', () => {
    if (dayInput.value.length >= 2) monInput?.focus();
  });

  monInput?.addEventListener('input', () => {
    if (monInput.value.length >= 2) yearInput?.focus();
  });
});