/* ================================================================
   signup.js  –  Doctor Dentiste (Sign Up uniquement)
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const qs = s => document.querySelector(s);

  // Ripple sur le bouton exclusif à signup
  addRipple(qs('.btn-signup'));
});