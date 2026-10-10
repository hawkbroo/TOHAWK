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

  /* Glow tracking */
  $$("[data-glow]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  /* Calc spotlight */
  const board = $("#calc-board");
  board?.addEventListener("pointermove", (e) => {
    const r = board.getBoundingClientRect();
    board.style.setProperty("--mx", `${e.clientX - r.left}px`);
    board.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* Price calc */
  const area = $("#area");
  const areaOut = $("#area-out");
  const calcType = $("#calc-type");
  const sumEl = $("#sum");
  const bookService = $("#book-service");

  const fmt = (n) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

  const calc = () => {
    if (!area || !sumEl || !calcType) return;
    const m2 = Number(area.value);
    const rate = Number(calcType.value);
    if (areaOut) areaOut.textContent = `${m2} м²`;
    sumEl.textContent = fmt(m2 * rate);
    sumEl.classList.remove("is-tick");
    void sumEl.offsetWidth;
    sumEl.classList.add("is-tick");
  };

  area?.addEventListener("input", calc);
  calcType?.addEventListener("change", () => {
    const svc = calcType.selectedOptions[0]?.dataset.svc;
    $$(".svc").forEach((b) => b.classList.toggle("is-on", b.dataset.svc === svc));
    if (bookService && svc) bookService.value = svc;
    calc();
  });

  $$(".svc").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".svc").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      if (calcType) {
        const opt = [...calcType.options].find((o) => o.dataset.svc === btn.dataset.svc);
        if (opt) calcType.value = opt.value;
      }
      if (bookService) bookService.value = btn.dataset.svc || "";
      calc();
    });
  });
  calc();

  /* Before / after */
  const stage = $("#compare-stage");
  const before = $("#compare-before");
  const beforeImg = before?.querySelector("img");
  const range = $("#compare-range");
  const handle = $(".compare__handle");

  const syncCompare = () => {
    if (!stage || !before || !beforeImg || !range) return;
    const w = stage.getBoundingClientRect().width;
    beforeImg.style.width = `${w}px`;
    beforeImg.style.height = `${stage.getBoundingClientRect().height}px`;
    const pos = `${range.value}%`;
    before.style.setProperty("--pos", pos);
    before.style.width = pos;
    if (handle) handle.style.left = pos;
  };

  range?.addEventListener("input", syncCompare);
  window.addEventListener("resize", syncCompare);
  syncCompare();

  /* Slots */
  const slotInput = $("#book-slot");
  $$(".slot").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".slot").forEach((s) => s.classList.remove("is-on"));
      btn.classList.add("is-on");
      if (slotInput) slotInput.value = btn.dataset.slot || "";
    });
  });

  /* Form */
  const form = $("#book-form");
  const ok = $("#form-ok");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (ok) ok.hidden = false;
    form.reset();
    if (slotInput) slotInput.value = "09:00–12:00";
    $$(".slot").forEach((s, i) => s.classList.toggle("is-on", i === 0));
    calc();
  });

  /* Lightbox */
  const lb = $("#lightbox");
  const lbImg = $("#lightbox-img");
  const closeLb = () => lb?.setAttribute("hidden", "");
  $$(".shot").forEach((shot) => {
    shot.addEventListener("click", () => {
      if (!lb || !lbImg) return;
      lbImg.src = shot.dataset.full || shot.querySelector("img")?.src || "";
      lbImg.alt = shot.querySelector("span")?.textContent || "";
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

  /* Reveal + steps line */
  const steps = $("#steps");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.closest("#steps") || en.target.id === "steps") {
          steps?.classList.add("is-drawn");
        }
        if (en.target === steps) steps.classList.add("is-drawn");
        io.unobserve(en.target);
      });
    },
    { threshold: 0.14 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
  if (steps) io.observe(steps);

  /* Soft parallax */
  const para = $("[data-parallax]");
  if (para) {
    const onScroll = () => {
      const rect = para.parentElement.getBoundingClientRect();
      const view = window.innerHeight;
      if (rect.bottom < 0 || rect.top > view) return;
      const p = (view - rect.top) / (view + rect.height);
      para.style.transform = `translate3d(0, ${(p - 0.5) * -36}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
