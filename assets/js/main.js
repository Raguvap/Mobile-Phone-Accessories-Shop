const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const THEME_KEY = "voltedge-theme";
const DIR_KEY = "voltedge-dir";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.textContent = theme === "dark" ? "☀" : "☾";
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute("dir", dir);
  localStorage.setItem(DIR_KEY, dir);
  document.querySelectorAll("[data-rtl-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(dir === "rtl"));
  });
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  applyDirection(localStorage.getItem(DIR_KEY) || "ltr");

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });

  document.querySelectorAll("[data-rtl-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("dir") || "ltr";
      applyDirection(current === "rtl" ? "ltr" : "rtl");
    });
  });
});

document.querySelectorAll("form[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const notice = form.querySelector("[data-form-notice]");
    if (notice) notice.textContent = "Thanks. Our store specialist will contact you shortly.";
    form.reset();
  });
});
