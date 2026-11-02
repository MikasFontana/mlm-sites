// Entrada da MLM (prévia): a logo flutua e vira; ao girar se desconstrói em 6 pedaços e cada um voa até o seu cartão do carrossel.
// Linha do tempo (ms): 0-2000 flutua e vira | 2000-2900 abre os pedaços | 3000+ cada pedaço voa (120 ms entre eles) | ~6300 fim.
// Uma vez por sessão; sem animação se o aparelho pede menos movimento. ?entrada repete; window.__entradaT = ms trava o quadro (teste).
(() => {
  const b = document.body;
  let jaViu = false;
  try { jaViu = sessionStorage.getItem("mlm-entrada") === "1"; } catch (e) {}
  if (/entrada/.test(location.search)) jaViu = false;
  const solta = () => document.documentElement.classList.remove("pre-i");
  if (jaViu || matchMedia("(prefers-reduced-motion:reduce)").matches || location.hash) return solta();
  try { sessionStorage.setItem("mlm-entrada", "1"); } catch (e) {}
  const scene = document.querySelector(".scene");
  const cards = [...document.querySelectorAll("#ring .glass")];
  if (!scene || !cards.length) return solta();
  const N = cards.length;
  const S = Math.min(340, innerWidth * 0.62);
  const ease = (x) => (x < 0 ? 0 : x > 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const intro = document.createElement("div");
  intro.id = "intro";
  const pcs = [];
  for (let k = 0; k < N; k++) {
    const a1 = ((k - 0.5) * 360) / N - 1.2, a2 = ((k + 0.5) * 360) / N + 1.2, am = (k * 360) / N;
    const p = (a) => `${50 + 100 * Math.cos((a - 90) * Math.PI / 180)}% ${50 + 100 * Math.sin((a - 90) * Math.PI / 180)}%`;
    const d = document.createElement("div");
    d.className = "pc";
    d.style.cssText = `width:${S}px;height:${S}px;margin:${-S / 2}px 0 0 ${-S / 2}px;background-image:url(img/logo-mlm-simbolo.png);clip-path:polygon(50% 50%,${p(a1)},${p(am)},${p(a2)})`;
    intro.appendChild(d);
    pcs.push({ d, ang: am - 90 });
  }
  b.appendChild(intro);
  b.classList.add("pre", "fx");
  b.style.overflow = "hidden";
  scrollTo(0, 0);
  scene.dispatchEvent(new MouseEvent("mouseenter")); // segura o giro do anel enquanto os pedaços chegam
  cards.forEach((c) => c.classList.add("oc"));
  solta(); // o <head> já escondeu tudo desde o primeiro quadro; agora quem esconde é a própria animação
  const alvo = cards.map((c) => {
    const r = c.getBoundingClientRect();
    return { dx: r.left + r.width / 2 - innerWidth / 2, dy: r.top + r.height / 2 - innerHeight / 2, sx: r.width / S, sy: r.height / S };
  });
  const T_ABRE = 2000, T_VOA = 3000, ATRASO = 120, DUR = 1100, FIM = T_VOA + (N - 1) * ATRASO + DUR + 700;
  let t0 = null, feito = false;
  const quadro = (now) => {
    if (t0 === null) t0 = now;
    const t = window.__entradaT !== undefined ? window.__entradaT : now - t0;
    const e = ease((t - T_ABRE) / 900);
    pcs.forEach((o, k) => {
      const fl = Math.sin((t * 2 * Math.PI) / 3200);
      const rad = (o.ang * Math.PI) / 180;
      const sinal = k % 2 ? 1 : -1;
      let x = Math.cos(rad) * 80 * e, y = Math.sin(rad) * 80 * e + fl * 12 * (1 - e);
      let rz = sinal * 16 * e, ry = 24 * fl * (1 - e) + 90 * e, sx = 1, sy = 1, op = 1;
      const f = ease((t - T_VOA - k * ATRASO) / DUR);
      if (f > 0) {
        x += (alvo[k].dx - x) * f; y += (alvo[k].dy - y) * f;
        sx = 1 + (alvo[k].sx - 1) * f; sy = 1 + (alvo[k].sy - 1) * f;
        rz *= 1 - f; ry *= 1 - f;
      }
      const chegou = T_VOA + k * ATRASO + DUR;
      if (t > chegou) op = Math.max(0, 1 - (t - chegou) / 500);
      o.d.style.opacity = op;
      o.d.style.transform = `translate(${x}px,${y}px) rotateZ(${rz}deg) rotateY(${ry}deg) scale(${sx},${sy})`;
      cards[k].classList.toggle("oc", t < chegou - 150);
    });
    b.classList.toggle("pre", t <= T_VOA + 3 * ATRASO);
    if (t >= FIM && window.__entradaT === undefined) {
      if (feito) return;
      feito = true;
      intro.remove();
      cards.forEach((c) => c.classList.remove("oc"));
      b.classList.remove("fx");
      b.style.overflow = "";
      scene.dispatchEvent(new MouseEvent("mouseleave"));
      return;
    }
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
})();
