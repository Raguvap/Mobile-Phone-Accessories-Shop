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

document.addEventListener("DOMContentLoaded", () => {
  // Theme & Direction Init
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  applyDirection(localStorage.getItem(DIR_KEY) || "ltr");

  // Dynamic Year
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Mobile Menu Listener
  const menuButtons = document.querySelectorAll("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuButtons.length > 0 && mobileMenu) {
    menuButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });

    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !Array.from(menuButtons).some((b) => b.contains(e.target))) {
        mobileMenu.classList.remove("open");
        menuButtons.forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuButtons.forEach((b) => b.setAttribute("aria-expanded", "false"));
      });
    });
  }

  // Theme & RTL Toggle Buttons
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

  // Form Notice Listener
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const notice = form.querySelector("[data-form-notice]");
      if (notice) {
        notice.textContent = "✓ Thank you! Our tech concierge will confirm your request within 15 minutes.";
        notice.classList.add("mt-3", "p-3", "bg-emerald-500/20", "text-emerald-300", "rounded-xl", "text-xs", "font-bold");
      }
      form.reset();
    });
  });

  // Category Filter for Products / Shop Page
  const filterBtns = document.querySelectorAll("[data-category-filter]");
  const productCards = document.querySelectorAll("[data-product-category]");
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-category-filter");
        filterBtns.forEach((b) => b.classList.remove("bg-cyan-500", "text-slate-950", "bg-violet-600"));
        btn.classList.add("bg-cyan-500", "text-slate-950");

        productCards.forEach((card) => {
          const itemCat = card.getAttribute("data-product-category");
          if (cat === "all" || itemCat === cat) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Live Product Search Filter
  const searchInput = document.querySelector("[data-product-search]");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      productCards.forEach((card) => {
        const text = card.innerText.toLowerCase();
        if (text.includes(term)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Charger Wattage & Speed Calculator (repair-guide.html)
  const wattInput = document.querySelector("[data-calc-watts]");
  const batInput = document.querySelector("[data-calc-battery]");
  const timeOutput = document.querySelector("[data-calc-time]");
  const speedOutput = document.querySelector("[data-calc-speed]");

  if (wattInput && batInput && timeOutput) {
    const updateChargingCalc = () => {
      const watts = parseFloat(wattInput.value || 30);
      const mAh = parseFloat(batInput.value || 5000);
      // Rough GaN efficiency formula
      const hours = ((mAh * 3.85 / 1000) / (watts * 0.85)).toFixed(1);
      const minutes = Math.round(hours * 60);
      timeOutput.textContent = `~ ${minutes} mins (0 to 100%)`;
      if (speedOutput) {
        speedOutput.textContent = watts >= 65 ? "🚀 Super Fast GaN FastCharge" : watts >= 25 ? "⚡ Fast Charge PD3.0" : "🔌 Standard 15W Charge";
      }
    };

    wattInput.addEventListener("input", updateChargingCalc);
    batInput.addEventListener("change", updateChargingCalc);
  }

  // VoltCare Subscription Plan Estimator (subscriptions.html)
  const subPlanSelect = document.querySelector("[data-sub-plan]");
  const subDeviceCount = document.querySelector("[data-sub-devices]");
  const subTotalOutput = document.querySelector("[data-sub-total]");

  if (subPlanSelect && subDeviceCount && subTotalOutput) {
    const updateSubPrice = () => {
      const planBase = parseFloat(subPlanSelect.value || 9.99);
      const devices = parseInt(subDeviceCount.value || 1, 10);
      const total = (planBase * devices).toFixed(2);
      subTotalOutput.textContent = `$${total} / month`;
    };

    subPlanSelect.addEventListener("change", updateSubPrice);
    subDeviceCount.addEventListener("change", updateSubPrice);
  }
});
