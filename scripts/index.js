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
