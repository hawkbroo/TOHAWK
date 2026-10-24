(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Mobile nav */
  const toggle = $(".nav-toggle");
  const nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* Pointer glow tracking on buttons */
  $$("[data-glow]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    });
  });

  /* Gallery filter */
  const chips = $$(".chip");
  const shots = $$(".shot");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-on"));
      chip.classList.add("is-on");
      const f = chip.dataset.filter;
      shots.forEach((shot) => {
        const show = f === "all" || shot.dataset.cat === f;
        shot.classList.toggle("is-hide", !show);
      });
    });
  });

  /* Lightbox */
  const lb = $("#lightbox");
  const lbImg = $("#lightbox-img");
  const closeLb = () => lb?.setAttribute("hidden", "");
  shots.forEach((shot) => {
    shot.addEventListener("click", () => {
      if (!lb || !lbImg) return;
      lbImg.src = shot.dataset.full || shot.querySelector("img")?.src || "";
      lbImg.alt = shot.querySelector("img")?.alt || "";
      lb.removeAttribute("hidden");
    });
  });
  $(".lightbox__close")?.addEventListener("click", closeLb);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });

  /* Style picker */
  const hints = {
    blackwork: {
      title: "Blackwork",
      text: "Лучше смотрится на предплечье, голени и спине. Сессия от 3 часов. После ухода — матовая плёнка 5 дней.",
    },
    fineline: {
      title: "Fine line",
      text: "Тонкие линии любят ключицы, рёбра и запястья. Короткие сессии, аккуратная коррекция через 6–8 недель.",
    },
    neo: {
      title: "Neo-traditional",
      text: "Цвет и объём — плечо, бедро, спина. Нужен эскиз и тест-патч кожи. Срок заживления дольше чёрной работы.",
    },
    letter: {
      title: "Lettering",
      text: "Кастомный шрифт под длину фразы. Важно место: внутренняя сторона руки или рёбра. DEMO-подсказка.",
    },
  };

  $$(".style-card").forEach((card) => {
    card.addEventListener("click", () => {
      $$(".style-card").forEach((c) => c.classList.remove("is-on"));
      card.classList.add("is-on");
      const key = card.dataset.style;
      const data = hints[key];
      if (!data) return;
      $("#hint-title").textContent = data.title;
      $("#hint-text").textContent = data.text;
    });
  });

  /* Piercing zones */
  const zones = {
    ear: {
      title: "Ухо · helix / lobe",
      desc: "Титановый микродермал или кольцо. Заживление 6–12 недель. DEMO-прайс.",
      price: "от 3 500 ₽",
    },
    nose: {
      title: "Нос · nostril / septum",
      desc: "Только имплант-сталь / титан ASTM F136. Заживление 2–4 месяца.",
      price: "от 4 200 ₽",
    },
    lip: {
      title: "Губа · labret",
      desc: "Плоский диск внутри, чтобы не бить по зубам. Уход антисептиком 2× в день.",
      price: "от 4 000 ₽",
    },
    navel: {
      title: "Пупок",
      desc: "Классика с бананом. Важно анатомия складки — на консультации смотрим посадку.",
      price: "от 4 800 ₽",
    },
    nipple: {
      title: "Сосок",
      desc: "Только 18+ · консультация обязательна. Заживление дольше остальных зон.",
      price: "от 5 500 ₽",
    },
  };

  $$(".hotspot").forEach((dot) => {
    const activate = () => {
      $$(".hotspot").forEach((d) => d.classList.remove("is-on"));
      dot.classList.add("is-on");
      const z = zones[dot.dataset.zone];
      if (!z) return;
      $("#zone-title").textContent = z.title;
      $("#zone-desc").textContent = z.desc;
      $("#zone-price").textContent = z.price;
    };
    dot.addEventListener("click", activate);
    dot.addEventListener("mouseenter", activate);
  });

  /* Form highlight + fake submit */
  const form = $("#book-form");
  const submitBtn = form?.querySelector(".btn--submit");
  const ok = $("#form-ok");

  const checkReady = () => {
    if (!form || !submitBtn) return;
    const ready = form.checkValidity();
    submitBtn.classList.toggle("is-ready", ready);
    submitBtn.classList.toggle("is-lit", ready);
  };

  form?.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", checkReady);
    field.addEventListener("change", checkReady);
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    ok.hidden = false;
    submitBtn.classList.remove("is-ready");
    submitBtn.textContent = "Отправлено · DEMO";
    form.reset();
    setTimeout(() => {
      submitBtn.textContent = "Отправить заявку";
    }, 2200);
  });

  /* Scroll reveal */
  const revealTargets = [
    ...$$(".section-head"),
    ...$$(".shot"),
    ...$$(".style-card"),
    ...$$(".artist"),
    ".pierce-layout",
    ".book-form",
    ".strip",
  ].map((el) => (typeof el === "string" ? $(el) : el)).filter(Boolean);

  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => io.observe(el));
})();
