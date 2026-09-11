/* 只管理展示交互，不发起业务 API 请求。 */
const root = document.documentElement;
const languageButton = document.querySelector("#languageToggle");
const themeButton = document.querySelector("#themeToggle");
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
  const dark = root.dataset.theme !== "light";
  languageButton.textContent = english ? "中" : "EN";
  languageButton.setAttribute(
    "aria-label",
    english ? "切换到中文" : "Switch to English",
  );
  themeButton.setAttribute(
    "aria-label",
    english
      ? dark
        ? "Switch to light mode"
        : "Switch to dark mode"
      : dark
        ? "切换到浅色模式"
        : "切换到深色模式",
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
    .querySelector(".workflow-tabs")
    .setAttribute("aria-label", english ? "Task setup flow" : "任务配置流程");
  productImage.alt = english
    ? activeScreen === "home"
      ? "Actual WDM workspace interface"
      : "Actual WDM sign-in interface"
    : activeScreen === "home"
      ? "WDM 工作台真实界面"
      : "WDM 登录页真实界面";
  document.querySelector('meta[name="theme-color"]').content = dark
    ? "#101318"
    : "#f6f7f9";
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
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  save("wdm-theme", root.dataset.theme);
  updateControls();
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
    activeScreen === "home" ? "home-screen.png" : "login-screen.png";
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

applyLanguage();
setupScrollReveal();
