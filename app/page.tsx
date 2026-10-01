"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    kicker: "THE POLITICIAN SCHOOL · PEMILU 2029",
    title: ["2029", "dimulai", "sekarang."],
    body: [
      "Bootcamp untuk kandidat yang ingin menyiapkan nama, memahami dapil, menyusun strategi, dan membangun tim sejak sekarang.",
      "Bukan enam bulan sebelum hari pencoblosan."
    ],
    meta: "CHAPTER 01 · START EARLY",
  },
  {
    kicker: "MEMBACA ARENA",
    title: ["Kenali", "dapilmu."],
    body: [
      "Pahami karakter pemilih, peta kompetisi, isu lokal, dan ruang yang masih bisa dimenangkan.",
      "Data bukan sekadar angka. Data membantu menentukan langkah yang perlu didahulukan."
    ],
    meta: "CHAPTER 02 · READ THE DISTRICT",
  },
  {
    kicker: "DARI DATA KE STRATEGI",
    title: ["Bangun", "rencana", "yang bekerja."],
    body: [
      "Susun prioritas, target, tahapan kampanye, positioning, komunikasi, dan cara kerja tim yang lebih terukur.",
      "Materi dirancang dari pengalaman riset dan konsultasi politik Politika Research & Consulting."
    ],
    meta: "CHAPTER 03 · BUILD THE PLAN",
  },
  {
    kicker: "PENGALAMAN YANG MENJADI MATERI",
    title: ["Riset.", "Strategi.", "Evaluasi."],
    body: [
      "Sejak 2014, Politika Research & Consulting bekerja di bidang survei, analisis elektoral, branding, quick count, exit poll, dan pendampingan kandidat.",
      "The Politician School membawa pengalaman itu ke ruang belajar yang lebih terstruktur."
    ],
    meta: "CHAPTER 04 · EXPERIENCE",
  },
  {
    kicker: "INVESTASI PROGRAM",
    title: ["Siapkan", "2029", "dengan serius."],
    body: [
      "Early Bird Rp6,5 juta untuk 10 pendaftar pertama. Harga normal Rp8,5 juta.",
      "Termasuk akomodasi satu malam, konsumsi, materi, sertifikat, Laporan Pemetaan Dapil, dan forum alumni."
    ],
    meta: "CHAPTER 05 · INVESTMENT",
  },
];

const navItems = ["Mulai", "Dapil", "Strategi", "Pengalaman", "Investasi"];

function AnimatedTitle({ lines, active }: { lines: string[]; active: boolean }) {
  let counter = 0;

  return (
    <h2 className="cinematic-title" aria-label={lines.join(" ")}>
      {lines.map((line, lineIndex) => (
        <span className="title-line" key={`${line}-${lineIndex}`}>
          {Array.from(line).map((char, charIndex) => {
            const delay = counter++ * 0.026;
            return (
              <span
                className={`title-char ${active ? "title-char-active" : ""}`}
                style={{ transitionDelay: `${delay}s` }}
                key={`${lineIndex}-${charIndex}`}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function CinematicCanvas({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let mouseX = 0;
    let mouseY = 0;

    const particles = Array.from({ length: 72 }, (_, i) => ({
      x: ((i * 47) % 1000) / 1000,
      y: ((i * 83) % 1000) / 1000,
      r: 0.45 + ((i * 29) % 100) / 100,
      speed: 0.000018 + ((i * 17) % 10) * 0.0000024,
      phase: i * 0.83,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouse = (event: MouseEvent) => {
      mouseX = event.clientX / Math.max(1, width) - 0.5;
      mouseY = event.clientY / Math.max(1, height) - 0.5;
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      const progress = progressRef.current;

      ctx.clearRect(0, 0, width, height);

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#07182f");
      base.addColorStop(0.42, "#0f2f63");
      base.addColorStop(1, "#071a38");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * (0.68 + mouseX * 0.03),
        height * (0.35 + mouseY * 0.025),
        0,
        width * 0.68,
        height * 0.35,
        Math.max(width, height) * 0.64
      );
      glow.addColorStop(0, `rgba(87, 144, 230, ${0.18 + progress * 0.08})`);
      glow.addColorStop(0.48, "rgba(37, 99, 201, 0.08)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const lineCount = 12;
      for (let j = 0; j < lineCount; j++) {
        ctx.beginPath();
        const alpha = 0.035 + (j % 4) * 0.009;
        ctx.strokeStyle = `rgba(180, 211, 255, ${alpha})`;
        ctx.lineWidth = 0.7 + (j % 3) * 0.25;

        for (let x = -80; x <= width + 80; x += 18) {
          const normalized = x / Math.max(width, 1);
          const yBase = height * (0.10 + j * 0.072);
          const wave1 =
            Math.sin(normalized * Math.PI * (2.2 + j * 0.04) + t * 0.12 + progress * 4.4 + j * 0.7) *
            (34 + j * 1.4);
          const wave2 =
            Math.cos(normalized * Math.PI * 3.0 - t * 0.08 - progress * 3.2 + j) * 17;
          const mouseShift = mouseY * 12 + mouseX * (normalized - 0.5) * 28;
          const y = yBase + wave1 + wave2 + mouseShift;
          if (x === -80) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (const particle of particles) {
        const py =
          (((particle.y - t * particle.speed * 1000 * (1 + progress * 0.8)) % 1) + 1) % 1;
        const px = particle.x + Math.sin(t * 0.18 + particle.phase) * 0.008;
        const x = px * width;
        const y = py * height;

        ctx.beginPath();
        ctx.fillStyle = `rgba(215, 230, 255, ${0.16 + particle.r * 0.13})`;
        ctx.arc(x, y, particle.r * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="cinematic-canvas" aria-hidden="true" />;
}

export default function Home() {
  const stageRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const innerCursor = useRef<HTMLDivElement | null>(null);
  const outerCursor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      const stage = stageRef.current;
      if (!stage) return;

      const max = Math.max(1, stage.offsetHeight - window.innerHeight);
      const local = Math.max(0, Math.min(1, (window.scrollY - stage.offsetTop) / max));
      progressRef.current = local;
      setProgress(local);

      const index = Math.min(slides.length - 1, Math.floor(local * slides.length));
      setActive(index);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    let outerX = window.innerWidth / 2;
    let outerY = window.innerHeight / 2;
    let targetX = outerX;
    let targetY = outerY;
    let raf = 0;

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (innerCursor.current) {
        innerCursor.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      outerX += (targetX - outerX) * 0.18;
      outerY += (targetY - outerY) * 0.18;
      if (outerCursor.current) {
        outerCursor.current.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goToSlide = (index: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const max = stage.offsetHeight - window.innerHeight;
    const target = stage.offsetTop + max * (index / slides.length + 0.015);
    window.scrollTo({ top: target, behavior: "smooth" });
    setMenuOpen(false);
  };

  const portraitX = -6 * progress;
  const portraitY = Math.sin(progress * Math.PI) * -2.6;
  const portraitScale = 1 + Math.sin(progress * Math.PI) * 0.055;
  const portraitRotate = 2.2 - progress * 3.2;
  const portraitOpacity = active === 4 ? 0.48 : 1;

  return (
    <>
      <div ref={innerCursor} className="cursor-inner" />
      <div ref={outerCursor} className="cursor-outer" />

      <main>
        <section ref={stageRef} className="cinematic-scroll" id="top">
          <div className="cinematic-sticky">
            <CinematicCanvas progressRef={progressRef} />

            <div className="cinematic-vignette" />
            <div className="cinematic-horizontal-line" />

            <div className="cinematic-grid" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="cinematic-grid-line" key={i}>
                  <span
                    className="grid-dot grid-dot-a"
                    style={{ top: `${12 + ((progress * (95 + i * 23) + i * 17) % 78)}%` }}
                  />
                  <span
                    className="grid-dot grid-dot-b"
                    style={{ top: `${18 + ((progress * (130 + i * 19) + i * 31) % 68)}%` }}
                  />
                </div>
              ))}
            </div>

            <header className="cinematic-header">
              <button className="cinematic-brand" onClick={() => goToSlide(0)}>
                THE POLITICIAN SCHOOL
              </button>

              <nav className="cinematic-nav">
                {navItems.map((item, i) => (
                  <span className="nav-item-wrap" key={item}>
                    <button className={active === i ? "active" : ""} onClick={() => goToSlide(i)}>
                      {item}
                    </button>
                    {i < navItems.length - 1 && <i />}
                  </span>
                ))}
              </nav>

              <button className="cinematic-contact" onClick={() => goToSlide(4)}>
                Coming Soon <span />
              </button>
            </header>

            <div
              className="political-mark"
              style={{
                transform: `translate3d(${portraitX}vw, ${portraitY}vh, 0) scale(${portraitScale}) rotate(${portraitRotate}deg)`,
                opacity: portraitOpacity,
              }}
            >
              <div className="portrait-halo" />
              <div className="portrait-frame">
                <Image
                  src="/septa-rio-salmanan.png"
                  alt="Septa Rio Salmanan, Trainer Utama The Politician School"
                  fill
                  priority
                  sizes="(max-width: 800px) 78vw, 42vw"
                  className="portrait-image"
                />
                <div className="portrait-gradient" />
              </div>
              <div className="portrait-caption">
                <span>TRAINER UTAMA</span>
                <strong>Septa Rio Salmanan</strong>
                <small>The Politician School</small>
              </div>
            </div>

            {slides.map((slide, i) => (
              <section
                className={`cinematic-slide cinematic-slide-${i + 1} ${active === i ? "active" : ""}`}
                key={slide.meta}
                aria-hidden={active !== i}
              >
                <span className="slide-meta">{slide.meta}</span>
                <span className="slide-kicker">{slide.kicker}</span>

                <AnimatedTitle lines={slide.title} active={active === i} />

                <div className="slide-copy">
                  {slide.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {i === 4 && (
                  <div className="investment-mini">
                    <div>
                      <span>EARLY BIRD · 10 PESERTA PERTAMA</span>
                      <strong>Rp6,5 juta</strong>
                    </div>
                    <div>
                      <span>HARGA NORMAL</span>
                      <strong>Rp8,5 juta</strong>
                    </div>
                  </div>
                )}
              </section>
            ))}

            <div className="story-progress" aria-hidden="true">
              {slides.map((_, i) => {
                const segmentStart = i / slides.length;
                const segmentEnd = (i + 1) / slides.length;
                const segmentProgress = Math.max(
                  0,
                  Math.min(1, (progress - segmentStart) / (segmentEnd - segmentStart))
                );
                return (
                  <div className="story-dash" key={i}>
                    <div className="story-dash-fill" style={{ height: `${segmentProgress * 100}%` }} />
                  </div>
                );
              })}
            </div>

            <div className="cinematic-bottomline">
              <span>Powered by Politika Research & Consulting</span>
              <span>{String(active + 1).padStart(2, "0")} / 05</span>
            </div>
          </div>
        </section>

        <section className="post-cinematic">
          <div>
            <span className="post-kicker">YANG ANDA BAWA PULANG</span>
            <h2>Bekal untuk melanjutkan persiapan setelah bootcamp selesai.</h2>
          </div>

          <div className="post-benefits">
            {[
              "Laporan Pemetaan Dapil",
              "Strategic Plan",
              "Materi Bootcamp Eksklusif",
              "Sertifikat",
              "Akomodasi 1 Malam",
              "Seluruh Konsumsi",
              "Networking",
              "Forum Alumni",
            ].map((item, index) => (
              <div className="post-benefit-row" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <footer className="cinematic-footer">
          <span>THE POLITICIAN SCHOOL</span>
          <h2>
            2029 masih jauh.
            <br />
            Justru itu keuntungannya.
          </h2>
          <button onClick={() => goToSlide(4)}>Lihat investasi program →</button>
          <div className="footer-line">
            <span>© 2026 The Politician School</span>
            <span>Politika Research & Consulting</span>
          </div>
        </footer>
      </main>

      <button className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
        Menu
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-head">
            <span>THE POLITICIAN SCHOOL</span>
            <button onClick={() => setMenuOpen(false)}>×</button>
          </div>
          <nav>
            {navItems.map((item, i) => (
              <button onClick={() => goToSlide(i)} key={item}>
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
