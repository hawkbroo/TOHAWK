(() => {
  const root = document.documentElement;
  const body = document.body;
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  let spotRaf = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(() => {
        root.style.setProperty("--spot-x", `${(e.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty("--spot-y", `${(e.clientY / window.innerHeight) * 100}%`);
        spotRaf = 0;
      });
    },
    { passive: true }
  );

  const moodHints = {
    heavy: "Поняла. Можно дышать медленнее — кнопка ниже.",
    calm: "Ок. Можно просто побыть здесь.",
    light: "Хорошо. Если захотите — разберём, откуда эта лёгкость.",
  };
  document.querySelectorAll(".mood__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      body.dataset.mood = btn.dataset.mood;
      document.getElementById("mood-hint").textContent = moodHints[btn.dataset.mood] || "";
    });
  });

  const ring = document.getElementById("breathe-ring");
  const phaseEl = document.getElementById("breathe-phase");
  const countEl = document.getElementById("breathe-count");
  const toggleBtn = document.getElementById("breathe-toggle");
  let breathing = false;
  let breathTimer;

  const clearBreath = () => {
    clearTimeout(breathTimer);
    ring.classList.remove("is-inhale", "is-hold", "is-exhale");
  };

  const cycle = () => {
    if (!breathing) return;
    const steps = [
      { cls: "is-inhale", text: "Вдох", n: 4, ms: 4000 },
      { cls: "is-hold", text: "Пауза", n: 4, ms: 4000 },
      { cls: "is-exhale", text: "Выдох", n: 6, ms: 6000 },
    ];
    let i = 0;
    const run = () => {
      if (!breathing) return;
      const s = steps[i];
      ring.classList.remove("is-inhale", "is-hold", "is-exhale");
      ring.classList.add(s.cls);
      phaseEl.textContent = s.text;
      let left = s.n;
      countEl.textContent = String(left);
      const tick = setInterval(() => {
        left -= 1;
        countEl.textContent = String(Math.max(left, 0));
        if (left <= 0) clearInterval(tick);
      }, 1000);
      breathTimer = setTimeout(() => {
        clearInterval(tick);
        i = (i + 1) % steps.length;
        run();
      }, s.ms);
    };
    run();
  };

  toggleBtn?.addEventListener("click", () => {
    breathing = !breathing;
    toggleBtn.textContent = breathing ? "Стоп" : "Начать";
    if (!breathing) {
      clearBreath();
      phaseEl.textContent = "Остановились. Можно начать снова.";
      countEl.textContent = "4";
      return;
    }
    cycle();
  });

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
          const tick = (now) => {
            const p = Math.min(1, (now - start) / 1100);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const cards = [...document.querySelectorAll(".card[data-topics]")];
  document.querySelectorAll(".topics .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".topics .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      const topic = chip.dataset.topic;
      cards.forEach((card) => {
        const ok = topic === "all" || (card.dataset.topics || "").includes(topic);
        card.classList.toggle("is-dim", !ok);
      });
    });
  });

  const reviews = [...document.querySelectorAll(".review")];
  const dots = [...document.querySelectorAll(".dot")];
  let ri = 0;
  let reviewTimer;
  const showReview = (i) => {
    ri = (i + reviews.length) % reviews.length;
    reviews.forEach((r, idx) => r.classList.toggle("is-active", idx === ri));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === ri));
  };
  const startReviews = () => {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => showReview(ri + 1), 4500);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => { showReview(i); startReviews(); }));
  if (reviews.length) startReviews();

  document.querySelectorAll(".format .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".format .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      document.getElementById("format-input").value = chip.dataset.format;
    });
  });
  document.querySelectorAll(".slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      document.querySelectorAll(".slot").forEach((s) => s.classList.toggle("is-active", s === slot));
      document.getElementById("slot-input").value = slot.dataset.slot;
    });
  });

  document.getElementById("book-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.querySelector(".form-note").hidden = false;
    form.reset();
    document.getElementById("format-input").value =
      document.querySelector(".format .chip.is-active")?.dataset.format || "online";
    document.getElementById("slot-input").value =
      document.querySelector(".slot.is-active")?.dataset.slot || "";
  });
})();
