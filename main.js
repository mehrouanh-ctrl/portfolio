const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const page = document.body.dataset.page, D = SITE.domaines, ids = Object.keys(D);
const url = id => id === 'home' ? 'index.html' : id + '.html';
const first = SITE.nom.split(' ')[0], last = SITE.nom.split(' ').slice(1).join(' ');

/* ---------- Structure commune ---------- */
const header = `<header class="top"><a href="index.html" class="brand">${first[0]}<span>.</span>${last}</a>
<nav>${['home', ...ids].map(i => `<a href="${url(i)}" class="${i === page ? 'on' : ''}">${i === 'home' ? 'Accueil' : D[i].titre}</a>`).join('')}</nav></header>`;

const footer = `<footer class="foot"><p class="eyebrow rv">Un projet en tête ?</p>
<h2 class="rv">Parlons-en<span>.</span></h2>
<a class="btn big rv" href="mailto:${SITE.email}">${SITE.email}</a>
<div class="foot-links rv"><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a><a href="tel:${SITE.tel.replace(/\s/g, '')}">${SITE.tel}</a></div>
<small>© ${new Date().getFullYear()} ${SITE.nom}</small></footer>`;

const card = (id, i) => `<article class="card tilt rv" style="--d:${i * .12}s"><div class="photo"><img src="${D[id].img}" alt="${D[id].titre}" loading="lazy"><span class="num">0${i + 1}</span></div>
<div class="body"><h3>${D[id].titre}</h3><p>${D[id].accroche}</p><a class="btn" href="${url(id)}">Découvrir <i>→</i></a></div></article>`;

const home = () => `
<section class="hero">
  <div class="hero-txt">
    <p class="eyebrow rv">Portfolio — Événementiel · Marketing · Communication</p>
    <h1><span class="ln"><span>${first}</span></span><span class="ln"><span><em>${last}</em></span></span></h1>
    <p class="lead rv">${SITE.accroche}</p>
    <div class="cta rv"><a class="btn" href="#domaines">Découvrir mon travail</a><a class="link" href="mailto:${SITE.email}">Me contacter</a></div>
  </div>
  <div class="hero-img">
    <div class="arch a1" data-speed="-.07"><img src="${D.evenementiel.img}" alt=""></div>
    <div class="arch a2" data-speed=".06"><img src="${D.marketing.img}" alt=""></div>
    <svg class="seal" viewBox="0 0 120 120"><defs><path id="c" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs><text><textPath href="#c">ÉVÉNEMENTIEL • MARKETING • COMMUNICATION • </textPath></text></svg>
  </div>
</section>
<div class="marquee"><div>${'<span>Événementiel</span><span>✦</span><span>Marketing</span><span>✦</span><span>Communication</span><span>✦</span>'.repeat(8)}</div></div>
<section class="sec" id="domaines"><p class="eyebrow rv">Mes univers</p><h2 class="rv">Trois façons de<br><em>raconter une histoire</em></h2>
<div class="cards">${ids.map(card).join('')}</div></section>
<section class="sec about"><div class="portrait rv tilt"><img src="${SITE.portrait}" alt="${SITE.nom}"></div>
<div><p class="eyebrow rv">À propos</p><h2 class="rv">${SITE.apropos.titre}</h2><p class="rv txt">${SITE.apropos.texte}</p>
<div class="stats rv">${SITE.apropos.stats.map(s => `<div><b><span data-count="${s[0]}">0</span>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div></div></section>`;

const detail = id => {
  const d = D[id], next = ids[(ids.indexOf(id) + 1) % ids.length];
  return `
<section class="dhero"><a class="back rv" href="index.html">← Accueil</a><p class="eyebrow rv">0${ids.indexOf(id) + 1} — Portfolio</p>
<h1><span class="ln"><span>${d.titre}<em>.</em></span></span></h1><p class="lead rv">${d.accroche}</p></section>
<div class="cover rv"><img data-speed=".05" src="${d.img}" alt="${d.titre}"></div>
<section class="sec narrow"><p class="big rv">${d.intro}</p></section>
<section class="sec"><p class="eyebrow rv">Ce que je fais</p>
<div class="list">${d.services.map((s, i) => `<div class="row rv"><span>0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></section>
<section class="sec"><p class="eyebrow rv">Réalisations</p><h2 class="rv">Projets <em>choisis</em></h2>
<div class="gallery">${d.projets.map((p, i) => `<figure class="proj tilt rv" style="--d:${i * .12}s"><div><img src="${p[2]}" alt="${p[0]}" loading="lazy"></div><figcaption><h4>${p[0]}</h4><p>${p[1]}</p></figcaption></figure>`).join('')}</div></section>
<a class="next" href="${url(next)}"><small>Domaine suivant</small><span>${D[next].titre} →</span></a>`;
};

$('#app').innerHTML = header + `<main>${page === 'home' ? home() : detail(page)}</main>` + footer;

/* ---------- Rideau de transition entre pages ---------- */
const cur = document.createElement('div'); cur.className = 'curtain'; cur.innerHTML = `<span>${first[0]}.${last[0]}</span>`;
document.body.prepend(cur);
const reveal = () => { cur.classList.add('out'); setTimeout(() => document.body.classList.add('ready'), 250); };
window.addEventListener('load', () => setTimeout(reveal, 350));
window.addEventListener('pageshow', e => e.persisted && reveal());
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const h = a.getAttribute('href') || '';
  if (!h.endsWith('.html') || a.target) return;
  e.preventDefault();
  cur.classList.add('pre'); cur.classList.remove('out'); cur.offsetWidth; cur.classList.remove('pre');
  setTimeout(() => location.href = h, 800);
});

/* ---------- Apparition au scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; e.target.classList.add('on');
  const c = $('[data-count]', e.target); if (c) countUp(c); io.unobserve(e.target);
}), { threshold: .15 });
$$('.rv').forEach(el => io.observe(el));
function countUp(el) { const n = +el.dataset.count; let t0; const f = t => { t0 ??= t; const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); p < 1 && requestAnimationFrame(f); }; requestAnimationFrame(f); }

/* ---------- Effets 3D (inclinaison) + parallaxe + curseur ---------- */
const fine = matchMedia('(hover:hover)').matches;
$$('.tilt').forEach(el => {
  el.addEventListener('pointermove', e => { if (!fine) return; const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`; });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});
const par = () => $$('[data-speed]').forEach(el => el.style.transform = `translateY(${scrollY * el.dataset.speed}px)`);
addEventListener('scroll', par, { passive: true }); par();
if (fine) {
  const dot = document.createElement('div'); dot.className = 'dot'; document.body.append(dot);
  let x = 0, y = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; dot.style.opacity = 1; });
  (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; dot.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => dot.classList.toggle('big', !!e.target.closest('a,button,.tilt')));
}
