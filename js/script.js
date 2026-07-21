/* ==========================================================
   PalmFaith Europe
   Decision Portal
   script.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  initialiseNavigation();
  initialiseHeader();
  initialiseDecisionCards();
  initialiseActiveNavigation();
  initialiseTechnicalTooltips();

});

/* ==========================================================
   Technical term tooltips
========================================================== */

const technicalTermDefinitions = {
  mfa: "MFA (Multi-Factor Authentication) requires users to verify their identity using two or more independent authentication factors, such as a password, a smartphone or a biometric credential.",
  passkey: "A passkey is a modern, phishing-resistant credential that replaces passwords by using public-key cryptography.",
  fido2: "FIDO2 is an open authentication standard that enables secure, passwordless sign-in using passkeys and security keys.",
  passwordless: "Passwordless authentication verifies a user's identity without requiring a traditional password.",
  biometrics: "Biometric authentication verifies identity using unique physical characteristics such as fingerprints, facial recognition or palm veins.",
  "palm-vein-authentication": "Palm-vein authentication identifies a user by the unique vein pattern inside the palm, providing a highly secure biometric credential.",
  "liveness-detection": "Liveness Detection verifies that a real, living person is present during authentication, helping prevent spoofing attacks.",
  "zero-trust": "Zero Trust is a security model that assumes no user or device is trusted by default and continuously verifies every access request."
};

function initialiseTechnicalTooltips() {
  const seenTerms = new Set();
  const terms = Array.from(
    document.querySelectorAll(".technical-term[data-term]")
  ).filter(term => {
    const termId = term.dataset.term;

    if (seenTerms.has(termId)) {
      term.replaceWith(document.createTextNode(term.textContent));
      return false;
    }

    seenTerms.add(termId);
    return true;
  });

  if (!terms.length) return;

  const popover = document.createElement("div");
  popover.className = "technical-popover";
  popover.id = "technical-term-popover";
  popover.setAttribute("role", "tooltip");
  document.body.appendChild(popover);

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let activeTerm = null;

  const positionPopover = term => {
    const termRect = term.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 10;

    let left = termRect.left + (termRect.width - popoverRect.width) / 2;
    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - popoverRect.width - viewportPadding)
    );

    let top = termRect.top - popoverRect.height - gap;

    if (top < viewportPadding) {
      top = termRect.bottom + gap;
    }

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  };

  const hidePopover = () => {
    if (activeTerm) {
      activeTerm.setAttribute("aria-expanded", "false");
    }

    activeTerm = null;
    popover.classList.remove("is-visible");
  };

  const showPopover = term => {
    const definition = technicalTermDefinitions[term.dataset.term];

    if (!definition) return;

    if (activeTerm && activeTerm !== term) {
      activeTerm.setAttribute("aria-expanded", "false");
    }

    activeTerm = term;
    popover.textContent = definition;
    term.setAttribute("aria-expanded", "true");
    popover.classList.add("is-visible");
    positionPopover(term);
  };

  terms.forEach(term => {
    const definition = technicalTermDefinitions[term.dataset.term];

    if (!definition) return;

    term.setAttribute("aria-describedby", popover.id);
    term.setAttribute("aria-expanded", "false");

    term.addEventListener("mouseenter", () => {
      if (finePointer.matches) showPopover(term);
    });

    term.addEventListener("mouseleave", () => {
      if (finePointer.matches) hidePopover();
    });

    term.addEventListener("focus", () => {
      if (finePointer.matches) showPopover(term);
    });
    term.addEventListener("blur", () => hidePopover());

    term.addEventListener("click", event => {
      event.stopPropagation();

      if (finePointer.matches) return;

      if (activeTerm === term) {
        hidePopover();
      } else {
        showPopover(term);
      }
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".technical-term")) hidePopover();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") hidePopover();
  });

  window.addEventListener("resize", () => {
    if (activeTerm) positionPopover(activeTerm);
  });

  window.addEventListener("scroll", () => {
    if (activeTerm) positionPopover(activeTerm);
  }, { passive: true });
}

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

const comingSoonLinks = document.querySelectorAll(".coming-soon");

comingSoonLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const wasOpen = link.classList.contains("show-coming-soon");

    comingSoonLinks.forEach(item => {
      item.classList.remove("show-coming-soon");
    });

    if (!wasOpen) {
      link.classList.add("show-coming-soon");
    }
  });
});
/* ==========================================================
   Cinematic hero
========================================================== */
function initialiseCinematicHero() {
  const stage = document.querySelector('.cinematic-stage');
  if (!stage) return;

  const skipButton = stage.querySelector('.cinematic-skip');
  const replayButton = stage.querySelector('.cinematic-replay');

  if (skipButton) {
    skipButton.addEventListener('click', () => {
      stage.classList.add('is-skipped');
    });
  }

  if (replayButton) {
    replayButton.addEventListener('click', () => {
      stage.classList.add('is-restarting');
      stage.classList.remove('is-skipped');
      void stage.offsetWidth;

      window.requestAnimationFrame(() => {
        stage.classList.remove('is-restarting');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initialiseCinematicHero);
