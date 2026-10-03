(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      e.target.querySelectorAll("[data-count]").forEach((el) => {
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
      io.unobserve(e.target);
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  document.getElementById("lead-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    f.querySelector(".form-note").hidden = false;
    f.reset();
  });
})();
