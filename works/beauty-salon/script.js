(() => {
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

  // Before / After
  const baWrap = document.getElementById("ba-before-wrap");
  const baRange = document.getElementById("ba-range");
  const baBefore = document.querySelector(".ba__before");
  const syncBa = (value) => {
    const v = Number(value);
    if (baWrap) baWrap.style.width = `${v}%`;
    if (baBefore && baWrap) {
      const w = baWrap.parentElement?.clientWidth || 0;
      baBefore.style.width = `${w}px`;
    }
  };
  baRange?.addEventListener("input", (e) => syncBa(e.target.value));
  window.addEventListener("resize", () => syncBa(baRange?.value || 50));
  syncBa(50);

  // Calculator
  const service = document.getElementById("calc-service");
  const length = document.getElementById("calc-length");
  const total = document.getElementById("calc-total");
  const note = document.getElementById("calc-note");
  const money = (n) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
  const updateCalc = () => {
    const base = Number(service.value);
    const mult = Number(length.value);
    const name = service.selectedOptions[0]?.dataset.name || "";
    const lenText = length.selectedOptions[0]?.textContent.split("·")[0].trim() || "";
    total.textContent = money(base * mult);
    note.textContent = `${name} · ${lenText.toLowerCase()}`;
  };
  service?.addEventListener("change", updateCalc);
  length?.addEventListener("change", updateCalc);
  updateCalc();

  // Gift certificate live preview
  const sum = document.getElementById("gift-sum");
  const sumLabel = document.getElementById("gift-sum-label");
  const cardSum = document.getElementById("gift-card-sum");
  const toIn = document.getElementById("gift-to");
  const fromIn = document.getElementById("gift-from");
  const msgIn = document.getElementById("gift-msg");
  const cardTo = document.getElementById("gift-card-to");
  const cardFrom = document.getElementById("gift-card-from");
  const cardMsg = document.getElementById("gift-card-msg");
  const syncGift = () => {
    const val = Number(sum.value);
    sumLabel.textContent = money(val);
    cardSum.textContent = money(val);
    cardTo.textContent = toIn.value.trim() || "••••";
    cardFrom.textContent = fromIn.value.trim() || "••••";
    cardMsg.textContent = msgIn.value.trim() || "Ваше пожелание появится здесь";
  };
  [sum, toIn, fromIn, msgIn].forEach((el) => el?.addEventListener("input", syncGift));
  syncGift();

  // Masters board
  const masters = [
    { name: "Алина — волосы", status: "free", slot: "Свободна сейчас", select: "Алина — волосы" },
    { name: "Мария — цвет", status: "soon", slot: "Через 40 мин", select: "Мария — цвет" },
    { name: "Катя — маникюр", status: "free", slot: "Слот 13:00", select: "Катя — маникюр" },
  ];
  const board = document.getElementById("board-list");
  const masterSelect = document.getElementById("book-master");
  if (board) {
    board.innerHTML = masters
      .map(
        (m, i) => `
      <button type="button" class="board__item" data-master="${m.select}" data-i="${i}">
        <div>
          <h3>${m.name}</h3>
          <p class="board__meta">Нажмите, чтобы выбрать в записи</p>
        </div>
        <span class="board__status ${m.status === "free" ? "is-free" : "is-soon"}">${m.status === "free" ? "Свободна" : "Скоро"}</span>
        <span class="board__slot">${m.slot}</span>
      </button>`
      )
      .join("");
    board.querySelectorAll(".board__item").forEach((item) => {
      item.addEventListener("click", () => {
        board.querySelectorAll(".board__item").forEach((x) => x.classList.remove("is-active"));
        item.classList.add("is-active");
        if (masterSelect) masterSelect.value = item.dataset.master;
        document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Stories viewer
  const storyData = [
    { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80", cap: "Окрашивание · сегодня" },
    { img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80", cap: "Маникюр · детали" },
    { img: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=900&q=80", cap: "Укладка · процесс" },
    { img: "https://images.unsplash.com/photo-1521590832167-7bcbfaaae1b0?auto=format&fit=crop&w=900&q=80", cap: "Зал салона" },
  ];
  const modal = document.getElementById("story-modal");
  const storyImg = document.getElementById("story-img");
  const storyCap = document.getElementById("story-cap");
  const progress = document.getElementById("story-progress");
  let storyTimer;
  let storyIdx = 0;

  const closeStory = () => {
    clearTimeout(storyTimer);
    modal.hidden = true;
    document.body.style.overflow = "";
    progress.style.width = "0%";
  };

  const openStory = (idx) => {
    storyIdx = idx;
    const s = storyData[storyIdx];
    if (!s) return closeStory();
    storyImg.src = s.img;
    storyCap.textContent = s.cap;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    progress.style.transition = "none";
    progress.style.width = "0%";
    requestAnimationFrame(() => {
      progress.style.transition = "width 4s linear";
      progress.style.width = "100%";
    });
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => openStory(storyIdx + 1), 4000);
  };

  document.querySelectorAll(".story").forEach((btn) => {
    btn.addEventListener("click", () => openStory(Number(btn.dataset.story)));
  });
  document.getElementById("story-close")?.addEventListener("click", closeStory);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeStory();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeStory();
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
  });
})();
