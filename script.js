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
  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    return;
  }

  document.documentElement.classList.add("js-animate-ready");
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: 0.8, ease: "power3.out" });

  const heroTimeline = gsap.timeline();
  heroTimeline
    .from("[data-hero] .eyebrow", { autoAlpha: 0, y: 18 })
    .from("[data-hero] h1", { autoAlpha: 0, y: 34 }, "-=0.45")
    .from("[data-hero] .hero-copy", { autoAlpha: 0, y: 24 }, "-=0.45")
    .from("[data-hero] .button", { autoAlpha: 0, y: 18, stagger: 0.08 }, "-=0.42")
    .fromTo(
      "[data-hero-panel]",
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0 },
      "-=0.32"
    );

  gsap.to(".hero-media", {
    scale: 1.06,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });

  gsap.from(".hero-overlay span", {
    scaleX: 0,
    autoAlpha: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: "power2.out",
    delay: 0.4
  });

  gsap.utils.toArray("[data-animate]").forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 42 },
      {
        autoAlpha: 1,
        y: 0,
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true
        }
      }
    );
  });

  ScrollTrigger.batch("[data-card]", {
    start: "top 82%",
    once: true,
    onEnter: (cards) => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 46, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.12
        }
      );
    }
  });

  ScrollTrigger.batch("[data-step]", {
    start: "top 86%",
    once: true,
    onEnter: (steps) => {
      gsap.fromTo(
        steps,
        { autoAlpha: 0, x: -26 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1
        }
      );
    }
  });

  ScrollTrigger.create({
    trigger: "[data-stats]",
    start: "top 78%",
    once: true,
    onEnter: () => {
      gsap.utils.toArray("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        gsap.fromTo(
          node,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.2,
            ease: "power2.out",
            snap: { textContent: 1 }
          }
        );
      });
    }
  });
};

setupGsap();
