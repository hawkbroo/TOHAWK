(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const map = {
    speak: "Вам ближе разговорный курс — больше диалогов и лексики для жизни.",
    biz: "Рекомендую Business English — письма, созвоны, презентации.",
    exam: "Лучше IELTS / ЕГЭ трек — стратегии заданий и mock-тесты.",
    zero: "Старт с нуля без давления — мягкая база и много практики.",
  };
  const scores = { speak: 0, biz: 0, zero: 0, exam: 0 };
  let step = 0;
  const questions = [
    { t: "1/3. Где вам нужен английский больше всего?", opts: [
      ["speak", "В путешествиях / общении"], ["biz", "На работе"], ["exam", "Для экзамена"], ["zero", "Вообще с нуля"]
    ]},
    { t: "2/3. Как часто готовы заниматься?", opts: [
      ["speak", "2–3 раза в неделю"], ["biz", "Под рабочие дедлайны"], ["exam", "Интенсивно к дате экзамена"], ["zero", "Спокойно, без гонки"]
    ]},
    { t: "3/3. Что бесит сильнее всего?", opts: [
      ["speak", "Стесняюсь говорить"], ["biz", "Письма и созвоны"], ["exam", "Не понимаю формат заданий"], ["zero", "Не знаю с чего начать"]
    ]},
  ];

  const qText = document.getElementById("q-text");
  const qActions = document.getElementById("q-actions");
  const result = document.getElementById("quiz-result");

  const render = () => {
    const q = questions[step];
    qText.textContent = q.t;
    qActions.innerHTML = "";
    q.opts.forEach(([key, label]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => {
        scores[key] += 1;
        step += 1;
        if (step >= questions.length) {
          const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
          document.getElementById("quiz-box").hidden = true;
          result.hidden = false;
          result.textContent = map[best];
          return;
        }
        render();
      });
      qActions.appendChild(b);
    });
  };
  if (qActions) render();

  document.getElementById("book-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    f.querySelector(".form-note").hidden = false;
    f.reset();
  });
})();
