(() => {
  const progressBar = document.querySelector(".progress__bar");
  const reveals = document.querySelectorAll(".reveal");
  const root = document.documentElement;

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
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => io.observe(el));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  let spotRaf = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        root.style.setProperty("--spot-x", `${x}%`);
        root.style.setProperty("--spot-y", `${y}%`);
        spotRaf = 0;
      });
    },
    { passive: true }
  );

  const fits = {
    cafe: {
      title: "Короткий лендинг + кнопки связи",
      text: "Меню, фото атмосферы, адрес, часы, WhatsApp. Ссылку вешаем в Яндекс Карты — люди уже ищут вас там.",
      price: "Ориентир: 5–7 тыс. ₽ · уточним по задаче",
    },
    club: {
      title: "Атмосферный лендинг клуба или салона",
      text: "Услуги/зоны, фото, отзывы, запись звонком или в мессенджере. Чтобы с Карт сразу было куда нажать.",
      price: "Ориентир: 5–7 тыс. ₽ · уточним по задаче",
    },
    shop: {
      title: "Онлайн-магазин / каталог",
      text: "Каталог, карточки товаров, корзина или заявка, контакты и оплата/доставка — под ваш формат продаж.",
      price: "Ориентир: 12–15 тыс. ₽ · зависит от объёма",
    },
    card: {
      title: "Сайт-визитка",
      text: "Коротко о вас, услуги, контакты, кнопки связи. Минимум страниц — максимум ясности с телефона.",
      price: "Ориентир: 4–5 тыс. ₽ · уточним по задаче",
    },
    company: {
      title: "Сайт для компании",
      text: "Услуги, кейсы, о компании, заявка. Солидно выглядит на телефоне и нормально отдаёт лиды.",
      price: "Ориентир: 10–15 тыс. ₽ · по объёму блоков",
    },
  };

  const chips = document.querySelectorAll(".fit__chips .chip");
  const title = document.getElementById("fit-title");
  const text = document.getElementById("fit-text");
  const price = document.getElementById("fit-price");
  const result = document.getElementById("fit-result");

  const selectFit = (key, { scroll = false } = {}) => {
    const data = fits[key];
    if (!data) return;

    chips.forEach((c) => {
      const active = c.dataset.fit === key;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-selected", active ? "true" : "false");
    });

    const apply = () => {
      title.textContent = data.title;
      text.textContent = data.text;
      price.textContent = data.price;
    };

    if (result) {
      result.style.opacity = "0";
      result.style.transform = "translateY(6px)";
      result.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      window.setTimeout(() => {
        apply();
        result.style.opacity = "1";
        result.style.transform = "none";
      }, 160);
    } else {
      apply();
    }

    if (scroll) {
      document.getElementById("fit")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => selectFit(chip.dataset.fit));
  });

  document.querySelectorAll(".work__format").forEach((btn) => {
    btn.addEventListener("click", () => selectFit(btn.dataset.fit, { scroll: true }));
  });
})();
