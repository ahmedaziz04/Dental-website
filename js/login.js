/* ================================================================
   login.js  –  Doctor Dentiste (Login uniquement)
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const qs = s => document.querySelector(s);

  // Ripple sur les boutons exclusifs à login
  addRipple(qs('.btn-connect'));
  addRipple(qs('.btn-forgot'));
});