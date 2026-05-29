const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const copyButton = document.querySelector("[data-copy]");
const toast = document.querySelector("[data-toast]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航");
  }
});

copyButton.addEventListener("click", async () => {
  const value = copyButton.dataset.copy;

  try {
    await navigator.clipboard.writeText(value);
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 1700);
  } catch {
    window.location.href = `mailto:${value}`;
  }
});

const setupGsap = () => {
  if (!window.gsap) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    return;
  }

  gsap.defaults({ duration: 0.8, ease: "power3.out" });

  gsap
    .timeline()
    .from("[data-hero] .eyebrow", { y: 18 })
    .from("[data-hero] h1", { y: 34 }, "-=0.45")
    .from("[data-hero] .hero-copy", { y: 24 }, "-=0.45")
    .from("[data-hero] .button", { y: 18, stagger: 0.08 }, "-=0.42")
    .from("[data-hero-panel]", { y: 28 }, "-=0.32");

  gsap.to(".hero-media", {
    scale: 1.05,
    duration: 5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.from(".hero-overlay span", {
    scaleX: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: "power2.out",
    delay: 0.4
  });

  gsap.utils.toArray("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    gsap.fromTo(
      node,
      { textContent: 0 },
      {
        textContent: target,
        duration: 1.2,
        ease: "power2.out",
        snap: { textContent: 1 },
        delay: 0.4
      }
    );
  });
};

setupGsap();
