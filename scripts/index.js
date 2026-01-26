const links = document.querySelectorAll("nav li");
const nav = document.querySelector("nav");
const icons = document.getElementById("icons");

icons.addEventListener("click", () => {
  nav.classList.toggle("active");
  // ensure top is updated when opening the menu
  setTimeout(updateMobileNavTop, 10);
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

// Carousel / Carrousel logic
(function () {
  const track = document.querySelector(".carousel-track, .carrousel-track");
  if (!track) return;
  const slides = Array.from(track.querySelectorAll(".carousel-slide, .carrousel-slide"));
  const prevButton = document.querySelector(".carousel-button.prev, .carrousel-button.prev-button, .prev-button");
  const nextButton = document.querySelector(".carousel-button.next, .carrousel-button.next-button, .next-button");
  let currentIndex = slides.findIndex((s) => s.classList.contains("current-slide"));
  if (currentIndex === -1) currentIndex = 0;

  const container = track.closest(".ca    rrousel-track-container") || track.parentElement;

  function updateCarousel() {
    slides.forEach((s, i) => s.classList.toggle("current-slide", i === currentIndex));

    // center the current slide inside the container by calculating translation
    const containerRect = container.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const slide = slides[currentIndex];
    const slideRect = slide.getBoundingClientRect();

    const slideCenterInTrack = slideRect.left - trackRect.left + slideRect.width / 2;
    const containerCenter = containerRect.width / 2;
    const offset = containerCenter - slideCenterInTrack;

    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(${offset}px)`;
  }

  prevButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
  });

  // init
  updateCarousel();

  // recalc on resize to keep current slide centered
  window.addEventListener("resize", () => {
    // small timeout to allow layout to settle
    setTimeout(updateCarousel, 80);
  });

  /* Lightbox: ouvrir l'image du carrousel dans une modale et permettre navigation */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const lbClose = lightbox.querySelector(".lightbox-close");
    const lbPrev = lightbox.querySelector(".lightbox-prev");
    const lbNext = lightbox.querySelector(".lightbox-next");

    function openLightbox() {
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      updateLightbox();
    }

    function closeLightbox() {
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function updateLightbox() {
      const img = slides[currentIndex].querySelector("img");
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Aperçu";
      // keep carousel in sync (highlight current slide)
      updateCarousel();
    }

    // click image to open
    slides.forEach((s, i) => {
      const img = s.querySelector("img");
      if (!img) return;
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        currentIndex = i;
        openLightbox();
      });
    });

    lbPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateLightbox();
    });

    lbNext.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      updateLightbox();
    });

    lbClose.addEventListener("click", closeLightbox);

    // close when clicking outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // keyboard navigation inside lightbox
    document.addEventListener("keydown", (e) => {
      if (lightbox.getAttribute("aria-hidden") === "false") {
        if (e.key === "ArrowLeft") {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          updateLightbox();
        } else if (e.key === "ArrowRight") {
          currentIndex = (currentIndex + 1) % slides.length;
          updateLightbox();
        } else if (e.key === "Escape") {
          closeLightbox();
        }
      }
    });
  }
})();
