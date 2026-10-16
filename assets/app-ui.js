(() => {
  "use strict";

  const lastPathPart = location.pathname.split("/").filter(Boolean).pop() || "";
  const current = /\.html?$/i.test(lastPathPart) ? lastPathPart : "index.html";
  const pageLabels = {
    "index.html": ["🏠", "Home"],
    "dashboard.html": ["📊", "Dashboard"],
    "crops.html": ["🌾", "Crops"],
    "livestock.html": ["🐄", "Livestock"],
    "activities.html": ["📅", "Activities"],
    "analytics.html": ["📈", "Analytics"],
    "reports.html": ["📄", "Reports"],
    "farm.html": ["🧰", "Workspace"],
    "advanced.html": ["🌱", "Farm Center"],
    "admin.html": ["⚙️", "Admin"]
  };
  const titles = {
    "index.html": "Farm Home",
    "dashboard.html": "Dashboard",
    "crops.html": "Crop Management",
    "livestock.html": "Livestock",
    "activities.html": "Farm Activities",
    "analytics.html": "Farm Analytics",
    "reports.html": "Farm Reports",
    "farm.html": "Farm Workspace",
    "advanced.html": "Farm Center",
    "admin.html": "Settings",
    "auth.html": "Farmer Access"
  };

  document.title = (titles[current] || "GreenFarm") + " | GreenFarm";
  const nav = document.querySelector(".gf-nav");
  if (nav) {
    const list = nav.querySelector(".nav-links");
    if (list) {
      list.querySelectorAll(".gf-more-toggle").forEach((el) => el.remove());
      nav.querySelectorAll(".gf-mobile-more").forEach((el) => el.remove());
      [...list.querySelectorAll("a[href]")].forEach((link) => {
        const target = new URL(link.href, location.href).pathname.split("/").filter(Boolean).pop() || "index.html";
        const [icon, label] = pageLabels[target] || ["•", link.textContent.trim()];
        const iconEl = document.createElement("span");
        iconEl.className = "nav-icon";
        iconEl.setAttribute("aria-hidden", "true");
        iconEl.textContent = icon;
        const labelEl = document.createElement("span");
        labelEl.className = "nav-label";
        labelEl.textContent = label;
        link.replaceChildren(iconEl, labelEl);
        link.classList.remove("gf-secondary-nav");
        if (target === current) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      });
    }
  }

  const readStore = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : {};
    } catch (_) {
      return {};
    }
  };
  const core = readStore("greenfarm.v2");
  const advanced = readStore("greenfarm.advanced.v1");
  const coreRecords = core.records && typeof core.records === "object" ? core.records : {};
  const countArrays = (value) => Object.values(value || {}).reduce((total, item) => total + (Array.isArray(item) ? item.length : 0), 0);
  const stats = {
    workspace: countArrays(coreRecords),
    center: countArrays(advanced),
    records: countArrays(coreRecords) + countArrays(advanced),
    fields: Array.isArray(advanced.fields) ? advanced.fields.length : 0,
    tasks: Array.isArray(advanced.tasks) ? advanced.tasks.length : 0
  };
  document.querySelectorAll("[data-gf-stat]").forEach((element) => {
    element.textContent = String(stats[element.dataset.gfStat] ?? 0);
  });
  document.querySelectorAll("[data-gf-date]").forEach((element) => {
    element.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  });
  const homeStatus = document.querySelector("[data-gf-home-status]");
  if (homeStatus) {
    const total = stats.workspace + stats.center;
    homeStatus.textContent = total
      ? total + " saved entries across your two separate, on-device workspaces."
      : "No records saved here yet. Add a field or crop record to get started.";
  }
})();