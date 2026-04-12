/* BookNotes – app.js */

(function () {
  'use strict';

  /* ── Star Rating Widget ─────────────────────────────────────── */
  const starInput   = document.getElementById('starInput');
  const ratingInput = document.getElementById('ratingInput');
  const ratingDisplay = document.getElementById('ratingDisplay');
  const ratingDenom   = document.querySelector('.rating-readout-denom');

  if (starInput && ratingInput) {
    const stars = Array.from(starInput.querySelectorAll('.star-btn'));
    let currentRating = parseInt(ratingInput.value) || 0;

    function paintStars(n) {
      stars.forEach((s, i) => s.classList.toggle('lit', i < n));
    }

    function setRating(n) {
      currentRating = n;
      ratingInput.value = n;
      ratingDisplay.textContent = n;
      if (ratingDenom) ratingDenom.textContent = '/ 10';
      paintStars(n);
    }

    // Init
    if (currentRating) {
      paintStars(currentRating);
    }

    stars.forEach((star, idx) => {
      star.addEventListener('mouseenter', () => paintStars(idx + 1));
      star.addEventListener('mouseleave', () => paintStars(currentRating));
      star.addEventListener('click', () => setRating(idx + 1));
      star.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRating(idx + 1); }
      });
    });
  }

  /* ── Textarea char counter ──────────────────────────────────── */
  const notesArea  = document.getElementById('notes');
  const charCount  = document.getElementById('charCount');

  if (notesArea && charCount) {
    function updateCount() {
      const n = notesArea.value.length;
      charCount.textContent = n > 0 ? `${n} chars` : '';
    }
    notesArea.addEventListener('input', updateCount);
    updateCount();
  }

  /* ── Smooth delete confirmation via cards ───────────────────── */
  document.querySelectorAll('.card-delete-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      const card = this.closest('.book-card');
      const title = card ? card.querySelector('.card-title a')?.textContent : 'this book';
      if (!confirm(`Delete \u201c${title}\u201d permanently?`)) {
        e.preventDefault();
      } else if (card) {
        card.style.transition = 'opacity .25s, transform .25s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });
  });

  /* ── Input focus line animation ─────────────────────────────── */
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
      this.closest('.form-group')?.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.closest('.form-group')?.classList.remove('focused');
    });
  });

  /* ── Card hover: show cover shimmer ─────────────────────────── */
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.zIndex = '2';
    });
    card.addEventListener('mouseleave', function () {
      this.style.zIndex = '';
    });
  });

})();
