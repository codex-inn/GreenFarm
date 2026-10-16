(() => {
  "use strict";

  const lastPathPart = location.pathname.split("/").filter(Boolean).pop() || "";
  const current = /\.html?$/i.test(lastPathPart) ? lastPathPart : "index.html";
  const primaryPages = new Set(["index.html", "dashboard.html", "farm.html", "advanced.html"]);
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
    "planner.html": ["🗓️", "Planner"],
    "admin.html": ["⚙️", "Settings"]
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
    "planner.html": "Farm Planner",
    "admin.html": "Settings",
    "auth.html": "Farmer Access"
  };

  document.title = (titles[current] || "GreenFarm") + " | GreenFarm";
  const nav = document.querySelector(".gf-nav");
  if (nav) {
    const links = [...nav.querySelectorAll(".nav-links a[href]")];
    const currentIsSecondary = !primaryPages.has(current);

    links.forEach((link) => {
      const target = new URL(link.href, location.href).pathname.split("/").filter(Boolean).pop() || "index.html";
      const [icon, label] = pageLabels[target] || ["•", link.textContent.trim()];
      link.replaceChildren();
      const iconEl = document.createElement("span");
      iconEl.className = "nav-icon";
      iconEl.setAttribute("aria-hidden", "true");
      iconEl.textContent = icon;
      const labelEl = document.createElement("span");
      labelEl.className = "nav-label";
      labelEl.textContent = label;
      link.append(iconEl, labelEl);
      if (target === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
      if (!primaryPages.has(target)) link.classList.add("gf-secondary-nav");
    });

    const list = nav.querySelector(".nav-links");
    const secondaryLinks = links.filter((link) => link.classList.contains("gf-secondary-nav"));
    if (list && secondaryLinks.length) {
      const panel = document.createElement("div");
      panel.className = "gf-mobile-more";
      panel.id = "gf-mobile-more-panel";
      panel.setAttribute("aria-label", "More GreenFarm pages");
      secondaryLinks.forEach((link) => {
        const clone = link.cloneNode(true);
        if (link.getAttribute("aria-current") === "page") {
          clone.classList.add("active");
          clone.setAttribute("aria-current", "page");
        }
        panel.append(clone);
      });
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "gf-more-toggle";
      toggle.setAttribute("aria-controls", panel.id);
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span class="nav-icon" aria-hidden="true">☰</span><span class="nav-label">More</span>';
      if (currentIsSecondary) toggle.classList.add("is-current");
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("gf-more-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelector(".nav-label").textContent = open ? "Close" : "More";
      });
      panel.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
          nav.classList.remove("gf-more-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      const container = nav.querySelector(".container") || nav;
      container.insertBefore(panel, list);
      list.append(toggle);
      document.addEventListener("click", (event) => {
        if (!nav.contains(event.target) && nav.classList.contains("gf-more-open")) {
          nav.classList.remove("gf-more-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.querySelector(".nav-label").textContent = "More";
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("gf-more-open")) {
          nav.classList.remove("gf-more-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.querySelector(".nav-label").textContent = "More";
          toggle.focus();
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