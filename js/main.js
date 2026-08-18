(() => {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("site-header");
  const onScrollHeader = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Floating contact buttons: reveal once past the hero ---------- */
  const fabStack = document.querySelector(".fab-stack");
  const heroEl = document.getElementById("home");
  const onScrollFab = () => {
    const threshold = heroEl ? heroEl.offsetHeight * 0.6 : 400;
    fabStack.classList.toggle("is-visible", window.scrollY > threshold);
  };
  onScrollFab();
  window.addEventListener("scroll", onScrollFab, { passive: true });

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2800);
  }

  /* ---------- Placeholder links (pages not part of this homepage prototype) ---------- */
  document.querySelectorAll(".js-fake-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Sezione in sviluppo — disponibile nella versione definitiva del sito.");
    });
  });

  /* ---------- Desktop dropdowns (click to toggle, close on outside click / Escape) ---------- */
  const dropdownItems = document.querySelectorAll(".main-nav .has-dropdown");
  function closeAllDropdowns(except) {
    dropdownItems.forEach((li) => {
      if (li !== except) {
        li.classList.remove("is-open");
        li.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  }
  dropdownItems.forEach((li) => {
    const btn = li.querySelector(".nav-toggle");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !li.classList.contains("is-open");
      closeAllDropdowns();
      li.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });
  document.addEventListener("click", () => closeAllDropdowns());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllDropdowns(); });

  const heroSearch = document.getElementById("hero-search");
  heroSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("viaggi-in-evidenza").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Mobile off-canvas ---------- */
  const mobilePanel = document.getElementById("mobile-panel");
  const scrim = document.getElementById("scrim");
  const menuOpen = document.getElementById("menu-open");
  const menuClose = document.getElementById("menu-close");
  function openMobile() {
    mobilePanel.classList.add("is-open");
    scrim.classList.add("is-open");
    menuOpen.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobile() {
    mobilePanel.classList.remove("is-open");
    scrim.classList.remove("is-open");
    menuOpen.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  menuOpen.addEventListener("click", openMobile);
  menuClose.addEventListener("click", closeMobile);
  scrim.addEventListener("click", closeMobile);
  mobilePanel.querySelectorAll(".mobile-list > li > a").forEach((a) => a.addEventListener("click", closeMobile));

  mobilePanel.querySelectorAll(".mobile-accordion > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const willOpen = !li.classList.contains("is-open");
      mobilePanel.querySelectorAll(".mobile-accordion").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector("button").setAttribute("aria-expanded", "false");
      });
      li.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  /* ---------- Scrollspy ---------- */
  const sections = ["home", "viaggi-in-evidenza", "chi-siamo", "per-chi-viaggi", "diari", "recensioni", "preventivo"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('.main-nav a[href^="#"]');
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const reveal = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => reveal.observe(el));

  /* ---------- Reviews carousel ---------- */
  const slider = document.getElementById("review-slider");
  const slides = Array.from(slider.querySelectorAll(".review-slide"));
  const dotsWrap = document.getElementById("review-dots");
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Recensione ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToSlide(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index, userTriggered) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    if (userTriggered) restartAutoplay();
  }
  function nextSlide() { goToSlide(current + 1); }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 6000);
  }
  restartAutoplay();
  slider.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  slider.addEventListener("mouseleave", restartAutoplay);

  document.getElementById("review-next").addEventListener("click", () => goToSlide(current + 1, true));
  document.getElementById("review-prev").addEventListener("click", () => goToSlide(current - 1, true));

  /* ---------- Forms (simulated — no backend wired up) ---------- */
  const quoteForm = document.getElementById("quote-form");
  const quoteSuccess = document.getElementById("quote-success");
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    quoteSuccess.classList.add("is-visible");
    quoteForm.reset();
    showToast("Richiesta inviata! Ti ricontatteremo a breve.");
  });

  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.reset();
    showToast("Iscrizione confermata! Controlla la tua casella email.");
  });

  /* ---------- Video hero: hide raw <video> if no source is provided ---------- */
  const heroVideo = document.querySelector(".hero-media video");
  if (heroVideo && !heroVideo.querySelector("source")) {
    heroVideo.style.display = "none";
  } else if (heroVideo) {
    heroVideo.muted = true;
    const tryPlay = () => heroVideo.play().catch(() => {});
    tryPlay();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
    ["click", "touchstart", "scroll"].forEach((evt) => {
      document.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
  }
})();
