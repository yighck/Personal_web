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
  if (!window.gsap) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  gsap.defaults({ ease: "power2.out", overwrite: "auto" });

  if (!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero entrance: staggered fade-up ── */
  const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
  heroTl
    .fromTo("[data-hero] .eyebrow", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
    .fromTo("[data-hero] h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.3")
    .fromTo("[data-hero] .hero-copy", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
    .fromTo("[data-hero] .button", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.4")
    .fromTo("[data-hero-panel]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.35");

  /* ── Hero slow zoom ── */
  gsap.to(".hero-media", {
    scale: 1.05,
    duration: 5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  /* ── Hero overlay lines ── */
  gsap.fromTo(
    ".hero-overlay span",
    { scaleX: 0 },
    { scaleX: 1, duration: 1.1, stagger: 0.12, ease: "power2.out", delay: 0.6 }
  );

  /* ── Hero content parallax on scroll ── */
  gsap.fromTo(
    "[data-hero]",
    { y: 0, opacity: 1 },
    {
      y: -80,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "60% top",
        scrub: 0.5
      }
    }
  );

  gsap.fromTo(
    ".hero-media",
    { yPercent: 0 },
    {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5
      }
    }
  );

  /* ── helper: scrub fade-up tied to scroll ── */
  const scrubFadeUp = (targets, opts = {}) => {
    const { y = 36, stagger = 0, start = "top bottom", end = "top 55%" } = opts;
    gsap.utils.toArray(targets).forEach((el) => {
      gsap.fromTo(
        el,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.6
          }
        }
      );
    });
  };

  /* ── Intro section ── */
  scrubFadeUp(".intro .eyebrow", { y: 18, end: "top 70%" });
  scrubFadeUp(".intro h2", { y: 32, end: "top 65%" });
  scrubFadeUp(".intro p", { y: 28, end: "top 60%" });

  /* ── Work section heading ── */
  scrubFadeUp(".work-section .section-heading", { y: 24, end: "top 65%" });

  /* ── Work cards: staggered scrub fade-up ── */
  gsap.utils.toArray(".work-card").forEach((card, i) => {
    gsap.fromTo(
      card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top 60%",
          scrub: 0.6
        }
      }
    );
  });

  /* ── Awards section ── */
  scrubFadeUp(".awards-section .section-heading", { y: 24, end: "top 65%" });
  gsap.utils.toArray(".award-item").forEach((item) => {
    gsap.fromTo(
      item,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "top 62%",
          scrub: 0.6
        }
      }
    );
  });

  /* ── Profile section ── */
  scrubFadeUp(".profile-copy .eyebrow", { y: 18, end: "top 70%" });
  scrubFadeUp(".profile-copy h2", { y: 32, end: "top 65%" });
  scrubFadeUp(".profile-copy p", { y: 24, end: "top 60%" });

  /* ── Stats: scrub counter + fade ── */
  gsap.utils.toArray("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    gsap.fromTo(
      node,
      { textContent: 0, opacity: 0 },
      {
        textContent: target,
        opacity: 1,
        snap: { textContent: 1 },
        ease: "none",
        scrollTrigger: {
          trigger: node.closest(".stats") || node,
          start: "top bottom",
          end: "top 55%",
          scrub: 0.8
        }
      }
    );
  });

  gsap.utils.toArray(".stats > div").forEach((div) => {
    gsap.fromTo(
      div,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: div,
          start: "top bottom",
          end: "top 62%",
          scrub: 0.6
        }
      }
    );
  });

  /* ── Process section ── */
  scrubFadeUp(".process-section .section-heading", { y: 24, end: "top 65%" });
  gsap.utils.toArray(".process-list article").forEach((article) => {
    gsap.fromTo(
      article,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: article,
          start: "top bottom",
          end: "top 62%",
          scrub: 0.6
        }
      }
    );
  });

  /* ── Contact section ── */
  scrubFadeUp(".contact-section", { y: 40, end: "top 58%" });
  gsap.utils.toArray(".contact-actions .button").forEach((btn) => {
    gsap.fromTo(
      btn,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: btn,
          start: "top bottom",
          end: "top 70%",
          scrub: 0.5
        }
      }
    );
  });

  /* ── Footer ── */
  gsap.fromTo(
    ".site-footer",
    { opacity: 0 },
    {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".site-footer",
        start: "top bottom",
        end: "top 85%",
        scrub: 0.4
      }
    }
  );

  ScrollTrigger.refresh();
};

setupGsap();
