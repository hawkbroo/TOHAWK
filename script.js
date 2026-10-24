(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme is restored in the head before styles paint; the button keeps it persistent. */
  const themeButton = document.querySelector('.theme-switch');
  const updateTheme = (theme, persist = false) => {
    const light = theme === 'light';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(light));
      themeButton.setAttribute('aria-label', light ? 'Включить тёмную тему' : 'Включить светлую тему');
      themeButton.title = light ? 'Тёмная тема' : 'Светлая тема';
    }
    if (persist) { try { localStorage.setItem('tohawk-theme', light ? 'light' : 'dark'); } catch (_) {} }
  };
  updateTheme(document.documentElement.dataset.theme);
  themeButton?.addEventListener('click', () => updateTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true));
  window.addEventListener('storage', (event) => {
    if (event.key === 'tohawk-theme') updateTheme(event.newValue);
  });
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const bar = document.querySelector(".progress i");
  const onScrollProgress = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };

  const nav = document.querySelector("[data-nav]");
  const onScrollNav = () => {
    if (nav) nav.classList.toggle("is-solid", window.scrollY > 24);
  };

  const burger = document.querySelector(".nav__burger");
  const drawer = document.getElementById("drawer");
  if (burger && drawer) {
    const close = () => {
      drawer.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = drawer.hidden;
      drawer.hidden = !open;
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  const toggle = document.querySelector(".pricing__toggle");
  if (toggle) {
    const buttons = [...toggle.querySelectorAll("button")];
    const prices = [...document.querySelectorAll(".plan__price")];
    const apply = (period) => {
      buttons.forEach((b) => b.classList.toggle("is-on", b.dataset.period === period));
      prices.forEach((el) => {
        const strong = el.querySelector("strong");
        if (!strong) return;
        strong.style.opacity = "0.35";
        window.setTimeout(() => {
          strong.textContent = el.getAttribute(`data-${period}`) || el.getAttribute("data-once");
          strong.style.opacity = "1";
        }, 120);
      });
    };
    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.period || "once")));
  }

  /* Hero entrance */
  const brand = document.querySelector("[data-hero-brand]");
  const words = [...document.querySelectorAll("[data-hero-word]")];
  const fades = [...document.querySelectorAll("[data-hero-fade]")];
  const stage = document.querySelector("[data-hero-stage]");

  const runHero = () => {
    if (brand) brand.classList.add("is-in");
    words.forEach((w, i) => window.setTimeout(() => w.classList.add("is-in"), 140 + i * 140));
    fades.forEach((el, i) => window.setTimeout(() => el.classList.add("is-in"), 560 + i * 100));
    if (stage) window.setTimeout(() => stage.classList.add("is-in"), 380);
  };

  if (reduced) {
    brand?.classList.add("is-in");
    words.forEach((w) => w.classList.add("is-in"));
    fades.forEach((el) => el.classList.add("is-in"));
    stage?.classList.add("is-in");
  } else {
    window.setTimeout(() => window.requestAnimationFrame(runHero), 1750);
  }

  /* Hero frame: progress line top→bottom, then soft fade to next project */
  const slideLabel = document.querySelector("[data-hero-slide-label]");
  const frameSub = document.querySelector("[data-hero-slide-sub]");
  const progressFill = document.querySelector("[data-hero-progress]");
  const slides = [
    { name: "Pool Time Club", sub: "бильярд · запись · WhatsApp" },
    { name: "Анна Волкова", sub: "психолог · запись" },
    { name: "INKROOM", sub: "тату · пирсинг" },
    { name: "Atelier Claire", sub: "салон красоты · запись" },
    { name: "Elena Smith", sub: "репетитор · английский" },
    { name: "LUMA", sub: "клининг · заявка" },
  ];
  let slideIdx = 0;
  const SLIDE_MS = 6000;
  const GAP_MS = 380;
  const slideCount = document.querySelector("[data-hero-slide-count]");

  const applySlide = (idx) => {
    if (!slideLabel || !frameSub) return;
    slideLabel.textContent = slides[idx].name;
    frameSub.textContent = slides[idx].sub;
    if (slideCount) {
      slideCount.textContent = String(idx + 1).padStart(2, "0");
    }
  };

  const showNext = () => {
    if (!slideLabel || !frameSub) return;
    slideIdx = (slideIdx + 1) % slides.length;
    if (reduced) {
      applySlide(slideIdx);
      return;
    }
    slideLabel.classList.add("is-swap");
    frameSub.classList.add("is-swap");
    window.setTimeout(() => {
      applySlide(slideIdx);
      slideLabel.classList.remove("is-swap");
      frameSub.classList.remove("is-swap");
    }, GAP_MS);
  };

  if (slideLabel && frameSub && progressFill) {
    applySlide(0);
    if (reduced) {
      progressFill.style.transform = "scaleY(1)";
      window.setInterval(showNext, SLIDE_MS);
    } else {
      let start = performance.now();
      const tick = (now) => {
        const t = (now - start) / SLIDE_MS;
        const p = Math.min(1, Math.max(0, t));
        progressFill.style.transform = `scaleY(${p})`;
        if (p >= 1) {
          showNext();
          start = now;
          progressFill.style.transform = "scaleY(0)";
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* scroll reveals */
  if (reduced) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      io.observe(el);
    });
  }

  const mega = document.querySelector("[data-footer-mega]");
  if (mega && !reduced) {
    const fio = new IntersectionObserver(
      (entries) => entries.forEach((e) => mega.classList.toggle("is-hot", e.isIntersecting)),
      { threshold: 0.45 }
    );
    fio.observe(mega);
  }

  const onScroll = () => {
    onScrollProgress();
    onScrollNav();
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* A small ambient light follows a mouse without replacing the cursor. */
(() => {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  let frame = 0;
  let initialized = false;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  const enabled = () => finePointer.matches && !calmMotion.matches;
  const paint = () => {
    x += (targetX - x) * 0.2;
    y += (targetY - y) * 0.2;
    glow.style.transform = `translate3d(${x - 130}px, ${y - 130}px, 0)`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15) {
      frame = requestAnimationFrame(paint);
    } else {
      frame = 0;
    }
  };
  const hide = () => {
    glow.classList.remove('is-visible');
    cancelAnimationFrame(frame);
    frame = 0;
    initialized = false;
  };
  document.addEventListener('pointermove', (event) => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!initialized) {
      x = targetX;
      y = targetY;
      initialized = true;
    }
    glow.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  finePointer.addEventListener('change', hide);
  calmMotion.addEventListener('change', hide);
})();
