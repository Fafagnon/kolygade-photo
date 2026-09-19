// Menu mobile & Hamburger toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fermer le menu au clic sur un lien
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer le menu au clic en dehors
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target) && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  // Fermer automatiquement si redimensionnement vers desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Année automatique dans le pied de page
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Slider du Hero (défilement automatique 4 photos + boutons nav)
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const prevBtn = document.getElementById('hero-prev');
const nextBtn = document.getElementById('hero-next');
const slideLabel = document.getElementById('hero-slide-label');
const slideCurrent = document.getElementById('hero-slide-current');
const progressBar = document.querySelector('.hero-progress span');

let currentSlide = 0;
let slideInterval = null;
const SLIDE_DURATION = 5000; // 5 secondes par photo

function goToSlide(index) {
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) {
    dots[currentSlide].classList.remove('active');
    dots[currentSlide].setAttribute('aria-selected', 'false');
  }

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) {
    dots[currentSlide].classList.add('active');
    dots[currentSlide].setAttribute('aria-selected', 'true');
  }
  if (slideLabel) slideLabel.textContent = slides[currentSlide].dataset.label || '';
  if (slideCurrent) slideCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startSliderTimer() {
  stopSliderTimer();
  slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopSliderTimer() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

if (slides.length > 1) {
  startSliderTimer();

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startSliderTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startSliderTimer();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startSliderTimer();
    });
  });

  // Pause au survol et gestion du balayage tactile (swipe mobile)
  const heroFrame = document.querySelector('.hero-frame') || document.querySelector('.hero-controls');
  if (heroFrame) {
    heroFrame.addEventListener('mouseenter', stopSliderTimer);
    heroFrame.addEventListener('mouseleave', startSliderTimer);

    let touchStartX = 0;
    let touchEndX = 0;
    heroFrame.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroFrame.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
        startSliderTimer();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
        startSliderTimer();
      }
    }, { passive: true });
  }
}

// Gestion du formulaire de contact
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const name = nameInput ? nameInput.value.trim() : '';

    formFeedback.textContent = `Merci ${name || ''} ! Votre message a bien été envoyé. Nous vous recontacterons dans les plus brefs délais.`;
    formFeedback.className = 'form-feedback success';

    contactForm.reset();

    setTimeout(() => {
      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';
    }, 6000);
  });
}

// Filtres de la galerie (sur la page galerie.html)
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');

if (filterButtons.length && galleryCards.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Lightbox de la galerie : agrandir une photo au clic, naviguer, fermer
const lightbox = document.getElementById('lightbox');

if (lightbox && galleryCards.length) {
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const cardsArray = Array.from(galleryCards);
  let lastFocusedCard = null;

  function visibleCards() {
    return cardsArray.filter(c => c.style.display !== 'none');
  }

  function openLightbox(card) {
    lastFocusedCard = card;
    lightboxImg.style.backgroundImage = `url('${card.getAttribute('data-img')}')`;
    lightboxCaption.textContent = card.getAttribute('data-title') || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  function showAdjacent(direction) {
    const list = visibleCards();
    const current = list.indexOf(lastFocusedCard);
    if (current === -1) return;
    const nextIndex = (current + direction + list.length) % list.length;
    openLightbox(list[nextIndex]);
  }

  cardsArray.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showAdjacent(-1));
  lightboxNext.addEventListener('click', () => showAdjacent(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showAdjacent(-1);
    if (e.key === 'ArrowRight') showAdjacent(1);
  });
}