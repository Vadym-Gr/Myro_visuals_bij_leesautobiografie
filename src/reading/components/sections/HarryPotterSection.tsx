import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useStars, starColor } from '@/hooks/useStars';

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function range(p: number, start: number, end: number) {
  if (end === start) return p >= end ? 1 : 0;
  return clamp((p - start) / (end - start));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function HarryPotterSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const p = progress;
  const stars = useStars(100, 23);

  // ===== TITLE =====
  const titleIn = clamp(p / 0.1);
  const titleOut = p > 0.85 ? clamp(1 - (p - 0.85) / 0.15) : 1;
  const titleOpacity = titleIn * titleOut;
  const titleBlur = (1 - titleIn) * 18;
  const titleY = (1 - titleIn) * 40;

  // ===== CINEMATIC PARALLAX =====
  // Camera slowly zooms toward castle
  const cameraZoom = 1 + easeInOut(p) * 0.15;
  const farShift = p * 40;
  const midShift = p * 90;
  const nearShift = p * 160;
  const fgShift = p * 240;

  // ===== ANIMATION PHASES =====
  // 1. Camera moves toward castle (0 → 0.25)
  // 2. Mist drifts between buildings (0 → 0.4)
  // 3. Floating light particles (0.1 → 0.4)
  // 4. Person with wand appears (0.2 → 0.35)
  // 5. Wand rises (0.3 → 0.48)
  // 6. Wand tip glows (0.42 → 0.52)
  // 7. Particles gather around wand (0.48 → 0.58)
  // 8. Light flash (0.55 → 0.65)
  // 9. Energy shoots forward (0.6 → 0.75)
  // 10. Particles spread (0.65 → 0.92)

  const wandAppear = range(p, 0.2, 0.35);
  const wandRise = easeInOut(range(p, 0.3, 0.48));
  const wandGlow = range(p, 0.42, 0.55);
  const gatherParticles = range(p, 0.48, 0.58);
  const flashIntensity = range(p, 0.55, 0.68);
  const energyShoot = range(p, 0.6, 0.78);
  const particleSpread = range(p, 0.65, 0.92);
  const energyWave = range(p, 0.58, 0.92);
  const quoteReveal = easeInOut(range(p, 0.48, 0.74));

  // Wand tip position (computed for particle origins)
  const wandTipX = 55 - wandRise * 5;
  const wandTipY = 75 - wandRise * 30;

  // Precomputed strings
  const flashSize = `${flashIntensity * 350}px`;
  const flashTransform = `translateX(-50%) translateY(${fgShift * 0.1}px) translate(${wandRise * 5 - 2.5}%, ${(0 - wandRise) * 30}px)`;
  const flashBottom = `${8 + wandRise * 15}%`;
  const energyBg = `radial-gradient(circle at 50% ${75 - wandRise * 10}%, rgba(255,200,100,${energyWave * 0.1}), rgba(200,160,80,${energyWave * 0.04}) 30%, transparent 60%)`;

  return (
    <section
      ref={ref}
      id="harry-potter"
      className="relative h-screen w-full overflow-hidden vignette"
      style={{
        background: 'radial-gradient(ellipse at 50% 75%, #1c1830 0%, #0f0c1c 40%, #080612 70%, #030208 100%)',
      }}
    >
      {/* ===== DARK CLOUDS / ATMOSPHERE ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 30% at 50% 5%, rgba(30,25,45,0.6), transparent),
            radial-gradient(ellipse 60% 25% at 30% 10%, rgba(20,18,35,0.4), transparent),
            radial-gradient(ellipse 70% 30% at 70% 8%, rgba(25,22,40,0.5), transparent)
          `,
          transform: `translateY(${farShift * 0.2}px) scale(${cameraZoom})`,
          transformOrigin: '50% 70%',
        }}
      />

      {/* ===== STARS (partially obscured by clouds) ===== */}
      <div className="absolute inset-0" style={{ transform: `translateY(${farShift * 0.3}px) scale(${cameraZoom})`, transformOrigin: '50% 70%' }}>
        {stars.slice(0, 50).map((star, i) => (
          <span
            key={`hp-star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y * 0.4}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: starColor(star.hue),
              opacity: star.opacity * 0.5,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              ['--star-opacity' as string]: star.opacity * 0.5,
              boxShadow: star.bright ? `0 0 ${star.size * 3}px ${starColor(star.hue)}` : 'none',
            }}
          />
        ))}
      </div>

      {/* ===== MOON — detailed with craters and glow ===== */}
      <div
        className="absolute"
        style={{
          right: '14%',
          top: '8%',
          width: '100px',
          height: '100px',
          transform: `translateY(${farShift * 0.35}px) scale(${cameraZoom * 0.98})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Moon glow */}
        <div className="absolute rounded-full" style={{
          width: '180px', height: '180px',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(240,235,210,0.12), transparent 70%)',
          filter: 'blur(15px)',
        }} />
        <div
          className="relative rounded-full"
          style={{
            width: '100px', height: '100px',
            background: 'radial-gradient(circle at 35% 32%, #f5f0d8 0%, #e0d8b8 30%, #c8c0a0 55%, #9a9078 80%, #6a6250 100%)',
            boxShadow: 'inset -12px -12px 30px rgba(0,0,0,0.3), 0 0 50px rgba(240,235,210,0.2)',
          }}
        >
          {/* Craters */}
          <div className="absolute rounded-full" style={{ width: '14px', height: '10px', left: '25%', top: '35%', background: 'radial-gradient(ellipse, rgba(100,90,70,0.4), transparent)', filter: 'blur(1px)' }} />
          <div className="absolute rounded-full" style={{ width: '10px', height: '8px', left: '55%', top: '50%', background: 'radial-gradient(ellipse, rgba(90,80,60,0.35), transparent)', filter: 'blur(1px)' }} />
          <div className="absolute rounded-full" style={{ width: '8px', height: '6px', left: '40%', top: '65%', background: 'radial-gradient(ellipse, rgba(80,70,55,0.3), transparent)', filter: 'blur(0.5px)' }} />
          <div className="absolute rounded-full" style={{ width: '6px', height: '5px', left: '65%', top: '25%', background: 'radial-gradient(ellipse, rgba(85,75,60,0.3), transparent)', filter: 'blur(0.5px)' }} />
        </div>
      </div>

      {/* ===== DISTANT MOUNTAINS — layered ===== */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '40%', transform: `translateY(${midShift * 0.15}px) scale(${cameraZoom})`, transformOrigin: '50% 100%' }}
        viewBox="0 0 1200 350"
        preserveAspectRatio="none"
      >
        {/* Furthest mountains */}
        <path d="M0 350 L0 200 L80 140 L200 180 L350 90 L500 150 L650 70 L800 140 L950 100 L1100 160 L1200 120 L1200 350 Z" fill="#10101e" opacity="0.5" />
        {/* Mid mountains with detail */}
        <path d="M0 350 L0 240 L100 180 L220 220 L380 140 L520 200 L680 130 L830 190 L980 170 L1150 210 L1200 190 L1200 350 Z" fill="#181530" opacity="0.7" />
        {/* Foreground hills */}
        <path d="M0 350 L0 290 L150 250 L320 280 L500 220 L680 270 L850 240 L1050 280 L1200 260 L1200 350 Z" fill="#0e0c1a" opacity="0.85" />
      </svg>

      {/* ===== VOLUMETRIC MIST BETWEEN BUILDINGS ===== */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: '15%', height: '25%',
          background: 'linear-gradient(to top, rgba(60,55,80,0.25), rgba(50,45,70,0.1) 50%, transparent)',
          filter: 'blur(25px)',
          animation: 'mist-drift 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          bottom: '5%', height: '20%',
          background: 'linear-gradient(to top, rgba(40,35,60,0.2), transparent)',
          filter: 'blur(20px)',
          transform: `translateY(${fgShift * 0.15}px)`,
        }}
      />

      {/* ===== CASTLE — detailed multi-layer SVG ===== */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: '4%',
          transform: `translateX(-50%) translateY(${fgShift * 0.12}px) scale(${cameraZoom * 0.96})`,
          transformOrigin: '50% 100%',
          width: 'min(560px, 85vw)',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.7))',
        }}
      >
        <svg viewBox="0 0 560 340" className="w-full">
          <defs>
            <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2540" />
              <stop offset="50%" stopColor="#1e1a32" />
              <stop offset="100%" stopColor="#15122a" />
            </linearGradient>
            <linearGradient id="stoneGradDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#221e38" />
              <stop offset="100%" stopColor="#12102a" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2240" />
              <stop offset="100%" stopColor="#1a1530" />
            </linearGradient>
            <radialGradient id="windowGlow" cx="0.5" cy="0.5">
              <stop offset="0%" stopColor="#ffe090" />
              <stop offset="50%" stopColor="#ffc966" />
              <stop offset="100%" stopColor="#cc8830" />
            </radialGradient>
          </defs>

          {/* Back wall / courtyard */}
          <rect x="100" y="140" width="360" height="180" fill="url(#stoneGradDark)" opacity="0.8" />

          {/* Main body */}
          <rect x="130" y="130" width="300" height="160" fill="url(#stoneGrad)" />
          {/* Stone texture lines */}
          {[150, 170, 190, 210, 230, 250, 270].map((y, i) => (
            <line key={`stone-h-${i}`} x1="130" y1={y} x2="430" y2={y} stroke="#15122a" strokeWidth="0.5" opacity="0.3" />
          ))}
          {[160, 200, 240, 280, 320, 360, 400].map((x, i) => (
            <line key={`stone-v-${i}`} x1={x} y1="130" x2={x} y2="290" stroke="#15122a" strokeWidth="0.3" opacity="0.2" />
          ))}

          {/* Left tower */}
          <rect x="80" y="80" width="55" height="210" fill="url(#stoneGrad)" />
          <path d="M74 80 L107 45 L140 80 Z" fill="url(#roofGrad)" />
          {/* Tower top details */}
          <rect x="78" y="76" width="59" height="6" fill="#1a1530" />
          {/* Right tower */}
          <rect x="425" y="80" width="55" height="210" fill="url(#stoneGrad)" />
          <path d="M419 80 L452 45 L485 80 Z" fill="url(#roofGrad)" />
          <rect x="423" y="76" width="59" height="6" fill="#1a1530" />

          {/* Center tower — tallest */}
          <rect x="240" y="45" width="70" height="245" fill="url(#stoneGrad)" />
          <path d="M234 45 L275 8 L316 45 Z" fill="url(#roofGrad)" />
          <rect x="238" y="41" width="74" height="6" fill="#1a1530" />
          {/* Tower peak flag */}
          <line x1="275" y1="8" x2="275" y2="0" stroke="#1a1530" strokeWidth="1" />
          <path d="M275 1 L283 4 L275 7 Z" fill="#2a2540" />

          {/* Battlements on main wall */}
          <g fill="#1a1530">
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={`bat-${i}`} x={130 + i * 30} y="125" width="14" height="8" />
            ))}
          </g>

          {/* Warm lit windows — many, varied, flickering */}
          {[
            [95, 120, 8, 14], [95, 155, 8, 14], [95, 190, 8, 14],
            [145, 150, 10, 16], [145, 185, 10, 16],
            [175, 150, 10, 16], [175, 185, 10, 16],
            [205, 150, 10, 16], [205, 185, 10, 16],
            [250, 75, 10, 16], [250, 110, 10, 16], [250, 145, 10, 16], [250, 180, 10, 16],
            [290, 75, 10, 16], [290, 110, 10, 16], [290, 145, 10, 16], [290, 180, 10, 16],
            [335, 150, 10, 16], [335, 185, 10, 16],
            [365, 150, 10, 16], [365, 185, 10, 16],
            [395, 150, 10, 16], [395, 185, 10, 16],
            [440, 120, 8, 14], [440, 155, 8, 14], [440, 190, 8, 14],
          ].map(([x, y, w, h], i) => (
            <g key={`win-${i}`}>
              <rect x={x} y={y} width={w} height={h} fill="url(#windowGlow)" opacity={0.6 + Math.sin(i * 1.7) * 0.25}
                style={{ animation: `flicker-warm ${2.5 + (i % 4)}s ease-in-out ${i * 0.2}s infinite` }} />
              {/* Window glow halo */}
              <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill="rgba(255,200,100,0.08)" style={{ animation: `flicker-warm ${3 + (i % 3)}s ease-in-out ${i * 0.15}s infinite` }} />
            </g>
          ))}

          {/* Large arched door */}
          <path d="M262 280 Q262 245 280 245 Q298 245 298 280 L298 300 L262 300 Z" fill="#08060e" />
          <path d="M265 280 Q265 248 280 248 Q295 248 295 280" fill="none" stroke="#1a1530" strokeWidth="1" />
          {/* Door warmth glow */}
          <ellipse cx="280" cy="290" rx="18" ry="8" fill="rgba(255,180,80,0.06)" />

          {/* Flying buttress / connecting wall */}
          <path d="M135 200 L100 230 L100 290 L135 290 Z" fill="url(#stoneGradDark)" opacity="0.6" />
          <path d="M425 200 L460 230 L460 290 L425 290 Z" fill="url(#stoneGradDark)" opacity="0.6" />
        </svg>
      </div>

      {/* ===== LIGHT RAYS from moon ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '10%', top: '5%',
          width: '200px', height: '60vh',
          background: 'linear-gradient(to bottom, rgba(240,235,210,0.08), transparent 60%)',
          filter: 'blur(15px)',
          transform: `translateY(${farShift * 0.2}px) rotate(-5deg)`,
          opacity: 0.7,
          animation: 'light-ray 8s ease-in-out infinite',
        }}
      />

      {/* ===== FLOATING MAGICAL PARTICLES (candles/wisps) ===== */}
      {Array.from({ length: 20 }).map((_, i) => {
        const px = 8 + (i * 4.5 + 3) % 84;
        const py = 15 + (i * 11) % 55;
        const sizeBoost = 3 + (i % 3);
        return (
          <div
            key={`float-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              width: `${sizeBoost}px`,
              height: `${sizeBoost}px`,
              background: 'rgba(255,200,100,0.9)',
              boxShadow: `0 0 ${sizeBoost * 3}px rgba(255,180,80,0.7), 0 0 ${sizeBoost * 6}px rgba(255,160,60,0.3)`,
              animation: `float-gentle ${3 + i % 4}s ease-in-out ${i * 0.3}s infinite`,
              transform: `translateY(${midShift * 0.4}px)`,
              opacity: 0.3 + range(p, 0.05, 0.3) * 0.4 + particleSpread * 0.3,
            }}
          />
        );
      })}

      {/* ===== HARRY FIGURE — cinematic illustration with wand ===== */}
      <div
        className="absolute"
        style={{
          left: '50%',
          bottom: '6%',
          transform: `translateX(-50%) translateY(${fgShift * 0.08}px) scale(1.1)`,
          opacity: wandAppear,
          filter: `blur(${(1 - wandAppear) * 12}px) drop-shadow(0 10px 25px rgba(0,0,0,0.7)) drop-shadow(0 0 15px rgba(100,80,40,${wandGlow * 0.2}))`,
        }}
      >
        <svg width="160" height="250" viewBox="0 0 160 250">
          <defs>
            <linearGradient id="hpRobe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12101e" />
              <stop offset="50%" stopColor="#0a0814" />
              <stop offset="100%" stopColor="#06050a" />
            </linearGradient>
            <linearGradient id="hpRobeFold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(40,35,60,0.3)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </linearGradient>
            <radialGradient id="hpSkin" cx="0.35" cy="0.3">
              <stop offset="0%" stopColor="#e0c8a0" />
              <stop offset="60%" stopColor="#c8a880" />
              <stop offset="100%" stopColor="#a08860" />
            </radialGradient>
            <linearGradient id="hpHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1518" />
              <stop offset="100%" stopColor="#0a0608" />
            </linearGradient>
            <linearGradient id="hpWandWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a5a3a" />
              <stop offset="50%" stopColor="#5a3a1a" />
              <stop offset="100%" stopColor="#3a2a10" />
            </linearGradient>
          </defs>

          {/* Robe — flowing with realistic folds */}
          <g style={{ animation: 'breathe 5s ease-in-out infinite', transformOrigin: '80px 130px' }}>
            <path d="M55 135 Q48 100 60 90 L100 90 Q112 100 105 135 L115 225 L45 225 Z" fill="url(#hpRobe)" />
            <path d="M55 135 Q48 100 60 90 L100 90 Q112 100 105 135 L115 225 L45 225 Z" fill="url(#hpRobeFold)" />
            {/* Robe fold shadows */}
            <path d="M72 95 Q68 130 72 200 L75 220 L77 220 L74 140 Q72 110 74 95" fill="#15122a" opacity="0.3" />
            <path d="M88 95 Q92 130 88 200 L85 220 L83 220 L86 140 Q88 110 86 95" fill="#15122a" opacity="0.2" />
            {/* Center fold */}
            <path d="M80 95 L80 220" fill="none" stroke="#15122a" strokeWidth="0.5" opacity="0.3" />
            {/* Robe hem detail */}
            <path d="M45 220 Q80 218 115 220" fill="none" stroke="#15122a" strokeWidth="1" />
          </g>

          {/* Shoulders */}
          <ellipse cx="80" cy="98" rx="25" ry="9" fill="#0a0814" />

          {/* Head — proportionate */}
          <circle cx="80" cy="72" r="20" fill="url(#hpSkin)" />
          {/* Face shadow — lit from wand side */}
          <ellipse cx="84" cy="75" rx="16" ry="18" fill="#a08860" opacity="0.3" />
          {/* Cheeks */}
          <circle cx="73" cy="76" r="3" fill="#c09060" opacity="0.15" />

          {/* Eyes — focused expression */}
          <ellipse cx="72" cy="70" rx="2.5" ry="3" fill="#2a3a2a" />
          <ellipse cx="88" cy="70" rx="2.5" ry="3" fill="#2a3a2a" />
          <circle cx="72.8" cy="69" r="0.8" fill="#ffffff" opacity="0.7" />
          <circle cx="88.8" cy="69" r="0.8" fill="#ffffff" opacity="0.7" />
          {/* Eyebrows — determined */}
          <path d="M68 65 Q72 63 76 65" fill="none" stroke="#3a2818" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M84 65 Q88 63 92 65" fill="none" stroke="#3a2818" strokeWidth="1.2" strokeLinecap="round" />
          {/* Nose */}
          <path d="M80 72 L78 79 L80 80 L82 79" fill="none" stroke="#a08860" strokeWidth="0.5" opacity="0.4" />
          {/* Mouth — slight concentration */}
          <path d="M76 84 Q80 85 84 84" fill="none" stroke="#8a6040" strokeWidth="0.8" strokeLinecap="round" />

          {/* Glasses — round, thin metal frame with reflections */}
          <circle cx="72" cy="70" r="7" fill="none" stroke="#c8a050" strokeWidth="1.2" opacity="0.7" />
          <circle cx="88" cy="70" r="7" fill="none" stroke="#c8a050" strokeWidth="1.2" opacity="0.7" />
          <line x1="79" y1="70" x2="81" y2="70" stroke="#c8a050" strokeWidth="0.8" opacity="0.6" />
          {/* Glass reflection — catches wand light */}
          <ellipse cx="70" cy="67" rx="2" ry="3" fill="#ffe090" opacity={0.15 + wandGlow * 0.3} />
          <ellipse cx="86" cy="67" rx="2" ry="3" fill="#ffe090" opacity={0.15 + wandGlow * 0.3} />

          {/* Lightning scar — subtle with glow */}
          <path d="M77 58 L80 63 L77 65 L79 69" stroke="#ffaa44" strokeWidth="1.3" fill="none" opacity="0.7"
            style={{ filter: `drop-shadow(0 0 ${3 + wandGlow * 5}px rgba(255,170,68,${0.4 + wandGlow * 0.3}))` }} />

          {/* Hair — messy, overlapping glasses */}
          <path d="M60 65 Q62 46 70 43 Q80 38 90 43 Q98 46 100 65 L98 70 Q94 56 80 52 Q66 56 62 70 Z" fill="url(#hpHair)" />
          {/* Hair strands */}
          <path d="M64 58 Q68 48 76 46" fill="none" stroke="#2a2028" strokeWidth="0.8" opacity="0.5" />
          <path d="M84 46 Q92 48 96 58" fill="none" stroke="#2a2028" strokeWidth="0.8" opacity="0.5" />
          <path d="M70 50 Q76 44 82 48" fill="none" stroke="#1a1518" strokeWidth="0.6" opacity="0.4" />

          {/* Arm raised with wand — natural pose */}
          <path d="M80 105 Q86 82 68 62" stroke="#0a0814" strokeWidth="13" fill="none" strokeLinecap="round" />
          {/* Sleeve highlight */}
          <path d="M80 105 Q84 85 72 68" stroke="#15122a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3" />
          {/* Hand */}
          <circle cx="68" cy="62" r="4" fill="url(#hpSkin)" />

          {/* Wand — detailed wood with grain and texture */}
          <line x1="68" y1="62" x2={wandTipX} y2={wandTipY} stroke="url(#hpWandWood)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Wand wood grain detail */}
          <line x1="68" y1="62" x2={wandTipX} y2={wandTipY} stroke="#8a6a3a" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          {/* Wand handle — wrapped leather texture */}
          <rect x="66" y="59" width="5" height="8" fill="#4a321a" rx="1" transform="rotate(-20 68 62)" />
          <line x1="66" y1="62" x2="71" y2="62" stroke="#3a2210" strokeWidth="0.4" transform="rotate(-20 68 62)" />
          <line x1="66" y1="64" x2="71" y2="64" stroke="#3a2210" strokeWidth="0.4" transform="rotate(-20 68 62)" />

          {/* Wand tip glow — growing with scroll */}
          <circle cx={wandTipX} cy={wandTipY} r={2 + wandGlow * 15} fill="#fff5cc" opacity={wandGlow}
            style={{ filter: `blur(${1 + wandGlow * 10}px)` }} />
          <circle cx={wandTipX} cy={wandTipY} r={1 + wandGlow * 6} fill="#ffffff" opacity={wandGlow}
            style={{ filter: `blur(${0.5 + wandGlow * 3}px)` }} />
        </svg>
      </div>

      {/* ===== GATHERING PARTICLES around wand tip ===== */}
      {gatherParticles > 0 && Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const gatherDist = (1 - gatherParticles) * 60 + 10;
        return (
          <div
            key={`gather-${i}`}
            className="absolute rounded-full"
            style={{
              left: `calc(50% + ${Math.cos(angle) * gatherDist * 0.3}px)`,
              top: `calc(94% + ${Math.sin(angle) * gatherDist * 0.2 - wandRise * 40}px)`,
              width: '2px', height: '2px',
              background: '#fff5cc',
              boxShadow: '0 0 6px rgba(255,220,140,0.8)',
              opacity: gatherParticles * 0.7,
              transform: `translate(${wandRise * 5 - 2.5}px, ${(0 - wandRise) * 30}px)`,
            }}
          />
        );
      })}

      {/* ===== WAND LIGHT FLASH BURST ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: flashBottom,
          transform: flashTransform,
          width: flashSize,
          height: flashSize,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,250,220,0.5) 0%, rgba(255,220,140,0.3) 20%, rgba(200,170,100,0.15) 50%, transparent 75%)',
          opacity: flashIntensity,
          filter: 'blur(12px)',
        }}
      />
      {/* Sharp flash core */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          bottom: flashBottom,
          transform: flashTransform,
          width: `${flashIntensity * 120}px`,
          height: `${flashIntensity * 120}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 60%)',
          opacity: flashIntensity * 0.8,
          filter: 'blur(4px)',
        }}
      />

      {/* ===== MAGICAL ENERGY BEAM shooting forward ===== */}
      {energyShoot > 0 && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            bottom: flashBottom,
            transform: flashTransform,
            opacity: energyShoot * clamp(1 - (p - 0.78) / 0.1),
          }}
        >
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${energyShoot * 8}px`,
              height: `${energyShoot * 400}px`,
              background: 'linear-gradient(to top, rgba(255,240,180,0.8), rgba(255,200,100,0.4) 50%, transparent)',
              filter: 'blur(6px)',
              borderRadius: '50%',
              transformOrigin: '50% 100%',
            }}
          />
        </div>
      )}

      {/* ===== SPREADING MAGICAL PARTICLES ===== */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const dist = particleSpread * (120 + (i % 5) * 50);
        const px = 50 + Math.cos(angle) * (dist / 12);
        const py = 55 - Math.sin(angle) * (dist / 15) + 10;
        const size = 2 + (i % 3);
        return (
          <div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: i % 3 === 0 ? '#fff5cc' : '#ffc966',
              boxShadow: `0 0 ${size * 2}px rgba(255,200,100,0.8), 0 0 ${size * 4}px rgba(255,180,80,0.4)`,
              opacity: particleSpread * clamp(1 - (p - 0.65) * 0.4),
              filter: 'blur(0.5px)',
              transition: 'all 0.2s ease-out',
            }}
          />
        );
      })}

      {/* ===== ENERGY WAVE OVERLAY ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: energyBg,
          opacity: energyWave,
        }}
      />

      {/* The phrase emerges with the spell and remains visible for reading. */}
      <p
        className="absolute top-[32%] left-1/2 z-10 w-full max-w-3xl px-10 text-center font-serif-c text-2xl italic leading-relaxed text-amber-50 sm:text-4xl md:text-5xl pointer-events-none"
        style={{
          opacity: quoteReveal,
          filter: 'blur(' + (1 - quoteReveal) * 8 + 'px)',
          transform: 'translateX(-50%) translateY(' + (1 - quoteReveal) * 18 + 'px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 28px rgba(255,200,100,0.35)',
        }}
      >
        Vriendschap en anderen helpen redden levens.
      </p>

      {/* ===== TITLE ===== */}
      <div
        className="absolute top-[11%] left-1/2 z-10 text-center w-full px-4"
        style={{
          opacity: titleOpacity,
          filter: `blur(${titleBlur}px)`,
          transform: `translateX(-50%) translateY(${titleY}px)`,
        }}
      >
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-amber-50 tracking-wide"
          style={{ textShadow: '0 0 40px rgba(255,200,100,0.4), 0 0 80px rgba(255,180,80,0.15)' }}
        >
          Harry Potter
        </h1>
        <p className="font-serif-c italic text-lg sm:text-xl md:text-2xl text-amber-200/60 mt-3 tracking-wide">
          J.K. Rowling
        </p>
      </div>

      <div className="absolute bottom-6 left-6 font-display text-white/15 text-sm tracking-widest z-10">
        02 / 04
      </div>
    </section>
  );
}
