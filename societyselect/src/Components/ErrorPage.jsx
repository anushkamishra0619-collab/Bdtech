import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import "./ErrorPage.css";

function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(dx) < 1e-6) break;
      if (d === 0) break;
      t -= dx / d;
    }
    return sampleY(Math.max(0, Math.min(1, t)));
  };
}

function makeEaseFn(ease) {
  if (Array.isArray(ease) && ease.length === 4) {
    return cubicBezier(ease[0], ease[1], ease[2], ease[3]);
  }
  switch (ease) {
    case "linear":
      return (t) => t;
    case "easeIn":
      return (t) => t * t;
    case "easeOut":
      return (t) => 1 - (1 - t) * (1 - t);
    case "easeInOut":
      return (t) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
    case "circIn":
      return (t) => 1 - Math.sqrt(1 - t * t);
    case "circOut":
      return (t) => Math.sqrt(1 - (t - 1) * (t - 1));
    case "circInOut":
      return (t) =>
        t < 0.5
          ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
          : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
    case "backIn":
      return (t) => 2.70158 * t * t * t - 1.70158 * t * t;
    case "backOut":
      return (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
    default:
      return (t) => t;
  }
}

function FlickerTitle({
  text,
  className = "",
  color = "#1b2136",
  replay = "yes",
  position = "above",
  duration = 2,
  ease = "easeInOut",
  delay = 0,
  flickerCount = 10,
  letterFlickerEnabled = true,
  letterFlickerOpacity = 30,
  letterFlickerIntensity = 10,
}) {
  const [flickerLetters, setFlickerLetters] = useState(() => new Set());
  const timersRef = useRef([]);
  const elementRef = useRef(null);
  const hasPlayedRef = useRef(false);

  const getThreshold = () => {
    switch (position) {
      case "above":
        return 0;
      case "middle":
        return 0.5;
      case "below":
        return 1.0;
      default:
        return 0;
    }
  };

  const generateTimings = (count, totalMs, easeCurve) => {
    const fn = makeEaseFn(easeCurve);
    const intervals = [];
    let prev = 0;
    for (let i = 1; i <= count; i++) {
      const t = i / count;
      const cur = fn(t) * totalMs;
      intervals.push(Math.max(0, cur - prev));
      prev = cur;
    }
    return intervals;
  };

  const runFlicker = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFlickerLetters(new Set());

    if (!letterFlickerEnabled) return;

    const chars = (text ?? "").split("");
    const nonSpaceIndices = chars.reduce((acc, c, i) => {
      if (c.trim() !== "") acc.push(i);
      return acc;
    }, []);
    if (nonSpaceIndices.length === 0) return;

    const totalMs = duration * 1000;
    const intervals = generateTimings(Math.max(1, flickerCount), totalMs, ease);
    const cycleDuration = Math.round(
      1000 * Math.pow(50 / 1000, (letterFlickerIntensity - 1) / 19)
    );
    const sub1 = Math.round(cycleDuration / 3);
    const sub2 = Math.round((2 * cycleDuration) / 3);

    let cursor = delay * 1000;

    intervals.forEach((slotMs) => {
      const windowStart = cursor;
      const windowEnd = windowStart + slotMs;
      let tickCursor = windowStart;

      while (tickCursor < windowEnd) {
        const tFlicker1 = tickCursor;
        const tFill = tickCursor + sub1;
        const tFlicker2 = tickCursor + sub2;
        const slot = { sel: new Set() };

        timersRef.current.push(
          setTimeout(() => {
            const count = Math.min(
              nonSpaceIndices.length,
              Math.floor(Math.random() * 2) + 1
            );
            const shuffled = [...nonSpaceIndices].sort(() => Math.random() - 0.5);
            slot.sel = new Set(shuffled.slice(0, count));
            setFlickerLetters(slot.sel);
          }, tFlicker1)
        );

        if (tFill < windowEnd) {
          timersRef.current.push(
            setTimeout(() => setFlickerLetters(new Set()), tFill)
          );
        }

        if (tFlicker2 < windowEnd) {
          timersRef.current.push(
            setTimeout(() => setFlickerLetters(slot.sel), tFlicker2)
          );
        }

        tickCursor += cycleDuration;
      }

      cursor = windowEnd;
    });

    timersRef.current.push(
      setTimeout(() => setFlickerLetters(new Set()), cursor)
    );
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    hasPlayedRef.current = false;
    setFlickerLetters(new Set());

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasPlayedRef.current) {
              hasPlayedRef.current = true;
              runFlicker();
            }
          } else if (replay === "yes") {
            hasPlayedRef.current = false;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
            setFlickerLetters(new Set());
          }
        });
      },
      { threshold: getThreshold() }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text,
    replay,
    position,
    duration,
    ease,
    delay,
    flickerCount,
    letterFlickerEnabled,
    letterFlickerIntensity,
  ]);

  const chars = (text ?? "").split("");

  return (
    <h2
      ref={elementRef}
      className={className}
      onMouseEnter={runFlicker}
      style={{ color }}
    >
      {chars.map((char, i) => {
        if (char.trim() === "" || !flickerLetters.has(i)) {
          return <span key={i}>{char}</span>;
        }
        return (
          <span
            key={i}
            style={{
              opacity: letterFlickerOpacity / 100,
              transition: "none",
            }}
          >
            {char}
          </span>
        );
      })}
    </h2>
  );
}

export default function ErrorPage({
  code = "404",
  title = "Page Not Found",
  message = "We're sorry, the page you requested could not be found\nPlease go back to the homepage",
}) {
  const [retrying, setRetrying] = useState(false);

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign("/");
    }
  };

  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => window.location.reload(), 150);
  };

  return (
    <main className="error-page">
      <div className="error-card">
        {/* Top-left hamburger menu icon */}
        <header className="error-header">
          <button
            type="button"
            className="error-menu-btn"
            aria-label="Menu"
            onClick={() => window.location.assign("/")}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <div className="error-layout">
          <div className="error-plug-art">
            <svg
              viewBox="0 0 420 520"
              className="plug-art-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="195" cy="255" r="128" fill="#f3f4f6" />

              <path
                className="cable"
                d="M365 82 H218 Q195 82 195 105 V165"
              />
              <g className="plug">
                <rect x="184" y="160" width="22" height="14" rx="5" />
                <path d="M174 172 H216 V195 Q216 203 208 203 H182 Q174 203 174 195 Z" />
                <rect x="169" y="201" width="52" height="7" rx="3" fill="#253b73" />
              </g>
              <g className="spark">
                <path d="M150 218 L138 207" />
                <path d="M145 234 L128 234" />
                <path d="M162 210 L160 198" />
              </g>
              <path
                className="cable"
                d="M195 352 V385 Q195 408 172 408 H78 Q55 408 55 431 V485"
              />

              <g className="plug">
                
                <rect x="183" y="274" width="6" height="18" rx="3" fill="#253b73" />
                <rect x="201" y="274" width="6" height="18" rx="3" fill="#253b73" />
                <rect x="169" y="291" width="52" height="7" rx="3" fill="#253b73" />
                <path d="M174 297 H216 V322 Q216 332 206 332 H184 Q174 332 174 322 Z" />
                <rect x="184" y="331" width="22" height="15" rx="5" />
              </g>
              <g className="spark">
                <path d="M235 294 L249 284" />
                <path d="M240 310 L256 314" />
                <path d="M231 324 L242 336" />
              </g>
            </svg>
          </div>
          <section className="error-content">
            <h1 className="error-code">{code}</h1>

            <FlickerTitle
              text={title}
              className="error-title"
              color="#1b2136"
              replay="yes"
              position="above"
              duration={2}
              ease="easeInOut"
              delay={0}
              flickerCount={10}
              letterFlickerEnabled={true}
              letterFlickerOpacity={30}
              letterFlickerIntensity={10}
            />

            <p className="error-message">{message}</p>

            <button
              type="button"
              className="error-home-button"
              onClick={() => window.location.assign("/")}
            >
              GO HOME
            </button>
            <div className="error-hidden-actions">
              <button type="button" onClick={goBack}>
                <FiArrowLeft /> Go back
              </button>

              <button type="button" onClick={retry} disabled={retrying}>
                <FiRefreshCw />
                {retrying ? "Retrying..." : "Retry"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}