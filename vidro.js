// Prévia do vidro: pílula deslizante na barra e brilho que segue o mouse nos boxes. Só com mouse.
(() => {
  if (!matchMedia("(hover:hover)").matches) return;
  const links = document.querySelector(".links");
  if (links) {
    const p = document.createElement("i");
    p.className = "pilula";
    links.prepend(p);
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("mouseenter", () => {
        p.style.left = a.offsetLeft + "px";
        p.style.width = a.offsetWidth + "px";
        links.classList.add("on");
      })
    );
    links.addEventListener("mouseleave", () => links.classList.remove("on"));
  }
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest && e.target.closest(".glass");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  });
})();
