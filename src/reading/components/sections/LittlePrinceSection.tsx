import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useStars, starColor } from '@/hooks/useStars';

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function range(p: number, start: number, end: number) {
  if (end === start) return p >= end ? 1 : 0;
  return clamp((p - start) / (end - start));
}

// Easing for smoother cinematic motion
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const QUOTE_LINES = ['De mooiste dingen ter wereld kun je niet zien of aanraken, je kunt ze', 'alleen met je hart voelen.'];
const QUOTE = QUOTE_LINES.join(' ');

export default function LittlePrinceSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const farStars = useStars(120, 7);
  const midStars = useStars(100, 13);
  const nearStars = useStars(60, 19);

  const p = progress;

  // ===== TITLE =====
  const titleIn = clamp(p / 0.1);
  const titleOut = p > 0.82 ? clamp(1 - (p - 0.82) / 0.15) : 1;
  const titleOpacity = titleIn * titleOut;
  const titleBlur = (1 - titleIn) * 18;
  const titleScale = 0.9 + titleIn * 0.1;
  const titleY = (1 - titleIn) * 40;

  // ===== PARALLAX LAYERS (camera-like depth) =====
  const cameraTilt = easeInOut(p) * 15;
  const farShift = p * 50;
  const midShift = p * 110;
  const nearShift = p * 200;
  const fgShift = p * 320;

  // ===== PLANET =====
  const planetDrift = easeInOut(range(p, 0.05, 0.4));
  const planetX = -10 - planetDrift * 100;
  const planetY = -5 - planetDrift * 60;
  const planetScale = 1 - planetDrift * 0.2;
  const planetRotate = p * 8; // subtle rotation

  // ===== ROCKET — STAGED IGNITION SEQUENCE =====
  // Phase 1: space moves (0 → 0.1)
  // Phase 2: planet/prince move (0.05 → 0.25)
  // Phase 3: rocket appears bottom (0.12 → 0.22)
  // Phase 4: engine glow (0.18 → 0.28)
  // Phase 5: flame appears (0.24 → 0.32)
  // Phase 6: smoke/particles (0.28 → 0.35)
  // Phase 7-8: accelerate and fly diagonally (0.3 → 0.78)
  const rocketAppear = range(p, 0.12, 0.22);
  const engineGlow = range(p, 0.18, 0.30);
  const flameIntensity = range(p, 0.24, 0.34);
  const smokeIntensity = range(p, 0.28, 0.38);

  const rocketFlyStart = 0.30;
  const rocketFlyEnd = 0.82;
  const rocketFlyP = easeInOut(range(p, rocketFlyStart, rocketFlyEnd));

  const rocketX = 92 - rocketFlyP * 104; // right edge to beyond the left edge
  const rocketY = 88 - rocketFlyP * 100; // bottom corner to beyond the top edge
  const rocketOpacity = rocketAppear * clamp(1 - (rocketFlyP - 0.88) / 0.12);
  const rocketRotation = -45; // nose points toward the upper-left corner
  // Acceleration effect — starts slow, speeds up
  const rocketScale = (0.5 + rocketAppear * 0.25) * (1 + rocketFlyP * 0.4);
  // Motion blur increases with speed
  const motionBlur = rocketFlyP * 4;

  // ===== TRAIL =====
  const trailProgress = range(p, rocketFlyStart + 0.02, rocketFlyEnd);
  const trailOpacity = clamp(trailProgress * 1.8) * clamp(1 - (rocketFlyP - 0.88) / 0.12);

  // ===== PARTICLE-TO-TEXT EFFECT =====
  // Particles form letters progressively as rocket flies
  const textFormStart = 0.38;
  const textFormEnd = 0.72;
  const textFormP = range(p, textFormStart, textFormEnd);

  // Each character has its own reveal threshold
  const chars = QUOTE.split('');
  const charRevealThresholds = chars.map((_, i) => {
    const charProgress = i / chars.length;
    return textFormStart + charProgress * (textFormEnd - textFormStart);
  });

  // Overall text glow after fully formed
  const textGlow = range(p, textFormEnd, textFormEnd + 0.08);
  // Text fades out at end
  const textFadeOut = p > 0.88 ? clamp(1 - (p - 0.88) / 0.12) : 1;

  // Golden particles around text
  const particleCount = 40;
  const particleSeed = useStars(particleCount, 31);

  return (
    <section
      ref={ref}
      id="little-prince"
      className="relative h-screen w-full overflow-hidden vignette"
      style={{
        background: 'radial-gradient(ellipse at 50% 55%, #0c1230 0%, #060a1e 35%, #02030e 70%, #010108 100%)',
      }}
    >
      {/* ===== DEEP SPACE NEBULA LAYERS ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at ${25 + p * 15}% ${35 + p * 25}%, rgba(80,50,140,0.12), transparent 60%),
            radial-gradient(ellipse 50% 60% at ${75 - p * 10}% ${30 + p * 15}%, rgba(40,90,160,0.08), transparent 65%),
            radial-gradient(ellipse 40% 50% at 50% 80%, rgba(100,60,120,0.06), transparent 70%)
          `,
          transform: `translateY(${farShift * 0.2}px)`,
        }}
      />

      {/* Volumetric light glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${50 + p * 10}% ${55 + p * 20}%, rgba(100,130,200,${0.04 + engineGlow * 0.06}), transparent 50%)`,
        }}
      />

      {/* ===== FAR STARS (deepest parallax) ===== */}
      <div className="absolute inset-0" style={{ transform: `translateY(${farShift * 0.25}px) scale(1.05)` }}>
        {farStars.map((star, i) => (
          <span
            key={`far-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 0.7}px`,
              height: `${star.size * 0.7}px`,
              background: starColor(star.hue),
              opacity: star.opacity * 0.4,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              ['--star-opacity' as string]: star.opacity * 0.4,
              boxShadow: star.bright ? `0 0 ${star.size * 2}px ${starColor(star.hue)}` : 'none',
            }}
          />
        ))}
      </div>

      {/* ===== MID STARS ===== */}
      <div className="absolute inset-0" style={{ transform: `translateY(${midShift * 0.35}px)` }}>
        {midStars.map((star, i) => (
          <span
            key={`mid-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 1.1}px`,
              height: `${star.size * 1.1}px`,
              background: starColor(star.hue),
              opacity: star.opacity * 0.7,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              ['--star-opacity' as string]: star.opacity * 0.7,
              boxShadow: star.bright ? `0 0 ${star.size * 3}px ${starColor(star.hue)}, 0 0 ${star.size * 6}px ${starColor(star.hue)}40` : `0 0 ${star.size}px ${starColor(star.hue)}80`,
            }}
          />
        ))}
      </div>

      {/* ===== NEAR STARS (bright, with diffraction spikes) ===== */}
      <div className="absolute inset-0" style={{ transform: `translateY(${nearShift * 0.5}px)` }}>
        {nearStars.map((star, i) => {
          const color = starColor(star.hue);
          return (
            <div
              key={`near-${i}`}
              className="absolute"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: star.opacity,
                animation: `twinkle-bright ${star.duration}s ease-in-out ${star.delay}s infinite`,
                ['--star-opacity' as string]: star.opacity,
              }}
            >
              {/* Core */}
              <span
                className="absolute rounded-full"
                style={{
                  width: `${star.size * 1.5}px`,
                  height: `${star.size * 1.5}px`,
                  background: color,
                  boxShadow: `0 0 ${star.size * 4}px ${color}, 0 0 ${star.size * 8}px ${color}60`,
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Diffraction spikes for bright stars */}
              {star.bright && (
                <>
                  <span className="absolute" style={{
                    width: `${star.size * 8}px`, height: '1px',
                    background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.5,
                  }} />
                  <span className="absolute" style={{
                    width: '1px', height: `${star.size * 8}px`,
                    background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.5,
                  }} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== DISTANT GALAXIES ===== */}
      <div
        className="absolute rounded-full"
        style={{
          left: '12%', top: '22%', width: '200px', height: '120px',
          background: 'radial-gradient(ellipse, rgba(120,80,200,0.08), transparent 70%)',
          filter: 'blur(25px)',
          transform: `translateY(${midShift * 0.4}px) rotate(15deg)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: '75%', top: '55%', width: '260px', height: '150px',
          background: 'radial-gradient(ellipse, rgba(60,130,200,0.06), transparent 70%)',
          filter: 'blur(30px)',
          transform: `translateY(${midShift * 0.3}px) rotate(-10deg)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: '60%', top: '15%', width: '140px', height: '80px',
          background: 'radial-gradient(ellipse, rgba(200,100,150,0.05), transparent 70%)',
          filter: 'blur(20px)',
          transform: `translateY(${nearShift * 0.2}px)`,
        }}
      />

      {/* ===== ASTEROIDS (varied sizes, textured) ===== */}
      {[
        { x: 10, y: 68, s: 18, rot: 15 },
        { x: 85, y: 28, s: 12, rot: -20 },
        { x: 48, y: 12, s: 9, rot: 45 },
        { x: 30, y: 45, s: 6, rot: 70 },
        { x: 92, y: 75, s: 8, rot: -30 },
      ].map((a, i) => (
        <div
          key={`ast-${i}`}
          className="absolute"
          style={{
            left: `${a.x}%`,
            top: `${a.y}%`,
            width: `${a.s}px`,
            height: `${a.s * 0.85}px`,
            background: 'linear-gradient(135deg, #5a5a6a 0%, #3a3a4a 40%, #2a2a38 100%)',
            borderRadius: '45% 55% 40% 60% / 50% 45% 55% 50%',
            boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.3)',
            transform: `translateY(${nearShift * 0.7}px) rotate(${a.rot}deg)`,
            animation: `drift ${8 + i * 2}s ease-in-out ${i}s infinite`,
          }}
        >
          {/* Crater detail */}
          <div className="absolute rounded-full bg-black/30" style={{ width: '30%', height: '30%', left: '20%', top: '30%' }} />
          <div className="absolute rounded-full bg-black/20" style={{ width: '20%', height: '20%', left: '55%', top: '50%' }} />
        </div>
      ))}

      {/* ===== DISTANT PLANETS ===== */}
      <div
        className="absolute"
        style={{
          left: '6%', top: '10%', width: '70px', height: '70px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 28%, #d49a6a 0%, #a86a40 35%, #6a3820 65%, #3a1a0a 100%)',
          boxShadow: '0 0 35px rgba(200,130,80,0.15), inset -8px -8px 20px rgba(0,0,0,0.5)',
          transform: `translateY(${midShift * 0.35}px)`,
        }}
      >
        {/* Ring system */}
        <div className="absolute" style={{
          left: '50%', top: '50%',
          width: '120px', height: '20px',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          borderRadius: '50%',
          border: '2px solid rgba(200,160,120,0.2)',
          borderTopColor: 'transparent',
          borderBottomColor: 'rgba(200,160,120,0.1)',
        }} />
      </div>
      <div
        className="absolute"
        style={{
          left: '80%', top: '15%', width: '50px', height: '50px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 32%, #9ad0e8 0%, #5a90b0 40%, #2a5070 70%, #15303a 100%)',
          boxShadow: '0 0 30px rgba(120,180,220,0.12), inset -6px -6px 15px rgba(0,0,0,0.4)',
          transform: `translateY(${midShift * 0.45}px)`,
        }}
      />

      {/* ===== LITTLE PRINCE'S PLANET ===== */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '52%',
          transform: `translate(-50%, -50%) translate(${planetX}px, ${planetY}px) scale(${planetScale}) rotate(${planetRotate}deg)`,
        }}
      >
        {/* Atmospheric glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '260px', height: '260px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(220,180,130,0.12) 30%, rgba(200,160,100,0.04) 60%, transparent 75%)',
            filter: 'blur(12px)',
          }}
        />
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: '200px', height: '200px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(220,190,140,0.08)',
            filter: 'blur(2px)',
          }}
        />

        {/* Planet body — textured with craters and shadows */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: '170px', height: '170px',
            background: `
              radial-gradient(circle at 30% 25%, #e8c890 0%, #d4a86a 20%, #c89050 40%, #a06830 65%, #6a4018 85%, #3a200a 100%)
            `,
            boxShadow: `
              inset -20px -20px 50px rgba(0,0,0,0.5),
              inset 8px 8px 30px rgba(255,220,160,0.15),
              0 0 50px rgba(200,160,100,0.2),
              0 0 100px rgba(180,140,80,0.08)
            `,
          }}
        >
          {/* Craters and surface details */}
          <div className="absolute rounded-full" style={{ width: '24px', height: '16px', left: '25%', top: '50%', background: 'radial-gradient(ellipse, rgba(100,60,30,0.5), transparent)', filter: 'blur(2px)' }} />
          <div className="absolute rounded-full" style={{ width: '16px', height: '12px', left: '58%', top: '38%', background: 'radial-gradient(ellipse, rgba(80,50,25,0.4), transparent)', filter: 'blur(1.5px)' }} />
          <div className="absolute rounded-full" style={{ width: '12px', height: '8px', left: '40%', top: '68%', background: 'radial-gradient(ellipse, rgba(90,55,30,0.35), transparent)', filter: 'blur(1px)' }} />
          <div className="absolute rounded-full" style={{ width: '10px', height: '7px', left: '70%', top: '60%', background: 'radial-gradient(ellipse, rgba(70,45,20,0.3), transparent)', filter: 'blur(1px)' }} />
          {/* Highlight (lit side) */}
          <div className="absolute rounded-full" style={{
            width: '60px', height: '60px', left: '15%', top: '15%',
            background: 'radial-gradient(circle, rgba(255,240,200,0.2), transparent 70%)',
            filter: 'blur(5px)',
          }} />
        </div>

        {/* Rose — detailed with petals and glow */}
        <div
          className="absolute left-1/2 top-0"
          style={{
            transform: `translate(-50%, -60%)`,
            animation: 'float-gentle 5s ease-in-out infinite',
            filter: 'drop-shadow(0 0 8px rgba(255,100,130,0.3))',
          }}
        >
          <svg width="60" height="80" viewBox="0 0 60 80">
            {/* Stem with gradient */}
            <line x1="29" y1="42" x2="29" y2="68" stroke="url(#stemGrad)" strokeWidth="3" />
            <defs>
              <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a8b3a" />
                <stop offset="100%" stopColor="#2a5a1a" />
              </linearGradient>
              <radialGradient id="rosePetalOuter" cx="0.5" cy="0.5">
                <stop offset="0%" stopColor="#ff6080" />
                <stop offset="100%" stopColor="#c4385a" />
              </radialGradient>
              <radialGradient id="rosePetalMid" cx="0.5" cy="0.4">
                <stop offset="0%" stopColor="#ff80a0" />
                <stop offset="100%" stopColor="#e05070" />
              </radialGradient>
              <radialGradient id="roseCenter" cx="0.5" cy="0.5">
                <stop offset="0%" stopColor="#fffae0" />
                <stop offset="100%" stopColor="#ffe090" />
              </radialGradient>
            </defs>
            {/* Leaf with detail */}
            <path d="M29 54 Q12 52 8 40 Q22 44 29 54" fill="#3a7b2a" opacity="0.9" />
            <path d="M29 50 Q12 48 8 36 Q22 40 29 50" fill="#4a9b3a" opacity="0.5" />
            {/* Leaf vein */}
            <path d="M10 42 L27 52" fill="none" stroke="#2a6a1a" strokeWidth="0.4" opacity="0.4" />

            {/* Outer petals — layered with depth */}
            <ellipse cx="29" cy="24" r="14" fill="url(#rosePetalOuter)" opacity="0.85" />
            {/* Individual outer petals */}
            <path d="M20 18 Q15 12 18 8 Q22 12 24 18 Z" fill="url(#rosePetalMid)" opacity="0.9" />
            <path d="M38 18 Q43 12 40 8 Q36 12 34 18 Z" fill="url(#rosePetalMid)" opacity="0.85" />
            <path d="M18 28 Q12 32 15 38 Q20 34 22 30 Z" fill="url(#rosePetalOuter)" opacity="0.8" />
            <path d="M40 28 Q46 32 43 38 Q38 34 36 30 Z" fill="url(#rosePetalOuter)" opacity="0.75" />

            {/* Mid petals */}
            <ellipse cx="22" cy="20" rx="9" ry="11" fill="url(#rosePetalMid)" opacity="0.9" />
            <ellipse cx="36" cy="21" rx="9" ry="11" fill="#d63a5b" opacity="0.88" />
            <ellipse cx="29" cy="14" rx="9" ry="10" fill="#ff5a7a" opacity="0.85" />

            {/* Inner petals — tightly curled */}
            <path d="M24 19 Q22 14 26 13 Q28 15 27 20 Z" fill="#ff7090" opacity="0.9" />
            <path d="M34 20 Q36 15 32 14 Q30 16 31 21 Z" fill="#ff6080" opacity="0.8" />
            <path d="M27 16 Q29 12 31 16 L30 20 Q29 18 28 20 Z" fill="#ff80a0" opacity="0.85" />

            {/* Center — glowing */}
            <circle cx="29" cy="22" r="4.5" fill="url(#roseCenter)" opacity="0.8" />
            <circle cx="29" cy="22" r="2.5" fill="#fffae0" opacity="0.7" />
            <circle cx="28" cy="21" r="1" fill="#ffffff" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* ===== LITTLE PRINCE FIGURE — cinematic illustration style ===== */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '52%',
          transform: `translate(-50%, -50%) translate(${planetX + 42}px, ${planetY - 82}px) scale(${planetScale}) rotate(${planetRotate}deg)`,
        }}
      >
        <svg width="60" height="78" viewBox="0 0 60 78" style={{
          animation: 'float-gentle 6s ease-in-out infinite',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(100,130,200,0.15))',
        }}>
          <defs>
            <radialGradient id="princeSkin" cx="0.35" cy="0.3">
              <stop offset="0%" stopColor="#e8c898" />
              <stop offset="60%" stopColor="#d4a878" />
              <stop offset="100%" stopColor="#b88858" />
            </radialGradient>
            <linearGradient id="princeCoat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a4a6e" />
              <stop offset="50%" stopColor="#2a3a5a" />
              <stop offset="100%" stopColor="#1a2a44" />
            </linearGradient>
            <linearGradient id="princeCoatShade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="40%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
            </linearGradient>
            <linearGradient id="princeHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8c060" />
              <stop offset="100%" stopColor="#c8a040" />
            </linearGradient>
            <linearGradient id="princeScarf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5a7a" />
              <stop offset="100%" stopColor="#d63a5b" />
            </linearGradient>
            <radialGradient id="princeGlow" cx="0.5" cy="0.3">
              <stop offset="0%" stopColor="rgba(255,220,160,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Soft body glow */}
          <ellipse cx="30" cy="40" rx="25" ry="45" fill="url(#princeGlow)" />

          {/* Legs */}
          <rect x="24" y="56" width="4" height="10" fill="url(#princeCoat)" rx="1" />
          <rect x="32" y="56" width="4" height="10" fill="url(#princeCoat)" rx="1" />
          {/* Boots with sole detail */}
          <ellipse cx="26" cy="67" rx="4.5" ry="2.5" fill="#1a1a2a" />
          <ellipse cx="34" cy="67" rx="4.5" ry="2.5" fill="#1a1a2a" />
          <rect x="22" y="66" width="8" height="1.5" fill="#2a2a3a" rx="0.5" />
          <rect x="30" y="66" width="8" height="1.5" fill="#2a2a3a" rx="0.5" />

          {/* Body / coat with realistic folds */}
          <g style={{ animation: 'breathe 4s ease-in-out infinite', transformOrigin: '30px 40px' }}>
            <path d="M22 28 Q30 25 38 28 L40 58 L20 58 Z" fill="url(#princeCoat)" />
            <path d="M22 28 Q30 25 38 28 L40 58 L20 58 Z" fill="url(#princeCoatShade)" />
            {/* Coat fold shadows */}
            <path d="M28 30 Q27 45 28 56" fill="none" stroke="#1a2a44" strokeWidth="0.8" opacity="0.4" />
            <path d="M33 30 Q34 45 33 56" fill="none" stroke="#1a2a44" strokeWidth="0.6" opacity="0.3" />
            {/* Coat collar */}
            <path d="M23 28 Q30 30 37 28 L35 32 Q30 33 25 32 Z" fill="#1a2a44" />
            {/* Coat buttons — golden with detail */}
            <circle cx="30" cy="34" r="1.2" fill="#d4a050" stroke="#a08030" strokeWidth="0.3" />
            <circle cx="30" cy="39" r="1.2" fill="#d4a050" stroke="#a08030" strokeWidth="0.3" />
            <circle cx="30" cy="44" r="1.2" fill="#d4a050" stroke="#a08030" strokeWidth="0.3" />
            <circle cx="30" cy="49" r="1.2" fill="#d4a050" stroke="#a08030" strokeWidth="0.3" />
          </g>

          {/* Head — proportionate, with facial features */}
          <circle cx="30" cy="18" r="10" fill="url(#princeSkin)" />
          {/* Face shadow — lit from upper left */}
          <ellipse cx="33" cy="20" rx="7" ry="8" fill="#c49868" opacity="0.25" />
          {/* Cheeks — subtle warmth */}
          <circle cx="25" cy="21" r="2" fill="#e8a080" opacity="0.2" />
          <circle cx="34" cy="21" r="2" fill="#e8a080" opacity="0.15" />
          {/* Eyes — simple but expressive */}
          <ellipse cx="26" cy="18" rx="1.5" ry="2" fill="#2a3a4a" />
          <ellipse cx="33" cy="18" rx="1.5" ry="2" fill="#2a3a4a" />
          {/* Eye highlights */}
          <circle cx="26.5" cy="17.5" r="0.5" fill="#ffffff" opacity="0.8" />
          <circle cx="33.5" cy="17.5" r="0.5" fill="#ffffff" opacity="0.8" />
          {/* Eyebrows */}
          <path d="M24 15 Q26 14 28 15" fill="none" stroke="#c8a050" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M31 15 Q33 14 35 15" fill="none" stroke="#c8a050" strokeWidth="0.8" strokeLinecap="round" />
          {/* Nose hint */}
          <path d="M30 19 L29.5 22 L30 22.5" fill="none" stroke="#c49868" strokeWidth="0.4" opacity="0.5" />
          {/* Mouth — small gentle smile */}
          <path d="M28 24 Q30 25 32 24" fill="none" stroke="#a07050" strokeWidth="0.6" strokeLinecap="round" />

          {/* Hair — golden, wavy with individual strands */}
          <g style={{ animation: 'hair-sway 5s ease-in-out infinite', transformOrigin: '30px 12px' }}>
            <path d="M19 17 Q20 7 30 5 Q40 7 41 17 L39 20 Q36 12 30 10 Q24 12 21 20 Z" fill="url(#princeHair)" />
            {/* Hair strand detail */}
            <path d="M22 14 Q24 9 30 8 Q36 9 38 14" fill="none" stroke="#f0d080" strokeWidth="0.6" opacity="0.5" />
            <path d="M24 12 Q27 8 30 8 Q33 8 36 12" fill="none" stroke="#d8b050" strokeWidth="0.5" opacity="0.4" />
            {/* Hair curl at front */}
            <path d="M21 16 Q19 14 20 11" fill="none" stroke="#e8c060" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M39 16 Q41 14 40 11" fill="none" stroke="#e8c060" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Scarf — flowing with animation */}
          <g style={{ animation: 'scarf-wave 3s ease-in-out infinite', transformOrigin: '30px 26px' }}>
            <path d="M20 25 Q30 30 40 25 L42 33 Q30 36 18 33 Z" fill="url(#princeScarf)" />
            <path d="M20 25 Q30 29 40 25 L40 28 Q30 31 20 28 Z" fill="#ff7090" opacity="0.4" />
            {/* Scarf fringe/tail */}
            <path d="M18 32 Q15 38 17 42 L19 41 Q18 36 20 33" fill="#d63a5b" />
            <path d="M42 32 Q45 38 43 42 L41 41 Q42 36 40 33" fill="#d63a5b" opacity="0.7" />
          </g>

          {/* Arms — small, at sides */}
          <path d="M22 30 Q19 38 20 46" fill="none" stroke="url(#princeCoat)" strokeWidth="5" strokeLinecap="round" />
          <path d="M38 30 Q41 38 40 46" fill="none" stroke="url(#princeCoat)" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {/* ===== ROCKET ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${rocketX}%`,
          top: `${rocketY}%`,
          transform: `translate(-50%, -50%) rotate(${rocketRotation}deg) scale(${rocketScale})`,
          opacity: rocketOpacity,
          filter: `drop-shadow(0 0 ${10 + engineGlow * 20}px rgba(255,160,60,${0.4 + engineGlow * 0.4})) blur(${motionBlur}px)`,
        }}
      >
        <svg width="50" height="95" viewBox="0 0 50 95">
          <defs>
            {/* Metallic body gradient */}
            <linearGradient id="bodyMetal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a8a9a" />
              <stop offset="20%" stopColor="#dadae8" />
              <stop offset="50%" stopColor="#f0f0f8" />
              <stop offset="80%" stopColor="#cacad8" />
              <stop offset="100%" stopColor="#7a7a8a" />
            </linearGradient>
            <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>
            <radialGradient id="windowGlow" cx="0.4" cy="0.35">
              <stop offset="0%" stopColor="#e0f4ff" />
              <stop offset="40%" stopColor="#5ab0e0" />
              <stop offset="100%" stopColor="#1a4060" />
            </radialGradient>
            <radialGradient id="noseMetal" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#f0a0a0" />
              <stop offset="60%" stopColor="#c44060" />
              <stop offset="100%" stopColor="#802040" />
            </radialGradient>
            <linearGradient id="finMetal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a03050" />
              <stop offset="50%" stopColor="#c44060" />
              <stop offset="100%" stopColor="#802040" />
            </linearGradient>
          </defs>

          {/* Engine nozzle — metallic */}
          <path d="M17 62 L15 72 L35 72 L33 62 Z" fill="url(#bodyMetal)" opacity="0.9" />
          <path d="M17 62 L15 72 L35 72 L33 62 Z" fill="url(#bodyShade)" />
          {/* Nozzle inner glow */}
          <ellipse cx="25" cy="70" rx="8" ry="3" fill={`rgba(255,140,40,${engineGlow * 0.8})`} />

          {/* Main body — metallic with reflections */}
          <path d="M25 8 Q33 18 33 42 L33 62 L17 62 L17 42 Q17 18 25 8 Z" fill="url(#bodyMetal)" />
          <path d="M25 8 Q33 18 33 42 L33 62 L17 62 L17 42 Q17 18 25 8 Z" fill="url(#bodyShade)" />

          {/* Body panel lines */}
          <line x1="17" y1="35" x2="33" y2="35" stroke="#a0a0b0" strokeWidth="0.4" opacity="0.5" />
          <line x1="17" y1="50" x2="33" y2="50" stroke="#a0a0b0" strokeWidth="0.4" opacity="0.5" />

          {/* Rivets */}
          {[20, 28, 36, 44, 52].map((y, i) => (
            <circle key={`rivet-l-${i}`} cx="18.5" cy={y} r="0.6" fill="#888898" />
          ))}
          {[20, 28, 36, 44, 52].map((y, i) => (
            <circle key={`rivet-r-${i}`} cx="31.5" cy={y} r="0.6" fill="#888898" />
          ))}

          {/* Window — porthole with glass reflection */}
          <circle cx="25" cy="28" r="6" fill="#1a3050" />
          <circle cx="25" cy="28" r="5" fill="url(#windowGlow)" />
          <circle cx="23" cy="26" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="25" cy="28" r="5" fill="none" stroke="#a0a0b0" strokeWidth="0.8" />

          {/* Nose cone — red metallic */}
          <path d="M25 8 Q30 14 25 18 Q20 14 25 8 Z" fill="url(#noseMetal)" />
          {/* Nose highlight */}
          <ellipse cx="23" cy="12" rx="1.5" ry="3" fill="#ffe0e0" opacity="0.4" />

          {/* Fins — metallic red with shading */}
          <path d="M17 50 L8 63 L17 58 Z" fill="url(#finMetal)" />
          <path d="M17 50 L8 63 L17 58 Z" fill="rgba(0,0,0,0.15)" />
          <path d="M33 50 L42 63 L33 58 Z" fill="url(#finMetal)" />
          <path d="M33 50 L42 63 L33 58 Z" fill="rgba(0,0,0,0.15)" />

          {/* Engine glow inside nozzle */}
          <ellipse cx="25" cy="68" rx="6" ry="2.5" fill={`rgba(255,200,80,${engineGlow * 0.9})`} filter="blur(1px)" />
        </svg>

        {/* ===== FLAME — dynamic, multi-layered ===== */}
        {flameIntensity > 0 && (
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '70px',
              transform: `translateX(-50%)`,
              opacity: flameIntensity,
            }}
          >
            {/* Outer flame */}
            <div
              className="absolute"
              style={{
                left: '50%', top: '0',
                transform: 'translateX(-50%)',
                width: '18px',
                height: `${30 + flameIntensity * 25}px`,
                background: 'radial-gradient(ellipse at top, rgba(255,140,40,0.7), rgba(255,80,20,0.4) 60%, transparent)',
                borderRadius: '50% 50% 40% 40% / 30% 30% 70% 70%',
                filter: 'blur(4px)',
                animation: 'flame-flicker 0.15s ease-in-out infinite',
              }}
            />
            {/* Inner flame */}
            <div
              className="absolute"
              style={{
                left: '50%', top: '0',
                transform: 'translateX(-50%)',
                width: '10px',
                height: `${22 + flameIntensity * 18}px`,
                background: 'radial-gradient(ellipse at top, rgba(255,240,180,0.9), rgba(255,180,60,0.6) 50%, transparent)',
                borderRadius: '50% 50% 40% 40% / 30% 30% 70% 70%',
                filter: 'blur(2px)',
                animation: 'flame-flicker 0.12s ease-in-out infinite',
              }}
            />
            {/* Core */}
            <div
              className="absolute"
              style={{
                left: '50%', top: '0',
                transform: 'translateX(-50%)',
                width: '5px',
                height: `${15 + flameIntensity * 12}px`,
                background: 'rgba(255,255,240,0.95)',
                borderRadius: '50% 50% 40% 40% / 30% 30% 70% 70%',
                filter: 'blur(1px)',
              }}
            />
          </div>
        )}

        {/* ===== SMOKE PARTICLES ===== */}
        {smokeIntensity > 0 && Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`smoke-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${42 + i * 3}%`,
              top: `${68 + (i % 2) * 4}px`,
              width: `${8 + i * 2}px`,
              height: `${8 + i * 2}px`,
              background: 'radial-gradient(circle, rgba(180,160,140,0.3), transparent 70%)',
              filter: 'blur(4px)',
              opacity: smokeIntensity * 0.5,
              animation: `smoke-rise ${2 + i * 0.3}s ease-out ${i * 0.15}s infinite`,
            }}
          />
        ))}

        {/* ===== ENGINE SPARK PARTICLES ===== */}
        {flameIntensity > 0.3 && Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI - Math.PI / 2;
          const dist = 15 + (i % 3) * 8;
          return (
            <div
              key={`spark-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '72px',
                width: '2px',
                height: '2px',
                background: '#ffcc60',
                boxShadow: '0 0 4px rgba(255,180,60,0.8)',
                transform: `translate(-50%, 0) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 5}px)`,
                opacity: flameIntensity * (0.4 + (i % 3) * 0.2),
              }}
            />
          );
        })}
      </div>

      {/* ===== ROCKET TRAIL — glowing, multi-layered ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${rocketX}%`,
          top: `${rocketY}%`,
          transform: `translate(-50%, -50%) rotate(${rocketRotation}deg) scale(${rocketScale})`,
          opacity: trailOpacity,
        }}
      >
        {/* Outer glow trail */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '72px',
            transform: 'translateX(-50%)',
            width: '30px',
            height: `${120 + trailProgress * 280}px`,
            background: 'linear-gradient(to bottom, rgba(255,160,60,0.5) 0%, rgba(255,100,30,0.3) 30%, rgba(200,60,20,0.1) 70%, transparent 100%)',
            filter: 'blur(12px)',
            borderRadius: '50%',
          }}
        />
        {/* Mid trail */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '72px',
            transform: 'translateX(-50%)',
            width: '14px',
            height: `${100 + trailProgress * 220}px`,
            background: 'linear-gradient(to bottom, rgba(255,220,140,0.8) 0%, rgba(255,180,80,0.5) 35%, rgba(255,120,40,0.2) 70%, transparent 100%)',
            filter: 'blur(5px)',
            borderRadius: '50%',
          }}
        />
        {/* Bright core trail */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '72px',
            transform: 'translateX(-50%)',
            width: '5px',
            height: `${80 + trailProgress * 180}px`,
            background: 'linear-gradient(to bottom, rgba(255,250,220,1) 0%, rgba(255,230,160,0.7) 40%, transparent 100%)',
            filter: 'blur(2px)',
            borderRadius: '50%',
          }}
        />
        {/* Trail spark particles */}
        {trailProgress > 0.1 && Array.from({ length: 12 }).map((_, i) => {
          const offsetY = 80 + (i / 12) * trailProgress * 200;
          const offsetX = (i % 2 === 0 ? 1 : -1) * (3 + (i % 3) * 2);
          return (
            <div
              key={`trail-spark-${i}`}
              className="absolute rounded-full"
              style={{
                left: `calc(50% + ${offsetX}px)`,
                top: `${offsetY}px`,
                width: `${1.5 + (i % 2)}px`,
                height: `${1.5 + (i % 2)}px`,
                background: i % 3 === 0 ? '#ffe8a0' : '#ffcc60',
                boxShadow: '0 0 4px rgba(255,200,80,0.6)',
                opacity: trailOpacity * (1 - i / 14),
              }}
            />
          );
        })}
      </div>

      {/* ===== PARTICLE-TO-TEXT EFFECT ===== */}
      <div
        className="absolute left-1/2 bottom-[calc(14%+4rem)] md:bottom-[14%] z-10 w-full max-w-6xl px-6 text-center"
        style={{
          transform: `translateX(-50%) scale(${0.96 + textFormP * 0.04})`,
          opacity: textFadeOut,
        }}
      >
        {/* Golden particles forming text */}
        {particleSeed.slice(0, 25).map((star, i) => {
          const charIdx = Math.floor((i / 25) * chars.length);
          const charThreshold = charRevealThresholds[charIdx];
          const localProgress = clamp((p - charThreshold) / 0.05);
          // Particles visible before text forms, fade as text appears
          const particleOpacity = textFormP > 0 && textFormP < 1
            ? clamp(1 - localProgress) * 0.6
            : 0;
          if (particleOpacity <= 0) return null;
          return (
            <span
              key={`text-particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y * 0.3}%`,
                width: '2px',
                height: '2px',
                background: i % 2 === 0 ? '#ffe8a0' : '#ffffff',
                boxShadow: '0 0 6px rgba(255,220,120,0.8)',
                opacity: particleOpacity,
                transform: `translate(${(1 - textFormP) * (star.x - 50) * 2}px, ${(1 - textFormP) * 20}px)`,
                transition: 'all 0.1s linear',
              }}
            />
          );
        })}

        {/* The actual text — revealed character by character */}
        <p
          className="font-serif-c italic text-xl md:text-2xl xl:text-3xl leading-relaxed"
          style={{
            textShadow: `0 0 ${20 + textGlow * 20}px rgba(255,200,100,${0.3 + textGlow * 0.3}), 0 0 ${40 + textGlow * 30}px rgba(255,180,80,${0.15 + textGlow * 0.15})`,
            color: 'rgba(255,240,210,0.95)',
          }}
        >
          {QUOTE_LINES.map((line, lineIndex) => (
            <span key={lineIndex} className="block md:whitespace-nowrap">
            {line.split('').map((char, charIndex) => {
            const i = charIndex + (lineIndex === 0 ? 0 : QUOTE_LINES[0].length + 1);
            const threshold = charRevealThresholds[i];
            const charP = clamp((p - threshold) / 0.04);
            if (charP <= 0) return null;
            const charBlur = (1 - charP) * 12;
            const charOpacity = charP;
            return (
              <span
                key={`char-${i}`}
                style={{
                  opacity: charOpacity,
                  filter: `blur(${charBlur}px)`,
                  textShadow: charP > 0.8
                    ? `0 0 ${8 + textGlow * 12}px rgba(255,220,140,${0.6 + textGlow * 0.3})`
                    : 'none',
                  display: char === ' ' ? 'inline' : 'inline-block',
                  transition: 'all 0.05s linear',
                }}
              >
                {char}
              </span>
            );
            })}
            </span>
          ))}
        </p>
      </div>

      {/* ===== TITLE ===== */}
      <div
        className="absolute top-[11%] left-1/2 z-10 text-center w-full px-4"
        style={{
          opacity: titleOpacity,
          filter: `blur(${titleBlur}px)`,
          transform: `translateX(-50%) translateY(${titleY}px) scale(${titleScale})`,
        }}
      >
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-white tracking-wide"
          style={{ textShadow: '0 0 40px rgba(150,180,255,0.5), 0 0 80px rgba(100,140,220,0.2)' }}
        >
          De kleine prins
        </h1>
        <p className="font-serif-c italic text-lg sm:text-xl md:text-2xl text-amber-200/70 mt-3 tracking-wide">
          Antoine de Saint-Exupéry
        </p>
      </div>

      {/* Section number */}
      <div className="absolute bottom-6 left-6 font-display text-white/15 text-sm tracking-widest z-10">
        01 / 04
      </div>
    </section>
  );
}
