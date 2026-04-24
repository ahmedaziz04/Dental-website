/* ================================================================
   login.js  –  Doctor Dentiste (Login uniquement)
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const qs = s => document.querySelector(s);

  // Ripple sur les boutons exclusifs à login
  addRipple(qs('.btn-connect'));
  // Redirection vers login.html
  qs('.btn-forgot').addEventListener('click', () => {
    window.location.href = 'forgot.html';
  });
});