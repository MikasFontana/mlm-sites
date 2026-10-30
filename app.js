const WHATS = "5511993697470";
const MAIL = "mlm.assessoriavirtual@gmail.com";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const SERVICES = [
  { id: "edicao", cta: "Quero um vídeo assim", ic: "🎬", n: "Edição de vídeos", p: "Seu vídeo é a primeira impressão. Nós a transformamos na que fica na memória e leva à ação." },
  { id: "captacoes", cta: "Me ajude a me gravar", ic: "🎥", n: "Captações", p: "Você chega, nós cuidamos de luz, som, câmera e direção. O resultado tem cara de produção grande." },
  { id: "design", cta: "Quero minhas peças de design", ic: "🎨", n: "Design", p: "Uma marca forte se reconhece em cada peça, da camiseta ao banner." },
  { id: "sites", cta: "Quero meu site ou página", ic: "🌐", n: "Sites e LP", p: "Um site que explica, convence e leva o visitante até o clique." },
  { id: "social", cta: "Me ajuda com minhas redes sociais", ic: "📱", n: "Social Mídia", p: "Presença todos os dias, com conteúdo que tem intenção. Sua marca lembrada." },
  { id: "trafego", cta: "Quero anunciar com estratégia", ic: "🚀", n: "Tráfego Pago", p: "O anúncio certo, para a pessoa certa, na hora certa. Atenção virando cliente." },
];

const SITES = [
  { n: "CuraPro • Curso de Extensão", d: "Landing page do curso (rascunho)", u: "https://regal-narwhal-941755.netlify.app/", i: "curapro" },
  { n: "Oficina do BirutIA", d: "Site infantil animado", u: "https://mikasfontana.github.io/oficina-do-birutia/", i: "birutia" },
  { n: "Captain Witte", d: "Site de apresentação", u: "https://captainwitte.com.br/", i: "captain" },
  { n: "Eterina Brasil", d: "Lápides, entrada cinematográfica", u: "https://eduardoplacas.github.io/eduardo-placas/", i: "eterina" },
  { n: "Qualis Concursos", d: "Site de cursos e concursos", u: "https://www.qualisconcursos.com.br/", i: "qualis" },
  { n: "Professor Sérgio", d: "Site do professor", u: "https://sergiorbgadelha.com.br/", i: "sergio" },
];

// anel 3D
const ring = $("#ring");
SERVICES.forEach((s, k) => {
  const d = document.createElement("div");
  d.className = "glass";
  d.style.transform = `rotateY(${(k * 360) / SERVICES.length}deg) translateZ(var(--r))`;
  d.dataset.img = `img/servicos/${s.id}.webp`;
  d.innerHTML = `<b>${s.n}</b>`;
  d.onclick = () => openSvc(s);
  ring.appendChild(d);
});

// rotação do anel: Edição de vídeos começa na frente; os cartões de trás ficam apagados e desfocados
let target = null, ang = 0, hold = performance.now() + 2000, hover = false;
const cards = $$("#ring .glass"), still = matchMedia("(prefers-reduced-motion: reduce)").matches;
$(".scene").addEventListener("mouseenter", () => (hover = true));
$(".scene").addEventListener("mouseleave", () => (hover = false));
function go(dir) {
  const th = 360 / cards.length, cur = Math.round((((-ang % 360) + 360) % 360) / th) % cards.length;
  target = ((((-(cur + dir) * th) % 360) + 360) % 360);
  hold = performance.now() + 7000;
}
$(".arr.l").onclick = () => go(-1);
$(".arr.r").onclick = () => go(1);
(function tick(now) {
  if (target !== null) {
    const d = ((target - ang + 540) % 360) - 180;
    ang = (((ang + d * 0.12) % 360) + 360) % 360;
    if (Math.abs(d) < 0.2) { ang = target; target = null; }
  } else if (!hover && !still && now > hold) ang = (ang + 0.35) % 360;
  ring.style.transform = `rotateY(${ang}deg)`;
  cards.forEach((c, k) => {
    const z = (Math.cos(((k * 360) / cards.length + ang) * Math.PI / 180) + 1) / 2;
    c.style.opacity = (0.3 + 0.7 * z).toFixed(2);
    c.style.filter = `blur(${((1 - z) * 3).toFixed(1)}px)`;
  });
  requestAnimationFrame(tick);
})(performance.now());

const modal = (id, on) => $("#" + id).classList.toggle("on", on);
function openSvc(s) {
  $("#sm-tag").textContent = s.n.toUpperCase();
  $("#sm-t").textContent = s.n;
  $("#sm-p").textContent = s.p;
  const go = $("#sm-go");
  go.href = "#" + s.id;
  go.onclick = () => modal("svcm", false);
  const c = $("#sm-cta");
  c.textContent = s.cta;
  c.dataset.msg = s.cta;
  modal("svcm", true);
}

// vídeos
const V = window.VIDEOS || {};
const card = (v) => `<div class="vc" data-id="${v.id}"><img loading="lazy" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt=""><span>${v.t}</span></div>`;
const TABS = [["vsl", "VSL"], ["reels", "Reels e Shorts"], ["videoaulas", "Vídeo-aulas"], ["vinhetas", "Vinhetas"], ["youtube", "YouTube e Podcast"], ["eventos", "Eventos e institucionais"]];
let cur = "vsl", all = false;
let inView = false;
function wave() {
  $$("#vgrid .vc").forEach((v, i) => { v.style.setProperty("--i", Math.min(i, 11)); v.classList.remove("wave"); void v.offsetWidth; v.classList.add("wave"); });
}
new IntersectionObserver((es) => es.forEach((en) => { inView = en.isIntersecting; if (inView) wave(); }), { threshold: 0.3 }).observe($("#vgrid"));
function drawVideos() {
  const list = V[cur] || [];
  $("#vgrid").innerHTML = (all ? list : list.slice(0, 6)).map(card).join("");
  $("#more").style.display = !all && list.length > 6 ? "" : "none";
  $$("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.k === cur));
  if (inView) wave();
}
$("#tabs").innerHTML = TABS.map(([k, n]) => `<button data-k="${k}">${n}</button>`).join("");
$("#tabs").onclick = (e) => { if (e.target.dataset.k) { cur = e.target.dataset.k; all = false; drawVideos(); } };
$("#more").onclick = () => { all = true; drawVideos(); };
drawVideos();
$("#live").innerHTML = (V["ao-vivo"] || []).map(card).join("");


// sites
$("#sitegrid").innerHTML = SITES.map((s) => {
  const inner = `<div class="shot"><img loading="lazy" src="img/sites/${s.i}.jpg" alt="${s.n}" onerror="this.remove()"></div><div><b>${s.n}</b><small>${s.d}</small></div>`;
  return s.u ? `<a class="glass site rv" href="${s.u}" target="_blank" rel="noopener">${inner}</a>` : `<div class="glass site rv">${inner}</div>`;
}).join("");

// galeria de design: quantas imagens cada cartão tem em img/design/<nome>-N.webp
const GAL = { camisetas: 10, adesivos: 3, cartoes: 3 };
$$(".ph[data-gal]").forEach((el) => { if (GAL[el.dataset.gal]) el.classList.add("zoom"); });
function openGal(name, title) {
  $("#gal-t").textContent = title;
  $("#galgrid").innerHTML = Array.from({ length: GAL[name] }, (_, i) => `<img loading="lazy" src="img/design/${name}-${i + 1}.webp" alt="${title}">`).join("");
  modal("galm", true);
}

// lightbox de vídeo
document.addEventListener("click", (e) => {
  const ph = e.target.closest(".ph.zoom");
  if (ph) openGal(ph.dataset.gal, $("b", ph).textContent);
  const vc = e.target.closest(".vc");
  if (vc) {
    $("#vidm .frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${vc.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    modal("vidm", true);
  }
  const dc = e.target.closest("[data-contact]");
  if (dc) {
    setContact(dc.dataset.msg || "");
    modal("svcm", false);
    modal("contm", true);
  }
  if (e.target.closest("[data-close]") || e.target.classList.contains("modal")) {
    $$(".modal").forEach((m) => m.classList.remove("on"));
    $("#vidm .frame").innerHTML = "";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  $$(".modal").forEach((m) => m.classList.remove("on"));
  $("#vidm .frame").innerHTML = "";
});

// contato
function setContact(topic) {
  const t = topic || "gostaria de falar sobre um projeto";
  $("#c-wa").href = `https://wa.me/${WHATS}?text=${encodeURIComponent("Olá! Vim pelo site da MLM. " + t + ".")}`;
  $("#c-em").href = `mailto:${MAIL}?subject=${encodeURIComponent("Contato pelo site: " + t)}`;
}
setContact("");
$("#curso-link").href = "https://hotmart.com/pt-br/club/obs-sem-segredo";
$("#curso-link").target = "_blank";
$("#curso-link").rel = "noopener";

// inclinação 3D nos cartões de contato
$$(".tilt, .tilt3d .disc").forEach((t) => {
  t.onmousemove = (e) => {
    const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translateZ(20px)`;
  };
  t.onmouseleave = () => (t.style.transform = "");
});

// revelar ao rolar + contadores
const io = new IntersectionObserver((es) => es.forEach((en) => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  $$("[data-n]", en.target).forEach((b) => {
    const to = +b.dataset.n; let i = 0;
    const t = setInterval(() => { i = Math.min(to, i + Math.ceil(to / 30)); b.textContent = i.toLocaleString("pt-BR") + (b.dataset.p || ""); if (i >= to) clearInterval(t); }, 40);
  });
  io.unobserve(en.target);
}), { threshold: 0.15 });
$$(".rv").forEach((e) => io.observe(e));

// régua do processo e botão de subir
const ruler = $("#ruler"), nodes = $$(".node", ruler), totop = $("#totop");
function onScroll() {
  const r = ruler.getBoundingClientRect(), vh = innerHeight;
  const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.1)));
  ruler.style.setProperty("--p", p.toFixed(3));
  nodes.forEach((n, i) => n.classList.toggle("on", p >= i / (nodes.length - 1) - 0.02 && p > 0));
  totop.classList.toggle("on", scrollY > 700);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// imagens dos cartões: entram quando o arquivo existir (senão fica o fundo em degradê)
$$("[data-img]").forEach((el) => {
  const im = new Image();
  im.onload = () => {
    if (el.hasAttribute("data-layer")) { const bg = document.createElement("i"); bg.className = "bg"; bg.style.backgroundImage = `url(${im.src})`; el.prepend(bg); }
    else el.style.backgroundImage = `url(${im.src})`;
    el.classList.add("has-img");
  };
  im.src = el.dataset.img;
});
$$("[data-bg]").forEach((el) => {
  const im = new Image();
  im.onload = () => { el.style.backgroundImage = `url(${im.src})`; el.classList.add("has-img"); };
  im.src = el.dataset.bg;
});

// brilho laranja e roxo que acompanha o mouse (só com mouse de verdade; sem animação se o usuário pediu menos movimento)
if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const g = [[$(".glow.o"), 0.14, 0, 0], [$(".glow.p"), 0.06, 140, -90]].map(([el, k, dx, dy]) => ({ el, k, dx, dy, x: innerWidth / 2, y: innerHeight / 2 }));
  let mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; document.body.classList.add("glowing"); }, { passive: true });
  (function glow() {
    g.forEach((o) => {
      o.x += (mx + o.dx - o.x) * o.k;
      o.y += (my + o.dy - o.y) * o.k;
      o.el.style.transform = `translate(${o.x - 170}px, ${o.y - 170}px)`;
    });
    requestAnimationFrame(glow);
  })();
}

// Captações: ao chegar na dobra os cartões acendem em sequência e voltam a ficar apagados
new IntersectionObserver((es) => es.forEach((en) => {
  if (!en.isIntersecting) return;
  $$(".cap", en.target).forEach((c, i) => { c.style.setProperty("--i", i); c.classList.remove("wave"); void c.offsetWidth; c.classList.add("wave"); });
}), { threshold: 0.35 }).observe($("#captacoes .cards3"));
