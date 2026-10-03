(() => {
  const progressBar = document.querySelector(".progress__bar");
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  const reveals = document.querySelectorAll(".reveal");
  const chips = document.querySelectorAll(".filters .chip");
  const shots = [...document.querySelectorAll(".shot")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox__img");
  const form = document.querySelector(".form");
  const reviews = [...document.querySelectorAll(".review")];
  const dots = [...document.querySelectorAll(".dot")];

  let visibleShots = shots;
  let lbIndex = 0;
  let reviewIndex = 0;
  let reviewTimer;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = `${value}%`;
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");

        entry.target.querySelectorAll("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count || 0);
          if (!target || el.dataset.done) return;
          el.dataset.done = "1";
          const start = performance.now();
          const duration = 1100;
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });

        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => io.observe(el));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-selected", c === chip ? "true" : "false");
      });
      shots.forEach((shot) => {
        const show = filter === "all" || shot.dataset.cat === filter;
        shot.classList.toggle("is-hidden", !show);
      });
      visibleShots = shots.filter((s) => !s.classList.contains("is-hidden"));
    });
  });

  const openLightbox = (index) => {
    if (!visibleShots.length) return;
    lbIndex = (index + visibleShots.length) % visibleShots.length;
    const shot = visibleShots[lbIndex];
    lightboxImg.src = shot.dataset.full || shot.querySelector("img").src;
    lightboxImg.alt = shot.querySelector("img").alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  };

  shots.forEach((shot, i) => {
    shot.addEventListener("click", () => {
      visibleShots = shots.filter((s) => !s.classList.contains("is-hidden"));
      const idx = visibleShots.indexOf(shot);
      openLightbox(idx < 0 ? i : idx);
    });
  });

  document.querySelector(".lightbox__close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lightbox__prev")?.addEventListener("click", () => openLightbox(lbIndex - 1));
  document.querySelector(".lightbox__next")?.addEventListener("click", () => openLightbox(lbIndex + 1));
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
  });

  const showReview = (index) => {
    reviewIndex = (index + reviews.length) % reviews.length;
    reviews.forEach((r, i) => r.classList.toggle("is-active", i === reviewIndex));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === reviewIndex));
  };

  const startReviews = () => {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => showReview(reviewIndex + 1), 4500);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showReview(i);
      startReviews();
    });
  });
  if (reviews.length) startReviews();

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const note = form.querySelector(".form-note");
    if (note) note.hidden = false;
    form.reset();
  });
})();
