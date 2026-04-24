/* ================================================================
   forgot.js  –  Récupération de mot de passe (3 étapes)

   ÉTAPE 1 : Saisie prénom + nom + e-mail  → envoi code fictif
   ÉTAPE 2 : Vérification du code à 6 chiffres
   ÉTAPE 3 : Nouveau mot de passe + confirmation → redirect login

   NOTE : En production, remplacez les appels simulés par vos
   vraies requêtes fetch() vers votre back-end / API.
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Raccourcis ── */
  const qs  = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];

  /* ── Références étapes ── */
  const steps  = qsa('.forgot-step');
  const dots   = [qs('#dot-1'),  qs('#dot-2'),  qs('#dot-3')];
  const lines  = [qs('#line-1'), qs('#line-2')];
  let currentStep = 1;

  /* ── Stockage temporaire session (en mémoire — pas de localStorage) ── */
  let userData   = { name: '', surname: '', email: '' };
  let verifyCode = '';     // code généré côté client (simulation)

  /* ================================================================
     NAVIGATION ENTRE ÉTAPES
  ================================================================ */
  function goToStep(n) {
    /* Masquer l'étape courante */
    const fromEl = qs(`#step-${currentStep}`);
    if (fromEl) fromEl.classList.add('hidden');
    if (qs('#step-success')) qs('#step-success').classList.add('hidden');

    /* Marquer l'étape actuelle comme "done", activer la suivante */
    if (n > currentStep) {
      dots[currentStep - 1].classList.remove('active');
      dots[currentStep - 1].classList.add('done');
      if (lines[currentStep - 1]) lines[currentStep - 1].classList.add('active');
    }

    currentStep = n;

    /* Afficher la nouvelle étape ou l'écran succès */
    const toEl = n === 'success' ? qs('#step-success') : qs(`#step-${n}`);
    if (toEl) {
      toEl.classList.remove('hidden');
      void toEl.offsetWidth; /* force reflow pour l'animation CSS */
    }

    if (n !== 'success' && n <= 3) {
      dots[n - 1].classList.add('active');
    }
  }

  /* ================================================================
     UTILITAIRES UI
  ================================================================ */

  /* Affiche / masque un message d'erreur */
  function showError(id, msg) {
    const el = qs(`#error-${id}`);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function clearError(id) {
    const el = qs(`#error-${id}`);
    if (el) { el.hidden = true; el.textContent = ''; }
  }

  /* Validation e-mail simple */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  /* ================================================================
     ÉTAPE 1 — Validation identité + envoi code simulé
  ================================================================ */
  const btnSend = qs('#btn-send-code');

  if (btnSend) {
    addRipple(btnSend);

    btnSend.addEventListener('click', async () => {
      clearError(1);

      const name    = qs('#f-name').value.trim();
      const surname = qs('#f-surname').value.trim();
      const email   = qs('#f-email').value.trim();

      /* — Validation — */
      if (!name || !surname) {
        showError(1, 'Veuillez saisir votre prénom et votre nom.');
        shakeCard();
        return;
      }
      if (!isValidEmail(email)) {
        showError(1, 'Adresse e-mail invalide.');
        shakeCard();
        return;
      }

      /* — Simulation envoi — */
      userData = { name, surname, email };
      setLoading(btnSend, true);

      await simulateSend(1200);   /* ← remplacez par votre fetch() */

      /* Code fictif à 6 chiffres (en prod : généré côté serveur) */
      verifyCode = String(Math.floor(100000 + Math.random() * 900000));

      /* Affiche le code dans la console pour les tests */
      console.info(`%c[DentalHub] Code de vérification (simulation) : ${verifyCode}`, 'color:#B8952A;font-weight:700;font-size:1.1em');

      setLoading(btnSend, false);

      /* Affiche l'e-mail masqué dans le badge */
      qs('#display-email').textContent = maskEmail(email);

      goToStep(2);
      startResendTimer();

      /* Focus sur le premier champ du code */
      setTimeout(() => {
        const first = qs('.code-digit');
        if (first) first.focus();
      }, 200);
    });
  }

  /* ================================================================
     ÉTAPE 2 — Vérification code à 6 chiffres
  ================================================================ */

  /* Navigation auto entre cases */
  const digitInputs = qsa('.code-digit');

  digitInputs.forEach((inp, idx) => {
    inp.addEventListener('input', e => {
      inp.value = inp.value.replace(/[^0-9]/g, '').slice(-1);
      if (inp.value) {
        inp.classList.add('filled');
        const next = digitInputs[idx + 1];
        if (next) next.focus();
      } else {
        inp.classList.remove('filled');
      }
    });

    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value) {
        const prev = digitInputs[idx - 1];
        if (prev) { prev.value = ''; prev.classList.remove('filled'); prev.focus(); }
      }
    });

    /* Coller un code complet depuis le presse-papiers */
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (pasted.length >= 6) {
        digitInputs.forEach((d, i) => {
          d.value = pasted[i] || '';
          d.classList.toggle('filled', !!d.value);
        });
        digitInputs[5].focus();
      }
    });
  });

  const btnVerify = qs('#btn-verify-code');
  if (btnVerify) {
    addRipple(btnVerify);

    btnVerify.addEventListener('click', async () => {
      clearError(2);

      const entered = digitInputs.map(d => d.value).join('');

      if (entered.length < 6) {
        showError(2, 'Veuillez saisir les 6 chiffres du code.');
        return;
      }

      setLoading(btnVerify, true);
      await simulateSend(800);

      if (entered !== verifyCode) {
        setLoading(btnVerify, false);
        digitInputs.forEach(d => { d.classList.add('error'); d.value = ''; d.classList.remove('filled'); });
        setTimeout(() => digitInputs.forEach(d => d.classList.remove('error')), 600);
        showError(2, 'Code incorrect. Vérifiez votre e-mail et réessayez.');
        digitInputs[0].focus();
        return;
      }

      setLoading(btnVerify, false);
      goToStep(3);

      setTimeout(() => {
        const np = qs('#f-newpass');
        if (np) np.focus();
      }, 200);
    });
  }

  /* ── Timer renvoi ── */
  let resendInterval;

  function startResendTimer() {
    const btn   = qs('#btn-resend');
    const timer = qs('#resend-timer');
    if (!btn || !timer) return;

    let secs = 30;
    btn.disabled = true;
    timer.textContent = `(${secs}s)`;

    clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      secs--;
      timer.textContent = `(${secs}s)`;
      if (secs <= 0) {
        clearInterval(resendInterval);
        btn.disabled = false;
        timer.textContent = '';
      }
    }, 1000);
  }

  const btnResend = qs('#btn-resend');
  if (btnResend) {
    btnResend.addEventListener('click', async () => {
      verifyCode = String(Math.floor(100000 + Math.random() * 900000));
      console.info(`%c[DentalHub] Nouveau code (simulation) : ${verifyCode}`, 'color:#B8952A;font-weight:700;font-size:1.1em');
      digitInputs.forEach(d => { d.value = ''; d.classList.remove('filled', 'error'); });
      digitInputs[0].focus();
      startResendTimer();
    });
  }

  /* ================================================================
     ÉTAPE 3 — Nouveau mot de passe
  ================================================================ */

  /* Boutons œil */
  qsa('.btn-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = qs(`#${btn.dataset.target}`);
      if (!target) return;
      const isPass = target.type === 'password';
      target.type = isPass ? 'text' : 'password';
      /* Bascule l'icône (œil ouvert / barré) */
      const icon = btn.querySelector('.eye-icon');
      if (icon) {
        icon.innerHTML = isPass
          ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
          : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      }
    });
  });

  /* Barre de force du mot de passe */
  const newPassInput = qs('#f-newpass');
  const confirmInput = qs('#f-confirm');
  const strengthFill = qs('#strength-fill');
  const strengthLbl  = qs('#strength-label');
  const matchHint    = qs('#match-hint');

  if (newPassInput) {
    newPassInput.addEventListener('input', () => {
      const s = scorePassword(newPassInput.value);
      applyStrength(s);
      checkMatch();
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener('input', checkMatch);
  }

  function scorePassword(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; /* 0 – 5 */
  }

  function applyStrength(score) {
    if (!strengthFill || !strengthLbl) return;
    const configs = [
      { w: '0%',   color: 'transparent',                     lbl: '—',        lblColor: 'rgba(240,230,204,0.3)'  },
      { w: '20%',  color: '#e05555',                          lbl: 'Très faible', lblColor: '#e05555'              },
      { w: '40%',  color: '#e07b30',                          lbl: 'Faible',    lblColor: '#e07b30'               },
      { w: '60%',  color: '#d4b800',                          lbl: 'Moyen',     lblColor: '#d4b800'               },
      { w: '80%',  color: '#7bc97b',                          lbl: 'Fort',      lblColor: '#7bc97b'               },
      { w: '100%', color: 'linear-gradient(90deg,#B8952A,#f5d87a)', lbl: 'Excellent', lblColor: '#f5d87a'        },
    ];
    const c = configs[score] || configs[0];
    strengthFill.style.width      = c.w;
    strengthFill.style.background = c.color;
    strengthLbl.textContent       = c.lbl;
    strengthLbl.style.color       = c.lblColor;
  }

  function checkMatch() {
    if (!matchHint || !newPassInput || !confirmInput) return;
    if (!confirmInput.value) { matchHint.textContent = ''; return; }
    if (newPassInput.value === confirmInput.value) {
      matchHint.textContent = '✓ Les mots de passe correspondent.';
      matchHint.style.color = '#7bc97b';
    } else {
      matchHint.textContent = '✗ Les mots de passe ne correspondent pas.';
      matchHint.style.color = '#e05555';
    }
  }

  const btnSavePass = qs('#btn-save-pass');
  if (btnSavePass) {
    addRipple(btnSavePass);

    btnSavePass.addEventListener('click', async () => {
      clearError(3);

      const np = qs('#f-newpass').value;
      const nc = qs('#f-confirm').value;

      if (scorePassword(np) < 2) {
        showError(3, 'Mot de passe trop faible. Minimum 8 caractères avec majuscule et chiffre.');
        shakeCard();
        return;
      }
      if (np !== nc) {
        showError(3, 'Les mots de passe ne correspondent pas.');
        shakeCard();
        return;
      }

      setLoading(btnSavePass, true);

      /* ← En production : envoyez np + token au serveur via fetch() */
      await simulateSend(1000);

      setLoading(btnSavePass, false);

      /* Marquer dot 3 comme done */
      dots[2].classList.remove('active');
      dots[2].classList.add('done');

      goToStep('success');
      startRedirectCountdown();
    });
  }

  /* ================================================================
     SUCCÈS : compte à rebours + redirection
  ================================================================ */
  function startRedirectCountdown() {
    const countEl = qs('#redirect-count');
    let n = 5;
    const iv = setInterval(() => {
      n--;
      if (countEl) countEl.textContent = n;
      if (n <= 0) {
        clearInterval(iv);
        window.location.href = 'login.html';
      }
    }, 1000);
  }

  /* ================================================================
     HELPERS
  ================================================================ */

  /* Simuler un délai réseau */
  function simulateSend(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  /* Masquer partiellement l'e-mail  ex: j***e@gmail.com */
  function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 4))}${local.slice(-1)}@${domain}`;
  }

  /* Spinner sur bouton */
  function setLoading(btn, loading) {
    const textSpan    = btn.querySelector('.btn-text');
    const spinnerSpan = btn.querySelector('.btn-spinner');
    btn.disabled = loading;
    if (textSpan)    textSpan.hidden    = loading;
    if (spinnerSpan) spinnerSpan.hidden = !loading;
    btn.style.opacity = loading ? '0.75' : '1';
  }

  /* Animation secousse de la carte */
  function shakeCard() {
    const card = qs('.forgot-card');
    if (!card) return;
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'cardShake 0.4s ease';
    card.addEventListener('animationend', () => { card.style.animation = ''; }, { once: true });
  }

  /* Injecter le keyframe shake si pas déjà dans le CSS */
  if (!qs('#forgot-keyframes')) {
    const style = document.createElement('style');
    style.id = 'forgot-keyframes';
    style.textContent = `
      @keyframes cardShake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(6px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

  /* Ripple sur btn (main.js l'expose via window.addRipple) */
  /* Appelé après que main.js l'ait défini */

});