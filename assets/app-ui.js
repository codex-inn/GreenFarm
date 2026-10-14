(() => {
  const current = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  document.querySelectorAll(".gf-nav a[href]").forEach((link) => {
    const target = (link.getAttribute("href") || "").split("#")[0];
    if (target === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
