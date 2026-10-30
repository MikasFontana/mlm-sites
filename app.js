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

// cases de sucesso: cartão abre um box de vidro com tudo o que a MLM fez
const CASES = [
  { id: "curapro", name: "CuraPro", sub: "Marca, site, cursos, eventos e campanhas", img: "img/curapro/manual.webp", tag: "PARCERIA DE PONTA A PONTA",
    intro: "Da marca ao evento: criamos a identidade da CuraPro e cuidamos de tudo o que nasceu dela.",
    items: ["Branding: logo em 4 versões, manual da marca, cores, fontes e ícones", "Identidade aplicada: camisetas, cartões, adesivos, folders e materiais", "Site, landing pages e plataforma de cursos", "Roteiro, gravação presencial e edição da VSL", "Eventos, feiras, lives e palestras: captação, estande e recepção", "Campanhas: criativos, artes e materiais de divulgação", "Reuniões, visitas presenciais e acompanhamento no dia a dia"],
    steps: ["Reuniões e visitas presenciais", "Branding e manual da marca", "Peças e materiais impressos", "Site, LPs e plataforma de cursos", "Roteiro, gravação e VSL", "Eventos, lives e acompanhamento"],
    photos: ["img/curapro/manual.webp", "img/curapro/estande.webp", "img/curapro/plateia.webp", "img/design/camisetas-1.webp", "img/design/cartoes-1.webp", "img/design/adesivos-1.webp", "img/cases/curapro-folder-jarvis.webp", "img/sites/curapro.jpg"] },
  { id: "vidafit", name: "VidaFit Academia", sub: "Social mídia, tráfego pago e identidade", img: "img/cases/vidafit-logo.webp", tag: "DO ZERO",
    intro: "Começamos do zero com a VidaFit e construímos a presença digital inteira.",
    items: ["Criação do logo e da identidade visual", "Social mídia: planejamento, artes e publicações", "Tráfego pago", "Edição de vídeos"],
    mock: "crm", photos: ["img/cases/vidafit-logo.webp", "img/social/vidafit.webp"] },
  { id: "charles", name: "Professor Charles", sub: "Videoaulas, lives e plataforma de cursos", img: "img/cases/charles-logo.webp", tag: "DO ZERO",
    intro: "Do logo ao lançamento do curso: estruturamos tudo para o professor.",
    items: ["Criação do logo", "Videoaulas: gravação orientada e edição", "Postagens e social mídia", "Lives, com configuração e acompanhamento do OBS", "Lançamento do curso", "Estruturação completa da plataforma de cursos"],
    mock: "plataforma", link: "https://charlesazevedo.hotmart.host/cursodireitoempresarial", linkText: "Ver a página do curso", photos: ["img/cases/charles-logo.webp", "img/cases/charles-post-1.webp", "img/cases/charles-post-2.webp", "img/cases/charles-post-3.webp", "img/cases/charles-post-4.webp", "img/cases/charles-post-5.webp", "img/social/charles.webp"] },
  { id: "witte", name: "Captain Witte", sub: "Edição, página, tráfego e plataforma de cursos", img: "img/cases/witte-captv.webp", tag: "PARCERIA COMPLETA",
    intro: "Cuidamos da parte técnica e do atendimento para o professor focar em ensinar.",
    items: ["Edição de vídeos", "Logotipo", "Página de apresentação", "Tráfego pago", "Estruturação do curso na plataforma de cursos", "Atendimento ao aluno e suporte", "Lives: configuração do OBS e acompanhamento"],
    mock: "plataforma", photos: ["img/cases/witte-logo.png", "img/cases/witte-captv.webp", "img/cases/witte-banner.webp", "img/cases/witte-duvida.webp"] },
  { id: "qualis", name: "Qualis Concursos", sub: "Plataforma, tráfego, CRM e apoio ao aluno", img: "img/cases/qualis-logo.webp", tag: "OPERAÇÃO COMPLETA",
    intro: "Somos a retaguarda da operação: da plataforma ao relacionamento com o aluno.",
    items: ["Plataforma de cursos: parte administrativa de todos os cursos", "Tráfego pago", "Criativos e edição de vídeos para tráfego", "CRM, vendas e apoio ao aluno", "Atendimento aos alunos"],
    photos: ["img/cases/qualis-logo.webp", "img/cases/qualis-vendas.webp", "img/sites/qualis.jpg"] },
  { id: "squad", name: "Squad Concursos", sub: "Estúdio, agenda, plataforma e lives", img: "img/cases/squad-estudio-1.webp", tag: "GESTÃO DO ESTÚDIO",
    intro: "Cuidamos do estúdio de gravação e de toda a operação do ensino a distância.",
    items: ["Gestão do estúdio e das gravações", "Contato com os professores, agenda do estúdio e grade de gravação", "Site da escola", "Plataforma de cursos", "Atendimento ao aluno pelo site", "Lives: realização e acompanhamento"],
    photos: ["img/cases/squad-site.webp", "img/cases/squad-estudio-1.webp", "img/cases/squad-estudio-2.webp", "img/cases/squad-camera.webp", "img/cases/squad-teleprompter.webp"] },
  { id: "maepancreas", name: "MaePancreas", sub: "Lives de lançamento e acompanhamento de cursos", img: "img/cases/maepancreas-card.webp", tag: "BASTIDORES DO LANÇAMENTO", handle: "@maepancreas", video: "img/cases/maepancreas.mp4",
    intro: "Acompanhamos os cursos da MaePancreas e fazemos a live de lançamento acontecer, junto com ela.",
    items: ["Acompanhamento dos cursos", "Responsabilidade pelas lives de lançamento, junto com ela", "Cuidado com o público e com o chat", "Troca de cenas e condução técnica da live"],
    photos: ["img/cases/maepancreas-banner.webp"] },
];
$("#casegrid").innerHTML = CASES.map((c) => `<div class="glass ph rv in" role="button" tabindex="0" data-case="${c.id}" ${c.img ? `data-img="${c.img}"` : ""}><b>${c.name}<small>${c.sub}</small></b></div>`).join("");
CASES.filter((c) => c.pos).forEach((c) => { $(`[data-case="${c.id}"]`).style.backgroundPosition = c.pos; });
$$("#casegrid [data-img]").forEach((el) => { const im = new Image(); im.onload = () => { el.style.backgroundImage = `url(${im.src})`; el.classList.add("has-img"); }; im.src = el.dataset.img; });

// ilustrações: telas desenhadas para mostrar o tipo de trabalho, sem nenhum dado real
const TAG = { b: "Tráfego pago", g: "Positivo", l: "Matrícula", y: "Pendente", x: "Não compareceu", r: "Sem retorno", p: "Yoga", o: "Indicação" };
const MOCKS = {
  crm: () => {
    const rows = [["Aluna 01", "08/10", "Experimental", "b g"], ["Aluno 02", "06/10", "Experimental", "b l"], ["Aluna 03", "05/10", "Experimental", "p b g"], ["Aluno 04", "03/10", "Experimental", "b x"], ["Aluna 05", "02/10", "Visita", "o y"], ["Aluno 06", "09/10", "Experimental", "b r"]];
    return `<div class="mock"><div class="mock-h"><b>CRM · aulas experimentais</b><em>exemplo ilustrativo</em></div><table><thead><tr><th>Nome</th><th>Aula</th><th>Retorno</th></tr></thead><tbody>${rows.map(([n, d, t, g]) => `<tr><td>${n}</td><td>${d} · ${t.slice(0, 4)}.</td><td>${g.split(" ").map((k) => `<span class="tg t-${k}">${TAG[k]}</span>`).join("")}</td></tr>`).join("")}</tbody></table></div>`;
  },
  plataforma: () => `<div class="mock plat"><div class="mock-h"><b>Plataforma de cursos</b><em>exemplo ilustrativo</em></div><div class="plat-body"><div class="plat-side"><i class="on">Módulo 1 · Introdução</i><i>Módulo 2 · Fundamentos</i><i>Módulo 3 · Prática</i><i>Módulo 4 · Avaliação</i></div><div class="plat-main"><div class="vid"><span>&#9654;</span></div><b>Aula 03 · Título da aula</b><div class="bar"><u></u></div><small>Seu progresso no curso</small><ul><li class="ok">Aula 01</li><li class="ok">Aula 02</li><li class="now">Aula 03</li><li>Aula 04</li></ul></div></div></div>`,
};
function openCase(id) {
  const c = CASES.find((x) => x.id === id);
  $("#cs-tag").textContent = c.tag;
  $("#cs-name").textContent = c.name;
  $("#cs-intro").innerHTML = c.intro + (c.handle ? ` <b class="handle">${c.handle}</b>` : "");
  $("#cs-list").innerHTML = c.items.map((t) => `<li>${t}</li>`).join("");
  $("#cs-flow").innerHTML = (c.steps || []).map((t, i) => `<div><b>0${i + 1}</b><span>${t}</span></div>`).join("");
  $("#cs-flow").style.display = c.steps ? "" : "none";
  $("#cs-photos").innerHTML = (c.video ? `<video src="${c.video}" autoplay muted loop playsinline controls></video>` : "") + (c.mock ? MOCKS[c.mock]() : "") + c.photos.map((p) => `<img src="${p}" alt="${c.name}" loading="lazy">`).join("");
  $("#casem .casebox").classList.toggle("nophoto", !(c.photos.length || c.video || c.mock));
  $("#casem .casebox").scrollTop = 0;
  const lk = $("#cs-link");
  lk.hidden = !c.link;
  if (c.link) { lk.href = c.link; lk.textContent = c.linkText || "Ver mais"; }
  modal("casem", true);
}
document.addEventListener("click", (e) => { const k = e.target.closest("[data-case]"); if (k) openCase(k.dataset.case); });
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.case) openCase(e.target.dataset.case); });
