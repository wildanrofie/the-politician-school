"use client";

import { useEffect } from "react";
import { initLanding } from "./landing";

// The page markup. Edit the copy here; styles live in globals.css,
// motion and canvases in landing.js.
const MARKUP = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <clipPath id="plateClip" clipPathUnits="objectBoundingBox"><path d="M 0.01915,0.00107H 0.98085C 0.98574,0.00107 0.99044,0.00300 0.99390,0.00642C 0.99736,0.00984 0.99930,0.01449 0.99930,0.01933V 0.88815C 0.99930,0.89299 0.99736,0.89763 0.99390,0.90105C 0.99044,0.90448 0.98574,0.90640 0.98085,0.90640H 0.64733C 0.63864,0.90640 0.63007,0.90834 0.62224,0.91206C 0.61442,0.91579 0.60754,0.92122 0.60212,0.92794L 0.56153,0.97830C 0.55635,0.98474 0.54976,0.98993 0.54227,0.99350C 0.53478,0.99707 0.52656,0.99892 0.51825,0.99892H 0.01915C 0.01426,0.99892 0.00956,0.99700 0.00610,0.99358C 0.00264,0.99016 0.00070,0.98551 0.00070,0.98067V 0.01933C 0.00070,0.01449 0.00264,0.00984 0.00610,0.00642C 0.00956,0.00300 0.01426,0.00107 0.01915,0.00107Z"/></clipPath>
    <symbol id="br" viewBox="0 0 10.5 10.5"><path d="M0 0.5H10V10.5"/></symbol>
    <symbol id="arr" viewBox="0 0 13.7071 10.7071"><path d="M0 5.35355H13M8 10.3536L13 5.35355L8 0.353553"/></symbol>
  </defs>
</svg>

<div class="veil" id="veil" role="status" aria-label="Memuat Menang Politik">
  <div class="veil-inner">
    <div class="sil" id="sil"><i></i><i></i></div>
    <div class="veil-name">Menang Politik</div>
  </div>
  <div class="meter" id="meter"><i></i></div>
</div>

<main>
<div class="stack" id="stack">

  <!-- 1 · HERO -->
  <div class="layer"><div class="layer-inner">
  <section class="hero" data-hero aria-labelledby="hero-name">
    <canvas class="contours" id="heroField" aria-hidden="true"></canvas>
    <div class="hero-col">
      <header class="mast" data-rise data-hero-in="0">
        <a href="#" class="wordmark" aria-label="Menang Politik"><span class="mk" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Menang<br>Politik</span></a>
        <p class="mast-tag">Jadi Caleg, atau Caleg Jadi?</p>
        <a class="navlink garage" href="#alur"><span aria-hidden="true">[ </span>Daftar<span aria-hidden="true"> → ]</span></a>
      </header>

      <div class="hero-mid">
        <div class="ident">
          <div class="id" data-rise data-hero-in="180">mentor_utama</div>
          <h1 id="hero-name" class="disp" data-split="words" data-hero-in="180" data-stagger="110">Rio Prayogo</h1>
          <ul class="meta">
            <li data-rise data-hero-in="440"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="0.5" y="0.5" width="7" height="7" fill="#090a0b"/><rect x="8.5" y="8.5" width="7" height="7" fill="#090a0b"/><rect x="8.5" y="0.5" width="7" height="7" fill="#12245a"/></svg>Konsultan Politik Nasional</li>
            <li data-rise data-hero-in="570"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.8 5.2H15l-4.2 3.1 1.6 5.2L8 11.3l-4.4 3.2 1.6-5.2L1 6.2h5.2z" fill="#090a0b"/></svg>Founder, Politika Research &amp; Consulting</li>
            <li data-rise data-hero-in="700"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="#090a0b"/><circle cx="8" cy="8" r="2.5" fill="#090a0b"/></svg>Bupati Situbondo</li>
          </ul>
        </div>

        <div class="panels" data-rise data-hero-in="900">
          <div class="bpanel">
            <div class="brackets" aria-hidden="true"><svg class="tl"><use href="#br"/></svg><svg class="tr"><use href="#br"/></svg><svg class="bl"><use href="#br"/></svg><svg class="br"><use href="#br"/></svg></div>
            <div class="eyebrow">bootcamp berikutnya</div>
            <dl><dt>Batch 01</dt><dd>Kelas tatap muka</dd><dd>Jadwal &amp; lokasi diumumkan</dd></dl>
          </div>
          <div class="bpanel">
            <div class="brackets" aria-hidden="true"><svg class="tl"><use href="#br"/></svg><svg class="tr"><use href="#br"/></svg><svg class="bl"><use href="#br"/></svg><svg class="br"><use href="#br"/></svg></div>
            <div class="eyebrow">format program</div>
            <dl class="stats3">
              <div><dt>Hari</dt><dd>2</dd></div>
              <div><dt>Malam</dt><dd>1</dd></div>
              <div><dt>Modul</dt><dd>5</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div class="hero-photo photo" id="heroPhoto" role="img" aria-label="Rio Prayogo, Konsultan Politik Nasional"></div>

      <div class="actions" data-rise data-hero-in="1300">
        <div class="tag"><b class="tag-full">Bootcamp caleg</b><b class="tag-short">Jadi Caleg, atau Caleg Jadi?</b><span>by Politika Research &amp; Consulting</span></div>
        <a class="cta" href="#alur">
          <svg class="frame" viewBox="0 0 220 50" preserveAspectRatio="none" aria-hidden="true"><path class="body" d="M220 42L212.932 50H0V0H220V42Z"/><path class="flood" d="M220 42L212.932 50H0V0H220V42Z"/><path class="ring" d="M220 42L212.932 50H0V0H220V42Z"/><path class="hook" d="M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5"/></svg>
          <span>Daftar batch 01</span><svg class="arrow" aria-hidden="true"><use href="#arr"/></svg>
        </a>
        <div class="socials"><a href="https://instagram.com">inst</a><a href="https://x.com">x</a><a href="https://youtube.com">youtube</a></div>
      </div>
    </div>
  </section>
  </div><div class="shade"></div></div>

  <!-- 2 · KURIKULUM -->
  <div class="layer"><div class="layer-inner">
  <section class="kur" id="kurikulum" aria-labelledby="kur-h">
    <canvas class="field" id="kurField" aria-hidden="true"></canvas>
    <canvas class="dissolve" data-carry="light" aria-hidden="true"></canvas>
    <div class="kur-col">
      <div data-group>
        <h2 id="kur-h" class="disp"><span class="split" data-split="words" data-stagger="110">Kurikulum</span><span class="split" data-split="words" data-stagger="110" data-delay="130">menang<span class="dot">.</span></span></h2>
        <div class="rule"></div>
        <p class="lede split" data-split="words" data-stagger="34" data-delay="350">Lima modul, satu rute. Dari membaca dapil sampai mengawal suara di hari pemungutan.</p>
      </div>
      <div class="kur-foot">
        <ol class="mods" id="mods">
          <li data-rise style="--d:0ms"><span class="n">Modul 01</span><b>Baca dapil</b><span>Peta suara, basis, dan lawan yang sebenarnya.</span></li>
          <li data-rise style="--d:90ms"><span class="n">Modul 02</span><b>Data &amp; survei</b><span>Ukur elektabilitas sebelum bergerak.</span></li>
          <li data-rise style="--d:180ms"><span class="n">Modul 03</span><b>Citra kandidat</b><span>Pesan, wajah, dan cerita yang dipercaya pemilih.</span></li>
          <li data-rise style="--d:270ms"><span class="n">Modul 04</span><b>Mesin lapangan</b><span>Relawan, tim, dan ritme kampanye.</span></li>
          <li data-rise style="--d:360ms"><span class="n">Modul 05</span><b>Kawal suara</b><span>Saksi, rekap, dan hari pemungutan.</span></li>
        </ol>
        <div class="plate" data-rise style="--d:260ms">
          <svg class="pf" viewBox="0 0 277 78" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 0.5H276.5V69L268 77.5H0.5Z"/><line x1="83" y1="0.5" x2="83" y2="77.5"/></svg>
          <div class="badge"><svg viewBox="0 0 37 23" aria-hidden="true"><ellipse cx="18.5" cy="11.5" rx="18" ry="11"/><line x1="0.5" y1="11.5" x2="36.5" y2="11.5"/><ellipse id="meridian" cx="18.5" cy="11.5" rx="18" ry="11"/></svg><span>MP <span style="color:var(--accent)">/ 01</span></span></div>
          <dl class="rows"><div><dt>2</dt><dd>hari tatap muka</dd></div><div><dt>1</dt><dd>malam simulasi</dd></div><div><dt>5</dt><dd>modul inti.</dd></div></dl>
        </div>
      </div>
    </div>
  </section>
  </div><div class="shade"></div></div>

  <!-- 3 · AGENDA -->
  <div class="layer last">
  <section class="agenda" id="agenda" aria-labelledby="ag-h">
    <canvas class="dissolve" data-carry="light" aria-hidden="true"></canvas>
    <div class="ag-wrap">
      <h2 id="ag-h" class="disp"><span class="split" data-split="words" data-stagger="110">Dua hari,</span><span class="split" data-split="words" data-stagger="110" data-delay="130">satu malam<span class="dot">.</span></span></h2>
      <div class="rail" id="rail" aria-hidden="true"><svg id="railSvg"><line class="track" x1="8" x2="8" y1="0" y2="98"/><line class="track" id="railDash" x1="8" x2="8" y1="102" y2="200" stroke-dasharray="6 6"/><rect id="railRun" x="7.5" y="0" width="1" height="0" fill="#fff"/><rect id="railMark" x="-4.5" y="-4.5" width="9" height="9" fill="#fff"/></svg></div>
      <div id="rows"></div>
    </div>
  </section>
  </div>
</div>

<!-- 4 · MENTOR -->
<section class="mentor" id="mentor" aria-labelledby="m-h">
  <canvas class="contours" id="mentorField" aria-hidden="true"></canvas>
  <div class="band" aria-hidden="true"></div>
  <div class="m-photo photo" id="mPhoto" role="img" aria-label="Rio Prayogo"></div>
  <div class="m-melt" aria-hidden="true"></div>
  <canvas class="dissolve" data-carry="dark" aria-hidden="true"></canvas>
  <h2 id="m-h" class="disp"><span class="split" data-split="words" data-stagger="110">Dari lapangan</span><span class="split" data-split="words" data-stagger="110" data-delay="130">ke kursi<span class="dot">.</span></span></h2>
  <div class="m-intro" data-group>
    <p class="split" data-split="words" data-stagger="30" data-delay="350">Rio Prayogo membangun Politika Research &amp; Consulting sebagai konsultan, lalu memenangkan kursi Bupati Situbondo. Bootcamp ini berisi cara kerja yang ia pakai di lapangan.</p>
    <a class="cta" href="#alur" data-rise style="--d:520ms">
      <svg class="frame" viewBox="0 0 217 50" preserveAspectRatio="none" aria-hidden="true"><path class="body" d="M0.5 0.5H216.5V42L209 49.5H0.5Z"/><path class="flood" d="M0.5 0.5H216.5V42L209 49.5H0.5Z"/></svg>
      <span>Lihat alur</span><svg class="arrow" aria-hidden="true"><use href="#arr"/></svg>
    </a>
  </div>
  <div class="m-panels">
    <div class="bpanel" data-rise style="--d:320ms">
      <div class="brackets" aria-hidden="true"><svg class="tl"><use href="#br"/></svg><svg class="tr"><use href="#br"/></svg><svg class="bl"><use href="#br"/></svg><svg class="br"><use href="#br"/></svg></div>
      <div class="who"><b>Rio Prayogo</b><span>Konsultan Politik Nasional</span><span>Mentor utama</span></div>
    </div>
    <div class="bpanel" data-rise style="--d:460ms">
      <div class="brackets" aria-hidden="true"><svg class="tl"><use href="#br"/></svg><svg class="tr"><use href="#br"/></svg><svg class="bl"><use href="#br"/></svg><svg class="br"><use href="#br"/></svg></div>
      <div class="mstats">
        <div class="mstat"><span>Jabatan</span><b>Bupati Situbondo</b></div>
        <div class="mstat"><span>Lembaga</span><b>PRC</b></div>
        <div class="mstat"><span>Format kelas</span><b>Tatap muka</b></div>
        <div class="mstat"><span>Program</span><b>2 hari 1 malam</b></div>
      </div>
    </div>
  </div>
  <div class="strip" id="alur" aria-label="Alur pendaftaran">
    <ol class="steps">
      <li class="step live" data-rise style="--d:0ms"><div class="brackets livebox" aria-hidden="true"><svg class="tl"><use href="#br"/></svg><svg class="tr"><use href="#br"/></svg><svg class="bl"><use href="#br"/></svg><svg class="br"><use href="#br"/></svg></div><span class="r">Langkah 1</span><b>Daftar minat</b><span class="s">Dibuka</span><span class="mark"><svg viewBox="0 0 11 11" aria-hidden="true"><circle id="pulse" cx="5.5" cy="5.5" r="5.5" fill="none" stroke="#8aa3e8" vector-effect="non-scaling-stroke"/><circle cx="5.5" cy="5.5" r="5.5" fill="#8aa3e8"/></svg></span></li>
      <li class="step" data-rise style="--d:90ms"><span class="r">Langkah 2</span><b>Wawancara</b><span class="s">Singkat</span><span class="mark"><svg viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5" fill="none" stroke="#fff"/></svg></span></li>
      <li class="step" data-rise style="--d:180ms"><span class="r">Langkah 3</span><b>Kunci kursi</b><span class="s">Kelas terbatas</span><span class="mark"><svg viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5" fill="none" stroke="#fff"/></svg></span></li>
      <li class="step" data-rise style="--d:270ms"><span class="r">Langkah 4</span><b>Bootcamp</b><span class="s">2 hari 1 malam</span><span class="mark"><svg viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5" fill="none" stroke="#fff"/></svg></span></li>
      <li class="step" data-rise style="--d:360ms"><span class="r">Langkah 5</span><b>Rencana menang</b><span class="s">Dibawa pulang</span><span class="mark"><svg viewBox="0 0 11 11" aria-hidden="true"><circle cx="5.5" cy="5.5" r="5" fill="none" stroke="#fff"/></svg></span></li>
    </ol>
  </div>
</section>

<!-- 5 · SIGN-OFF -->
<section class="foot" aria-labelledby="f-h">
  <div class="foot-panel"><canvas class="contours" id="footField" aria-hidden="true"></canvas></div>
  <div class="f-photo photo" id="fPhoto" aria-hidden="true"></div>
  <a href="#" class="wordmark f-logo" data-rise aria-label="Menang Politik"><span class="mk" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Menang<br>Politik</span></a>
  <h2 id="f-h" class="disp"><span class="split" data-split="words" data-stagger="110">Jadi caleg,</span><span class="split" data-split="words" data-stagger="110" data-delay="130">atau caleg jadi<span class="dot">?</span></span></h2>
  <nav class="f-nav" aria-label="Bawah">
    <a href="#kurikulum" class="split letters" data-split="letters" data-stagger="22" data-delay="260">Kurikulum</a>
    <a href="#agenda" class="split letters" data-split="letters" data-stagger="22" data-delay="340">Agenda</a>
    <a href="#mentor" class="split letters" data-split="letters" data-stagger="22" data-delay="420">Mentor</a>
    <a href="#alur" class="split letters" data-split="letters" data-stagger="22" data-delay="500">Daftar</a>
  </nav>
  <div class="f-row">
    <small data-rise style="--d:640ms">© 2026 Menang Politik. Sebuah program Politika Research &amp; Consulting.</small>
    <a class="cta hollow" href="#alur" data-rise style="--d:720ms">
      <svg class="frame" viewBox="0 0 275 50" preserveAspectRatio="none" aria-hidden="true"><path class="flood" d="M0.5 0.5H274.5V41.165L266.165 49.5H0.5Z"/><path class="hook" d="M0.5 0.5H274.5V41.165L266.165 49.5H0.5Z"/></svg>
      <span>Daftar sekarang</span><svg class="arrow" aria-hidden="true"><use href="#arr"/></svg>
    </a>
    <div class="socials" data-rise style="--d:800ms"><a href="https://instagram.com">inst</a><a href="https://x.com">x</a><a href="https://youtube.com">youtube</a></div>
  </div>
</section>
</main>`;

export default function Home() {
  useEffect(() => {
    initLanding();
  }, []);

  return <div id="mp-root" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
