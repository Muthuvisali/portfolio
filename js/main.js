/* ═══════════════════════════════════════════════════
   MUTHUVISALI RAVICHANDRA BOSE — Portfolio JS
   Particles · Cursor · Tilt · Counter · Animations
   ═══════════════════════════════════════════════════ */

/* ── HELPERS ── */
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

/* ══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot = qs("#cursor");
  const ring = qs("#cursor-ring");
  const trail = qs("#cursor-trail");
  if (!dot) return;

  let mx = -100,
    my = -100;
  let rx = -100,
    ry = -100;
  let tx = -100,
    ty = -100;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
  });

  (function animLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 20}px,${ry - 20}px)`;

    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;
    trail.style.transform = `translate(${tx - 2.5}px,${ty - 2.5}px)`;

    requestAnimationFrame(animLoop);
  })();

  const hoverEls =
    "a,button,.pill,.cert,.proj-card,.exp-card,.sg,.metric-card,.clink,.btn-hire";
  document.querySelectorAll(hoverEls).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.style.width = "62px";
      ring.style.height = "62px";
      ring.style.borderColor = "rgba(107,61,90,.65)";
      dot.style.opacity = "0";
    });
    el.addEventListener("mouseleave", () => {
      ring.style.width = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "rgba(107,61,90,.45)";
      dot.style.opacity = "1";
    });
  });
})();

/* ══════════════════════════════════════
   2. SCROLL PROGRESS BAR
══════════════════════════════════════ */
(function initScrollBar() {
  const bar = qs("#scrollBar");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      bar.style.width = Math.min(pct, 100) + "%";
    },
    { passive: true },
  );
})();

/* ══════════════════════════════════════
   3. PARTICLE CANVAS (HERO)
══════════════════════════════════════ */
(function initParticles() {
  const canvas = qs("#particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const COLORS = [
    "rgba(196,149,106,",
    "rgba(107,61,90,",
    "rgba(232,196,212,",
    "rgba(61,38,69,",
    "rgba(212,160,190,",
  ];

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.4 + 0.6,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  const COUNT = Math.min(70, Math.floor(W / 14));
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Draw connecting lines between nearby particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(107,61,90,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* Draw particles */
    particles.forEach((p) => {
      p.pulse += p.pulseSpeed;
      const dynamicOpacity = p.opacity + Math.sin(p.pulse) * 0.1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.max(0.05, dynamicOpacity)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${p.color}.4)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      p.x += Math.cos(p.a) * p.speed;
      p.y += Math.sin(p.a) * p.speed;
      p.a += (Math.random() - 0.5) * 0.04;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════
   4. TYPEWRITER EFFECT
══════════════════════════════════════ */
(function initTypewriter() {
  const el = qs("#typewriter-text");
  if (!el) return;
  const phrases = [
    "Product × AI",
    "MBA + MS-MIS Graduate",
    "Zero-to-One Builder",
    "Data-Driven Strategist",
    "Agile Practitioner",
  ];
  let phraseIdx = 0,
    charIdx = 0,
    deleting = false,
    wait = 0;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        wait = 500;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        wait = 2200;
        deleting = true;
      }
    }
    const speed = deleting ? 50 : 80;
    setTimeout(tick, wait || speed);
    wait = 0;
  }
  setTimeout(tick, 800);
})();

/* ══════════════════════════════════════
   5. INTERSECTION OBSERVER — FADE UPS
══════════════════════════════════════ */
(function initFadeUps() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  qsa(".fu, .fu-left, .fu-right, .fu-scale").forEach((el) => obs.observe(el));

  /* Stagger pill groups */
  qsa(".pills").forEach((el) => {
    el.classList.add("stagger-pills");
    obs.observe(el);
  });
})();

/* ══════════════════════════════════════
   6. COUNTER ANIMATION
══════════════════════════════════════ */
(function initCounters() {
  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || "";
        const dur = 1800;
        let start;

        (function step(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.innerHTML =
            Math.round(ease(p) * target) + "<span>" + suffix + "</span>";
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());

        obs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  qsa(".metric-val[data-target]").forEach((el) => obs.observe(el));
})();

/* ══════════════════════════════════════
   7. KPI BAR ANIMATION
══════════════════════════════════════ */
(function initKpiBars() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        qsa(".kbar", e.target).forEach((b, i) => {
          setTimeout(() => {
            b.style.width = b.dataset.w + "%";
          }, i * 150);
        });
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.3 },
  );
  qsa(".proj-card").forEach((c) => obs.observe(c));
})();

/* ══════════════════════════════════════
   8. ACTIVE NAV HIGHLIGHT
══════════════════════════════════════ */
(function initActiveNav() {
  const navAs = qsa(".nav-links a");
  const mNavAs = qsa(".mobile-nav a");
  const sections = qsa("section[id]");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          [...navAs, ...mNavAs].forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.36 },
  );

  sections.forEach((s) => obs.observe(s));
})();

/* ══════════════════════════════════════
   9. MOBILE HAMBURGER
══════════════════════════════════════ */
(function initMobileNav() {
  const ham = qs("#hamburger");
  const mNav = qs("#mobileNav");
  if (!ham || !mNav) return;

  ham.addEventListener("click", () => {
    const open = ham.classList.toggle("open");
    mNav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  qsa(".mobile-nav a").forEach((a) => {
    a.addEventListener("click", () => {
      ham.classList.remove("open");
      mNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* ══════════════════════════════════════
   10. HIRE MODAL
══════════════════════════════════════ */
const modal = qs("#hireModal");

function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
  const btn = qs("#copyBtn");
  if (btn) {
    btn.textContent = "Copy";
    btn.classList.remove("copied");
  }
}
function handleOverlayClick(e) {
  if (e.target === modal) closeModal();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
function copyEmail(e) {
  e.stopPropagation();
  navigator.clipboard.writeText("visaliravi4@gmail.com").then(() => {
    const btn = qs("#copyBtn");
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2400);
  });
}
function openEmail(e) {
  if (e) e.stopPropagation();
  const subject = "Let's Talk — PM Opportunity for Muthuvisali";
  // const body = [
  //   "Hi Muthuvisali,",
  //   "",
  //   "I just went through your portfolio and I have to say — your work stands out.",
  //   "",
  //   "Your ability to blend AI product strategy with data-driven execution and genuine",
  //   "user empathy is exactly what we're looking for at [Company].",
  //   "",
  //   "A few things I'd love to explore with you:",
  //   "  → Your experience leading cross-functional AI initiatives",
  //   "  → How you've turned ambiguous problems into shipped solutions",
  //   "  → What motivates you to build products that truly matter",
  //   "",
  //   "I believe you'd be a phenomenal fit for [Role/Team] and I'd love to connect.",
  //   "",
  //   "Would you have 20–30 minutes this week for a quick intro call?",
  //   "",
  //   "Looking forward to it!",
  //   "",
  //   "Warm regards,",
  //   "[Your Name]",
  //   "[Title] | [Company]",
  //   "[Phone / LinkedIn]",
  // ].join("\n");
  window.location.href =
    "mailto:visaliravi4@gmail.com" + "?subject=" + encodeURIComponent(subject);
  // +
  // "&body=" + encodeURIComponent(body);
}

/* ══════════════════════════════════════
   11. 3D TILT ON CARDS (desktop only)
══════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  qsa(".proj-card, .edu-card, .metric-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ══════════════════════════════════════
   12. MAGNETIC BUTTONS
══════════════════════════════════════ */
(function initMagnetic() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  qsa(".btn-primary, .btn-hire, .btn-outline").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      btn.style.transform = `translateY(-3px) translate(${x}px,${y}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();

/* ══════════════════════════════════════
   13. SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════════ */
qsa('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = qs(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  });
});

/* ══════════════════════════════════════
   14. TEXT SCRAMBLE ON SECTION TITLES
══════════════════════════════════════ */
(function initScramble() {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.original = el.textContent;
      this.frame = null;
    }
    scramble() {
      let iter = 0;
      const length = this.original.length;
      clearInterval(this.frame);
      this.frame = setInterval(() => {
        this.el.textContent = this.original
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < iter) return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
        if (iter >= length) clearInterval(this.frame);
        iter += 1.5;
      }, 30);
    }
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const scramble = new TextScramble(e.target);
        setTimeout(() => scramble.scramble(), 100);
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.6 },
  );

  qsa(".sec-tag").forEach((el) => obs.observe(el));
})();
