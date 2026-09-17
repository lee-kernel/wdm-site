/* 只管理展示交互，不发起业务 API 请求。 */
const root = document.documentElement;
const languageButton = document.querySelector("#languageToggle");
const menuButton = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const productImage = document.querySelector("#productImage");
const translations = [...document.querySelectorAll("[data-en]")].map(
  (node) => ({ node, zh: node.innerHTML, en: node.dataset.en }),
);
let language = "zh";
let activeScreen = "home";
try {
  language = localStorage.getItem("wdm-lang") === "en" ? "en" : "zh";
} catch {
  /* 无存储权限时保持默认。 */
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 隐私模式不影响交互。 */
  }
}
function updateControls() {
  const english = language === "en";
  languageButton.textContent = english ? "中" : "EN";
  languageButton.setAttribute(
    "aria-label",
    english ? "切换到中文" : "Switch to English",
  );
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute(
    "aria-label",
    english
      ? expanded
        ? "Close navigation"
        : "Open navigation"
      : expanded
        ? "关闭导航"
        : "打开导航",
  );
  document
    .querySelector("nav")
    .setAttribute("aria-label", english ? "Main navigation" : "主导航");
  document
    .querySelector(".brand")
    .setAttribute("aria-label", english ? "WDM home" : "WDM 首页");
  document
    .querySelector(".work-map")
    .setAttribute(
      "aria-label",
      english ? "Illustrated workflow" : "工作流示意",
    );
  document.querySelector(".method-overview").setAttribute(
    "aria-label",
    english ? "Work method overview" : "工作方法概览",
  );
  document
    .querySelector(".screen-tabs")
    .setAttribute("aria-label", english ? "Product screenshots" : "产品截图");
  document
    .querySelector(".console-chips")
    .setAttribute("aria-label", english ? "Work content types" : "工作内容类型");
  document
    .querySelector(".console-run")
    .setAttribute("aria-label", english ? "Open WDM workspace" : "进入 WDM 工作台");
  document
    .querySelector(".workflow-tabs")
    .setAttribute("aria-label", english ? "Task setup flow" : "任务配置流程");
  productImage.alt = english
    ? activeScreen === "home"
      ? "Actual WDM workspace interface"
      : "Actual WDM sign-in interface"
    : activeScreen === "home"
      ? "WDM 工作台真实界面"
      : "WDM 登录页真实界面";
  document.querySelector('meta[name="theme-color"]').content = "#050608";
}
function applyLanguage() {
  root.lang = language === "en" ? "en" : "zh-CN";
  root.dataset.lang = language;
  translations.forEach(({ node, zh, en }) => {
    node.innerHTML = language === "en" ? en : zh;
  });
  document.title =
    language === "en"
      ? "WDM · Your intelligent workspace"
      : "WDM · 智能工作助手";
  const description =
    language === "en"
      ? "Capture daily and weekly reports, reuse prompts and scripts, and run scheduled or Webhook-triggered tasks in one workspace."
      : "WDM 智能工作助手：记录日报与周报，沉淀提示词和脚本，以定时任务与 Webhook 自动执行，让日常工作有积累。";
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content =
    description;
  updateControls();
}
languageButton.addEventListener("click", () => {
  language = language === "zh" ? "en" : "zh";
  save("wdm-lang", language);
  applyLanguage();
});
function closeMenu() {
  navLinks.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  updateControls();
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  navLinks.classList.toggle("is-open", expanded);
  menuButton.setAttribute("aria-expanded", String(expanded));
  updateControls();
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
/* Tab 支持方向键、Home/End，与鼠标使用同一激活路径。 */
function setupTabs(container, activate) {
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    activate(tab);
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next], true);
      }
    });
  });
}
setupTabs(document.querySelector(".screen-tabs"), (tab) => {
  activeScreen = tab.dataset.screen;
  productImage.src =
    activeScreen === "home"
      ? "assets/images/home-screen.png"
      : "assets/images/login-screen.png";
  document
    .querySelector("#screenPanel")
    .setAttribute("aria-labelledby", tab.id);
  updateControls();
});
setupTabs(document.querySelector(".workflow-tabs"), (tab) => {
  document.querySelectorAll(".flow-panel").forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute("aria-controls");
  });
});

/* 内容进入视口时按信息组渐进出现；减少动态偏好下保持静态。 */
function setupScrollReveal() {
  if (
    !window.IntersectionObserver ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const groups = [
    [".product-section .section-intro", ".product-frame", ".screen-caption"],
    ["#capabilities .section-intro"],
    [".feature-grid .feature"],
    [".flow-layout > div:first-child", ".flow-panels"],
    ["#architecture .section-intro", ".architecture-map", ".architecture-copy"],
    [".faq-section > div:first-child", ".faq-list details"],
    [".closing-inner", "footer"],
  ];
  const targets = [];

  groups.forEach((selectors) => {
    let order = 0;
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add("reveal-item");
        element.dataset.reveal = order === 0 ? "soft" : "default";
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(order, 5) * 75}ms`,
        );
        targets.push(element);
        order += 1;
      });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((target) => observer.observe(target));
}

/* 点阵独立于视频绘制；鼠标靠近时，点会被轻推并提高亮度。 */
function setupInteractiveField() {
  const field = document.querySelector(".hero-field");
  const canvas = document.querySelector(".field-canvas");
  if (!field || !canvas) return;

  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const cursor = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let active = false;

  function draw() {
    context.clearRect(0, 0, width, height);
    const spacing = width < 600 ? 20 : 24;
    const dot = "255, 255, 255";

    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = active ? Math.max(0, 1 - distance / 150) : 0;
        const push = influence * influence * 13;
        const px = x + (dx / distance) * push;
        const py = y + (dy / distance) * push;
        const radius = .85 + influence * 1.45;
        const alpha = .13 + influence * .7;

        context.beginPath();
        context.arc(px, py, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${dot}, ${alpha})`;
        context.fill();
      }
    }
  }

  function animate() {
    cursor.x += (cursor.targetX - cursor.x) * .2;
    cursor.y += (cursor.targetY - cursor.y) * .2;
    draw();
    if (
      Math.abs(cursor.targetX - cursor.x) > .25 ||
      Math.abs(cursor.targetY - cursor.y) > .25
    ) {
      frame = requestAnimationFrame(animate);
    } else {
      frame = 0;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(animate);
  }

  function resize() {
    const rect = field.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    draw();
  }

  function handlePointer(event) {
    if (reducedMotion.matches || !finePointer.matches) return;
    const rect = field.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    active = inside;
    if (inside) {
      cursor.targetX = event.clientX - rect.left;
      cursor.targetY = event.clientY - rect.top;
    }
    schedule();
  }

  window.addEventListener("pointermove", handlePointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    active = false;
    draw();
  });
  new ResizeObserver(resize).observe(field);
  resize();
}

function setupScrollHeader() {
  const header = document.querySelector(".nav-shell");
  if (!header) return;

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

applyLanguage();
setupScrollReveal();
setupInteractiveField();
setupScrollHeader();
