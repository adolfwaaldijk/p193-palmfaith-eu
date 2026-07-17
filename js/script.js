/* ==========================================================
   PalmFaith Europe
   Decision Portal
   script.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  initialiseNavigation();
  initialiseHeader();
  initialiseDecisionCards();
  initialisePilotForm();
  initialiseActiveNavigation();

});

/* ==========================================================
   Navigation
========================================================== */

function initialiseNavigation() {

  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {

    link.addEventListener("click", event => {

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({

        behavior: "smooth",
        block: "start"

      });

    });

  });

}

/* ==========================================================
   Sticky Header
========================================================== */

function initialiseHeader() {

  const header = document.querySelector(".site-header");

  if (!header) return;

  window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

      header.style.background = "rgba(7,17,29,.95)";
      header.style.borderBottomColor = "rgba(255,255,255,.10)";
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    } else {

      header.style.background = "rgba(7,17,29,.82)";
      header.style.borderBottomColor = "rgba(255,255,255,.06)";
      header.style.boxShadow = "none";

    }

  });

}

/* ==========================================================
   Decision Cards
========================================================== */

function initialiseDecisionCards() {

  const cards = document.querySelectorAll(".decision-card");

  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

    });

  }, {

    threshold: .15

  });

  cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition =
      `all .5s ease ${index * 0.08}s`;

    observer.observe(card);

  });

}

/* ==========================================================
   Pilot Form
========================================================== */

function initialisePilotForm() {

  const form = document.querySelector(".pilot-form");

  if (!form) return;

  form.addEventListener("submit", event => {

    event.preventDefault();

    const name =
      form.querySelector('[name="name"]').value.trim();

    const organisation =
      form.querySelector('[name="organisation"]').value.trim();

    const email =
      form.querySelector('[name="email"]').value.trim();

    const product =
      form.querySelector('[name="product"]').value;

    if (!name) {

      alert("Please enter your name.");
      return;

    }

    if (!organisation) {

      alert("Please enter your organisation.");
      return;

    }

    if (!email) {

      alert("Please enter your email address.");
      return;

    }

    if (!product) {

      alert("Please select a product.");
      return;

    }

    console.table({

      name,
      organisation,
      email,
      product

    });

    alert(
      "Thank you. Your request has been registered."
    );

    form.reset();

  });

}

/* ==========================================================
   Active Navigation Section
========================================================== */

function initialiseActiveNavigation() {
  const navigationLinks = Array.from(
    document.querySelectorAll('.main-nav a[href^="#"]')
  );

  if (!navigationLinks.length) return;

  const sections = navigationLinks
    .map(link => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return null;

      const target = document.querySelector(href);

      return target
        ? { link, target }
        : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActiveLink = activeLink => {
    navigationLinks.forEach(link => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;

      const activeSection = sections.find(
        section => section.target === visibleSections[0].target
      );

      if (activeSection) {
        setActiveLink(activeSection.link);
      }
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.1, 0.25, 0.5]
    }
  );

  sections.forEach(section => observer.observe(section.target));
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  const closeMenu = () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", event => {
    event.stopPropagation();

    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", event => {
    event.stopPropagation();

    const clickedLink = event.target.closest("a");

    if (clickedLink && !clickedLink.classList.contains("coming-soon")) {
      closeMenu();
    }
  });

  document.addEventListener("click", closeMenu);
}