const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");
const heroVisual = document.querySelector(".hero-visual");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let ticking = false;

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const setScrollProgress = () => {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(progress, 1)})`;
};

const updateOnScroll = () => {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    setHeaderState();
    setScrollProgress();
    ticking = false;
  });

  ticking = true;
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

revealElements.forEach((element) => {
  const siblingReveals = [...element.parentElement.children].filter((child) => child.classList.contains("reveal"));
  const order = siblingReveals.indexOf(element);

  if (
    element.classList.contains("about-point-card") ||
    element.classList.contains("skill-card") ||
    element.classList.contains("softskill-card") ||
    element.classList.contains("project-card")
  ) {
    element.style.setProperty("--delay", `${Math.max(order, 0) * 80}ms`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-45% 0px -50% 0px",
    threshold: 0
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (heroVisual && !reduceMotion.matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroVisual.style.setProperty("--tilt-x", `${x * 8}deg`);
    heroVisual.style.setProperty("--tilt-y", `${y * -8}deg`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
  });
}

window.addEventListener("scroll", updateOnScroll, { passive: true });
setHeaderState();
setScrollProgress();
