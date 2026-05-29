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

  gsap.defaults({ duration: 0.8, ease: "power3.out", overwrite: "auto" });

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── helper: split text into words ── */
  const splitWords = (el) => {
    const text = el.textContent;
    el.innerHTML = text.replace(/\S+/g, '<span class="word-wrap"><span class="word">$&</span></span>');
    return el.querySelectorAll(".word");
  };

  /* ── Hero entrance ── */
  const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTl
    .fromTo("[data-hero] .eyebrow", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
    .fromTo("[data-hero] h1", { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.4")
    .fromTo("[data-hero] .hero-copy", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
    .fromTo("[data-hero] .button", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.5")
    .fromTo("[data-hero-panel]", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");

  /* ── Hero background parallax on scroll ── */
  gsap.to(".hero-media", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6
    }
  });

  /* ── Hero content fades out on scroll ── */
  gsap.to("[data-hero]", {
    y: -60,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "30% top",
      end: "70% top",
      scrub: 0.4
    }
  });

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
    {
      scaleX: 1,
      duration: 1.1,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.6
    }
  );

  if (!window.ScrollTrigger) {
    return;
  }

  /* ── Text split reveal for headings ── */
  gsap.utils.toArray("[data-split-text]").forEach((heading) => {
    const words = splitWords(heading);
    gsap.set(heading, { visibility: "visible" });
    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
          once: true
        }
      }
    );
  });

  /* ── Section reveals with clip-path wipe ── */
  gsap.utils.toArray(".section, .contact-section").forEach((section) => {
    gsap.fromTo(
      section,
      {
        clipPath: "inset(8% 0% 0% 0%)",
        opacity: 0
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 1,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          once: true
        }
      }
    );
  });

  /* ── Eyebrow labels slide in ── */
  gsap.utils.toArray(".section .eyebrow, .contact-section .eyebrow").forEach((el) => {
    gsap.fromTo(
      el,
      { x: -24, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true
        }
      }
    );
  });

  /* ── Work cards: staggered with scale + rotation ── */
  ScrollTrigger.batch(".work-card", {
    start: "top 86%",
    once: true,
    onEnter: (items) => {
      gsap.fromTo(
        items,
        { y: 60, scale: 0.92, rotateX: 6, opacity: 0 },
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.12
        }
      );
    }
  });

  /* ── Award items ── */
  ScrollTrigger.batch(".award-item", {
    start: "top 86%",
    once: true,
    onEnter: (items) => {
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1
        }
      );
    }
  });

  /* ── Stats counter (scroll-triggered) ── */
  gsap.utils.toArray("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    gsap.fromTo(
      node,
      { textContent: 0 },
      {
        textContent: target,
        duration: 1.4,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: node.closest(".stats") || node,
          start: "top 85%",
          once: true
        }
      }
    );
  });

  /* ── Stats section parallax ── */
  gsap.fromTo(
    ".stats > div",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".stats",
        start: "top 85%",
        once: true
      }
    }
  );

  /* ── Process list: sequential reveal with slide ── */
  gsap.utils.toArray(".process-list article").forEach((article, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: article,
        start: "top 88%",
        once: true
      }
    });

    tl.fromTo(
      article,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.65, ease: "power3.out" }
    )
      .fromTo(
        article.querySelector("span"),
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.35"
      )
      .fromTo(
        article.querySelector("h3"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo(
        article.querySelector("p"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );
  });

  /* ── Contact section: dramatic entrance ── */
  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 82%",
      once: true
    }
  });

  contactTl
    .fromTo(
      ".contact-section",
      { clipPath: "inset(12% 0% 0% 0%)", opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1, ease: "power3.inOut" }
    )
    .fromTo(
      ".contact-section .eyebrow",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(
      ".contact-actions .button",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
      "-=0.3"
    );

  /* ── Footer parallax ── */
  gsap.fromTo(
    ".site-footer",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".site-footer",
        start: "top 95%",
        once: true
      }
    }
  );

  ScrollTrigger.refresh();
};

setupGsap();
