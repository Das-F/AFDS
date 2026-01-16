const links = document.querySelectorAll("nav li");
const nav = document.querySelector("nav");
const icons = document.getElementById("icons");

icons.addEventListener("click", () => {
  nav.classList.toggle("active");
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
})();
