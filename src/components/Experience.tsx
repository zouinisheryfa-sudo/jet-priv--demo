"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import film from "@/film.json";
import filmP from "@/film-p.json";
import { FLEET, PROGRAMS } from "@/data";

type Cap = { a: number; b: number; key: string; eyebrow?: string; title?: string; sub?: string; end?: boolean; pos?: "c" | "l" };
const sh = (id: string) => film.shots.find((x) => x.id === id)!;
const st = (id: string) => sh(id).start;
const en = (id: string) => sh(id).start + sh(id).dur;
const span = (from: string, to: string, key: string, c: Omit<Cap, "a" | "b" | "key">, lead = 0.45, tail = 0.35): Cap => ({ a: st(from) + lead, b: en(to) - tail, key, pos: "l", ...c });

// Légendes calées sur l'instant du film (en secondes) — chaque phrase suit la scène qui la porte.
const CAPS: Cap[] = [
  span("aJH956Tt-04", "aJH956Tt-04", "open", { eyebrow: "A new measure of luxury", title: "Refine how you arrive.", sub: "You won’t just be flown, you’ll be moved." }, 0.7, 0.6),
  span("aVP1-HNY-01", "aVP1-HNY-01", "terminal", { eyebrow: "Private terminals", title: "Every journey begins on the ground." }, 0.5, 0.2),
  span("aVP1-HNY-10", "aUBYqnNY-01", "crew", { eyebrow: "Pilots & crews", title: "1,500+ pilots, trained to the highest standard.", sub: "Backed by 25+ consecutive FAA Diamond Awards." }, 0.2, 0.1),
  span("aUBWr3NY-03", "aUBYqnNY-05", "aircraft", { eyebrow: "Your aircraft", title: "Ready when you are.", sub: "Nine aircraft, from the Phenom 300 to the Gulfstream G700." }, 0.2, 0.1),
  span("aJIgmaTt-01", "aVP1-HNY-08", "cabin", { eyebrow: "On board", title: "New dimensions of delight.", sub: "Fully reclining seats, a wet galley akin to a class up, and a quiet, spacious cabin." }, 0.3, 0.2),
  span("vsmISnru-01", "aJH956Tt-03", "window", { eyebrow: "Praetor 600E", title: "A window onto everything.", sub: "A 42-inch 4K OLED Smart Window™ with real-time exterior views, powered by Starlink." }, 0.3, 0.3),
  span("aUBWr3NY-07", "ajQFnY1P-06", "sky", { eyebrow: "In flight", title: "At Flexjet, we abide by only the extra mile." }, 0.9, 0.3),
  span("aJIjlaTt-05", "ajQFnY1P-08", "heli", { eyebrow: "Helicopter access", title: "Premium rotary-wing travel." }, 0.4, 0.3),
  span("aUBaAnNY-15", "aUBaAnNY-05", "beyond", { eyebrow: "Beyond aviation", title: "Formula 1® Official Private Aviation Supplier.", sub: "See you in Austin, October 2026." }, 0.2, 0.2),
  { a: st("aj1ggVbR-10") + 0.4, b: 9999, key: "end", eyebrow: "A new measure of luxury", title: "Your next arrival starts here.", end: true, pos: "c" },
];
const CHAPTERS = [
  { name: "Terminal", t: st("aVP1-HNY-01") }, { name: "Crew", t: st("aVP1-HNY-10") }, { name: "Aircraft", t: st("aUBWr3NY-03") },
  { name: "On board", t: st("aJIgmaTt-01") }, { name: "In flight", t: st("aUBWr3NY-07") }, { name: "Beyond", t: st("aUBaAnNY-15") }, { name: "Arrival", t: st("aj1ggVbR-13") },
];

// ---- Jeu de données MOBILE (film vertical) : légendes courtes calées sur ses propres plans
const shP = (id: string) => filmP.shots.find((x) => x.id === id)!;
const stP = (id: string) => shP(id).start;
const enP = (id: string) => shP(id).start + shP(id).dur;
const spanP = (from: string, to: string, key: string, c: Omit<Cap, "a" | "b" | "key">, lead = 0.4, tail = 0.3): Cap => ({ a: stP(from) + lead, b: enP(to) - tail, key, pos: "l", ...c });
const CAPS_P: Cap[] = [
  spanP("m-G650p24-04", "m-G650p24-04", "open", { eyebrow: "A new measure of luxury", title: "Refine how you arrive.", sub: "You won’t just be flown, you’ll be moved." }, 0.7, 0.4),
  spanP("m-WHY24-02", "m-PROG24-03", "terminal", { eyebrow: "Private terminals", title: "Every journey begins on the ground." }, 0.5, 0.2),
  spanP("r-hostess", "m-PROG24-04", "crew", { eyebrow: "Pilots & crews", title: "1,500+ pilots, trained to the highest standard.", sub: "Backed by 25+ consecutive FAA Diamond Awards." }, 0.3, 0.1),
  spanP("m-HERO26-06", "r-door", "aircraft", { eyebrow: "Your aircraft", title: "Ready when you are.", sub: "Nine aircraft, from the Phenom 300 to the Gulfstream G700." }, 0.3, 0.1),
  spanP("m-P600p24-01", "m-P600E26-05", "cabin", { eyebrow: "On board", title: "New dimensions of delight.", sub: "A 42-inch 4K OLED Smart Window™ with real-time exterior views, powered by Starlink." }, 0.2, 0.05),
  spanP("m-P600E26-01", "m-G650p24-03", "window", { eyebrow: "On board", title: "Room to settle in.", sub: "Fully reclining seats, a wet galley akin to a class up, and a quiet, spacious cabin." }, 0.2, 0.2),
  spanP("m-HERO26-04", "m-HERO26-04", "sky", { eyebrow: "In flight", title: "At Flexjet, we abide by only the extra mile." }, 0.5, 0.15),
  spanP("m-S76p24-05", "m-LIFE26-04", "heli", { eyebrow: "Helicopter access", title: "Premium rotary-wing travel." }, 0.2, 0.1),
  { a: stP("r-heli") + 0.3, b: 9999, key: "end", eyebrow: "A new measure of luxury", title: "Your next arrival starts here.", end: true, pos: "c" },
];
const CHAPTERS_P = [
  { name: "Terminal", t: stP("m-WHY24-02") }, { name: "Crew", t: stP("r-hostess") }, { name: "Aircraft", t: stP("m-HERO26-06") },
  { name: "On board", t: stP("m-P600p24-01") }, { name: "In flight", t: stP("m-HERO26-04") }, { name: "Arrival", t: stP("m-HERO26-11") },
];
type DataSet = { D: number; caps: Cap[]; chapters: { name: string; t: number }[] };
const SET_D: DataSet = { D: film.duration, caps: CAPS, chapters: CHAPTERS };
const SET_P: DataSet = { D: filmP.duration, caps: CAPS_P, chapters: CHAPTERS_P };
const D = film.duration;
gsap.registerPlugin(ScrollToPlugin);

export default function Experience() {
  const vref = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [cap, setCap] = useState(-1);
  const [set, setSet] = useState<DataSet>(SET_D);
  const setRef = useRef<DataSet>(SET_D);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState<"fleet" | "prog">("fleet");
  const [sel, setSel] = useState(0);
  const state = useRef({ cur: 0, target: 0, v: 0, last: 0, y: 0 });

  const jump = (t: number) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    gsap.to(window, { scrollTo: { y: (t / setRef.current.D) * max, autoKill: true }, duration: 1.8, ease: "power2.inOut" });
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    const v = vref.current!, S = state.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // Portrait : film vertical recadré plan par plan. Paysage : film 1080p (ordinateur) ou 720p (petits écrans).
    const pick = () => (innerHeight > innerWidth ? "p" : innerWidth <= 1100 || saveData ? "l" : "d");
    let variant = pick();
    const apply = () => { v.poster = variant === "p" ? "/film/poster-p.webp" : "/film/poster.webp"; v.src = `/film/film-${variant}.mp4`; };
    const useSet = () => { const ds = variant === "p" ? SET_P : SET_D; setRef.current = ds; setSet(ds); setCap(-1); };
    apply(); useSet();
    v.muted = true; v.load();
    let seeking = false, raf = 0, user = false;
    v.addEventListener("seeked", () => (seeking = false));
    const onReady = () => { setReady(true); v.play().then(() => v.pause()).catch(() => {}); };
    v.addEventListener("loadeddata", onReady, { once: true });
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const read = () => { const DD = setRef.current.D; S.target = Math.min(DD - 0.04, Math.max(0, (scrollY / Math.max(1, max())) * DD)); };
    addEventListener("scroll", read, { passive: true }); read();

    // Introduction : le film démarre seul (défilement automatique) jusqu'à ce que le visiteur reprenne la main.
    const stop = () => { document.documentElement.classList.add("touched"); if (!user) { user = true; gsap.killTweensOf(window); } };
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => addEventListener(e, stop, { passive: true, once: true }));
    let intro: gsap.core.Tween | undefined;
    if (!reduce) {
      const start = () => { if (!user) intro = gsap.to(window, { scrollTo: { y: (6.4 / setRef.current.D) * max() }, duration: 6.4, ease: "none", delay: 0.9 }); };
      v.addEventListener("loadeddata", start, { once: true });
    }

    let lastCap = -2, lastCh = -1;
    const tick = () => {
      const k = reduce ? 1 : 0.1;
      S.cur += (S.target - S.cur) * k;
      if (Math.abs(S.target - S.cur) < 0.004) S.cur = S.target;
      if (!seeking && v.readyState >= 2 && Math.abs(v.currentTime - S.cur) > 1 / 60) { seeking = true; v.currentTime = S.cur; }
      // sensation de vitesse : léger zoom et vignette selon la vitesse de défilement
      const y = scrollY, vel = Math.min(1, Math.abs(y - S.y) / 60); S.y = y;
      S.v += (vel - S.v) * 0.12;
      if (stage.current && !reduce) stage.current.style.setProperty("--speed", S.v.toFixed(3));
      const DD = setRef.current.D;
      if (bar.current) bar.current.style.transform = `scaleX(${(S.cur / DD).toFixed(4)})`;
      if (clock.current) clock.current.textContent = `${String(Math.floor(S.cur / 60)).padStart(2, "0")}:${String(Math.floor(S.cur % 60)).padStart(2, "0")}`;
      const ci = setRef.current.caps.findIndex((c) => S.cur >= c.a && S.cur < c.b);
      if (ci !== lastCap) { lastCap = ci; setCap(ci); }
      let ch = 0; setRef.current.chapters.forEach((c, i) => { if (S.cur >= c.t - 0.1) ch = i; });
      if (ch !== lastCh) { lastCh = ch; setChapter(ch); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const mm = (e: PointerEvent) => { if (!reduce && stage.current) { stage.current.style.setProperty("--mx", String((e.clientX / innerWidth - 0.5).toFixed(3))); stage.current.style.setProperty("--my", String((e.clientY / innerHeight - 0.5).toFixed(3))); } };
    addEventListener("pointermove", mm);
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { const nv = pick(); if (nv !== variant) { variant = nv; apply(); useSet(); v.load(); v.addEventListener("loadeddata", () => { v.currentTime = S.cur; }, { once: true }); } }, 250); };
    addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", read); removeEventListener("pointermove", mm); removeEventListener("resize", onResize); intro?.kill(); };
  }, []);

  const c = cap >= 0 ? set.caps[cap] : null;
  const keyed = useMemo(() => c?.key ?? "none", [c]);

  return (
    <div className="exp">
      <div ref={stage} className={`stage ${ready ? "on" : ""}`}>
        <div className="cam">
          <video ref={vref} className="film" muted playsInline preload="auto" poster="/film/poster.webp" aria-hidden="true" tabIndex={-1} />
        </div>
        <div className="vig" /><div className="grain" aria-hidden="true" />
        <i className="lb t" /><i className="lb b" />
      </div>

      <header className="top">
        <span className="mark">FLEXJET<small>Concept ARMA</small></span>
        <a className="topcta" href="https://www.flexjet.com/en-us/inquire" target="_blank" rel="noopener noreferrer">Inquire ↗</a>
      </header>

      {c && (
        <div key={keyed} className={`cap ${c.pos === "c" ? "mid" : ""} ${c.end ? "end" : ""}`}>
          {c.eyebrow && <p className="eyebrow">{c.eyebrow}</p>}
          {c.title && <h2>{c.title}</h2>}
          {c.sub && <p className="sub">{c.sub}</p>}
                    {c.end && (
            <>
              <a className="btn" href="https://www.flexjet.com/en-us/inquire" target="_blank" rel="noopener noreferrer">Inquire now ↗</a>
              <button className="explore" onClick={() => setDrawer(true)}>Explore the fleet &amp; programs</button>
            </>
          )}
        </div>
      )}

      <nav className="dock" aria-label="Film chapters">
        <ol>{set.chapters.map((ch, i) => (
          <li key={ch.name}><button className={i === chapter ? "on" : ""} onClick={() => jump(Math.min(set.D - 0.1, ch.t + 0.6))}><b>{String(i + 1).padStart(2, "0")}</b><span>{ch.name}</span></button></li>
        ))}</ol>
        <div className="track" aria-hidden="true"><div ref={bar} className="fill" /></div>
        <span ref={clock} className="clock" aria-hidden="true">00:00</span>
      </nav>

      {drawer && (
        <aside className="drawer" role="dialog" aria-modal="true" aria-label="Fleet and programs">
          <button className="dx" onClick={() => setDrawer(false)} aria-label="Close">✕</button>
          <div className="dtabs" role="tablist"><button role="tab" aria-selected={tab === "fleet"} className={tab === "fleet" ? "on" : ""} onClick={() => { setTab("fleet"); setSel(0); }}>The fleet</button><button role="tab" aria-selected={tab === "prog"} className={tab === "prog" ? "on" : ""} onClick={() => { setTab("prog"); setSel(0); }}>Programs</button></div>
          {tab === "fleet" ? (
            <div className="dbody">
              <ul className="dlist">{FLEET.map((a, i) => <li key={a.id}><button className={sel === i ? "on" : ""} onClick={() => setSel(i)}><b>{String(i + 1).padStart(2, "0")}</b>{a.name}</button></li>)}</ul>
              <div className="ddet" key={FLEET[sel].id}><p className="eyebrow">{FLEET[sel].cls}</p><h3>{FLEET[sel].name}</h3><p className="sub">{FLEET[sel].line}</p>
                <dl className="stats grid">{FLEET[sel].specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                <a className="link" href={FLEET[sel].href} target="_blank" rel="noopener noreferrer">See the aircraft ↗</a></div>
            </div>
          ) : (
            <div className="dbody">
              <ul className="dlist">{PROGRAMS.map((p, i) => <li key={p.id}><button className={sel === i ? "on" : ""} onClick={() => setSel(i)}><b>{String(i + 1).padStart(2, "0")}</b>{p.name}</button></li>)}</ul>
              <div className="ddet" key={PROGRAMS[sel].id}><p className="eyebrow">{PROGRAMS[sel].tag}</p><h3>{PROGRAMS[sel].name}</h3><p className="sub">{PROGRAMS[sel].text}</p>
                <p className="ideal"><span>Ideal for those who fly</span>{PROGRAMS[sel].ideal}</p>
                <ul className="pts">{PROGRAMS[sel].points.map((x) => <li key={x}>{x}</li>)}</ul>
                <a className="link" href={PROGRAMS[sel].href} target="_blank" rel="noopener noreferrer">See the programs ↗</a></div>
            </div>
          )}
        </aside>
      )}
      <div className="hint" aria-hidden="true"><span className="h-d">Scroll to move through the film</span><span className="h-t">Swipe up to move through the film</span></div>
      <div className="ribbon" role="note">Independent redesign concept proposed by ARMA Agency — not affiliated with Flexjet<span className="rb-x"> · Videos, brand and information © Flexjet, LLC · private demonstration</span></div>
      <div className="runway" aria-hidden="true" />
    </div>
  );
}
