import { useScrollProgress } from '@/hooks/useScrollProgress';

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

export default function ShadowsSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const p = progress;

  // ===== TITLE =====
  const titleIn = clamp(p / 0.1);
  const titleOut = p > 0.85 ? clamp(1 - (p - 0.85) / 0.15) : 1;
  const titleOpacity = titleIn * titleOut;
  const titleBlur = (1 - titleIn) * 18;
  const titleY = (1 - titleIn) * 40;

  // ===== CINEMATIC PARALLAX =====
  const cameraZoom = 1 + easeInOut(p) * 0.12;
  const farShift = p * 35;
  const midShift = p * 80;
  const nearShift = p * 140;
  const fgShift = p * 220;

  // ===== ANIMATION PHASES =====
  // 1. Quiet landscape (0 → 0.15)
  // 2. Camera moves toward lake (0.1 → 0.3)
  // 3. Marichka appears (0.15 → 0.32)
  // 4. Walks toward water (0.28 → 0.55)
  // 5. Falls into water (0.52 → 0.72)
  // 6. Water reaction / ripples (0.65 → 0.90)
  // 7. Water calms (0.85 → 1.0)

  const marichkaAppear = range(p, 0.15, 0.32);
  const walkProgress = easeInOut(range(p, 0.28, 0.55));
  const fallProgress = easeInOut(range(p, 0.52, 0.72));
  const rippleProgress = range(p, 0.65, 0.95);
  const waterCalm = range(p, 0.85, 1.0);
  const submerge = fallProgress;
  const quoteReveal = easeInOut(range(p, 0.52, 0.78));

  // Droplets from splash
  const splashIntensity = range(p, 0.58, 0.68) * clamp(1 - (p - 0.68) / 0.08);

  return (
    <section
      ref={ref}
      id="shadows"
      className="relative h-screen w-full overflow-hidden vignette"
      style={{
        background: 'linear-gradient(to bottom, #2a3a38 0%, #1e2e2c 25%, #1a2520 55%, #15201a 80%, #101808 100%)',
      }}
    >
      {/* ===== SKY / ATMOSPHERIC GRADIENT ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 20%, rgba(160,180,150,0.12), transparent 70%),
            linear-gradient(to bottom, rgba(180,200,170,0.08) 0%, transparent 35%)
          `,
          transform: `translateY(${farShift * 0.2}px) scale(${cameraZoom})`,
          transformOrigin: '50% 60%',
        }}
      />

      {/* ===== DRIFTING CLOUDS ===== */}
      <div
        className="absolute"
        style={{
          left: '5%', top: '8%', width: '200px', height: '40px',
          background: 'radial-gradient(ellipse, rgba(200,210,190,0.15), transparent 70%)',
          filter: 'blur(15px)',
          animation: 'mist-drift 20s ease-in-out infinite',
          transform: `translateY(${farShift * 0.3}px)`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '50%', top: '12%', width: '250px', height: '35px',
          background: 'radial-gradient(ellipse, rgba(190,200,180,0.1), transparent 70%)',
          filter: 'blur(12px)',
          animation: 'mist-drift 25s ease-in-out 3s infinite',
          transform: `translateY(${farShift * 0.25}px)`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '70%', top: '6%', width: '180px', height: '30px',
          background: 'radial-gradient(ellipse, rgba(180,195,175,0.08), transparent 70%)',
          filter: 'blur(10px)',
          animation: 'mist-drift 18s ease-in-out 1s infinite',
          transform: `translateY(${farShift * 0.35}px)`,
        }}
      />

      {/* ===== CARPATHIAN MOUNTAINS — multi-layer with atmospheric perspective ===== */}
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ height: '58%', transform: `translateY(${farShift * 0.15}px) scale(${cameraZoom})`, transformOrigin: '50% 60%' }}
        viewBox="0 0 1200 550"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5a50" />
            <stop offset="100%" stopColor="#3a4a40" />
          </linearGradient>
          <linearGradient id="mtnMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4a38" />
            <stop offset="100%" stopColor="#2a3a28" />
          </linearGradient>
          <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3a28" />
            <stop offset="100%" stopColor="#1a2a18" />
          </linearGradient>
          {/* Snow caps */}
          <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(220,230,210,0.4)" />
            <stop offset="100%" stopColor="rgba(180,200,180,0.1)" />
          </linearGradient>
        </defs>

        {/* Furthest mountains — atmospheric haze */}
        <path d="M0 380 L0 260 L60 220 L140 250 L240 170 L340 220 L460 140 L580 200 L720 150 L860 210 L980 180 L1100 220 L1200 200 L1200 380 Z" fill="url(#mtnFar)" opacity="0.45" />
        {/* Snow caps on far peaks */}
        <path d="M240 170 L260 185 L280 175 L240 170 Z M460 140 L485 160 L510 150 L460 140 Z M720 150 L745 170 L770 160 L720 150 Z" fill="url(#snow)" opacity="0.5" />

        {/* Mid mountains */}
        <path d="M0 400 L0 310 L90 260 L210 300 L360 220 L500 280 L650 200 L800 260 L950 230 L1100 270 L1200 250 L1200 400 Z" fill="url(#mtnMid)" opacity="0.65" />
        {/* Mid snow */}
        <path d="M360 220 L380 240 L405 230 L360 220 Z M650 200 L675 220 L700 210 L650 200 Z" fill="url(#snow)" opacity="0.35" />

        {/* Closer mountains — darker, more defined */}
        <path d="M0 440 L0 370 L110 320 L260 360 L410 280 L560 340 L710 270 L860 320 L1010 300 L1200 340 L1200 440 Z" fill="url(#mtnNear)" opacity="0.85" />
        {/* Ridge highlights */}
        <path d="M110 320 L130 335 L260 360 L410 280 L430 300 L560 340" fill="none" stroke="rgba(200,215,190,0.08)" strokeWidth="1" />
      </svg>

      {/* ===== FOREST — dense tree line with individual trees ===== */}
      <svg
        className="absolute left-0 w-full"
        style={{ top: '36%', height: '16%', transform: `translateY(${midShift * 0.25}px) scale(${cameraZoom * 0.98})`, transformOrigin: '50% 100%' }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Far tree line */}
        <path d="M0 120 L0 70 Q15 50 30 65 Q45 45 60 60 Q75 40 90 55 Q105 45 120 58 Q135 38 150 52 Q165 45 180 56 Q195 35 210 50 Q225 42 240 55 Q255 32 270 48 Q285 45 300 55 Q315 35 330 50 Q345 42 360 54 Q375 32 390 48 Q405 40 420 53 Q435 30 450 46 Q465 40 480 52 Q495 32 510 48 Q525 40 540 54 Q555 30 570 46 Q585 38 600 52 Q615 35 630 50 Q645 40 660 52 Q675 32 690 48 Q705 40 720 52 Q735 30 750 46 Q765 38 780 52 Q795 35 810 50 Q825 42 840 54 Q855 32 870 48 Q885 40 900 52 Q915 35 930 50 Q945 42 960 54 Q975 30 990 46 Q1005 38 1020 52 Q1035 35 1050 50 Q1065 42 1080 54 Q1095 30 1110 46 Q1125 38 1140 52 Q1155 35 1170 50 Q1185 42 1200 54 L1200 120 Z"
          fill="#1a2a18" opacity="0.85" />
        {/* Individual tree shapes — darker front row */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = i * 42 + (i % 3) * 5;
          const h = 40 + (i % 4) * 12;
          return (
            <path
              key={`tree-${i}`}
              d={`M${x} 120 L${x} ${120 - h} Q${x - 8} ${120 - h + 5} ${x - 12} ${120 - h + 15} Q${x - 6} ${120 - h + 10} ${x} ${120 - h + 18} Q${x + 6} ${120 - h + 10} ${x + 12} ${120 - h + 15} Q${x + 8} ${120 - h + 5} ${x} ${120 - h} Z`}
              fill="#0e1a0c"
              opacity={0.7 + (i % 3) * 0.1}
              style={{ animation: `sway ${4 + i % 3}s ease-in-out ${i * 0.2}s infinite`, transformOrigin: `${x}px 120px` }}
            />
          );
        })}
      </svg>

      {/* ===== VILLAGE — wooden houses with detail ===== */}
      <div
        className="absolute left-0 right-0"
        style={{ top: '40%', transform: `translateY(${midShift * 0.35}px) scale(${cameraZoom * 0.97})`, transformOrigin: '50% 100%', height: '10%' }}
      >
        <div className="relative w-full h-full max-w-4xl mx-auto px-4">
          {[
            { left: '8%', w: 55, roofColor: '#5a3a2a', wallColor: '#7b5a3a' },
            { left: '22%', w: 45, roofColor: '#4a2a1a', wallColor: '#6b4a2a' },
            { left: '58%', w: 50, roofColor: '#5a3a2a', wallColor: '#7b5a3a' },
            { left: '75%', w: 60, roofColor: '#4a2a1a', wallColor: '#6b4a2a' },
          ].map((h, i) => (
            <div key={`house-${i}`} className="absolute bottom-0" style={{ left: h.left, width: h.w }}>
              {/* Roof — angled with shading */}
              <div className="absolute -top-5 left-0 right-0 h-0" style={{
                borderLeft: `${h.w / 2}px solid transparent`,
                borderRight: `${h.w / 2}px solid transparent`,
                borderBottom: `18px solid ${h.roofColor}`,
              }} />
              {/* Roof highlight */}
              <div className="absolute -top-4 left-1 right-1 h-0" style={{
                borderLeft: `${h.w / 2 - 2}px solid transparent`,
                borderRight: `${h.w / 2 - 2}px solid transparent`,
                borderBottom: `14px solid rgba(255,220,180,0.08)`,
              }} />
              {/* Wall — wooden texture */}
              <div className="h-9 w-full relative" style={{ background: h.wallColor, opacity: 0.85, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {/* Wood plank lines */}
                <div className="absolute left-0 right-0 h-px bg-black/20" style={{ top: '30%' }} />
                <div className="absolute left-0 right-0 h-px bg-black/20" style={{ top: '65%' }} />
                {/* Window glow */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm" style={{
                  background: 'rgba(255,200,100,0.7)',
                  boxShadow: '0 0 8px rgba(255,180,80,0.4)',
                  animation: `flicker-warm ${3 + i}s ease-in-out ${i * 0.5}s infinite`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== GRASS / FOREGROUND HILL ===== */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '15%', transform: `translateY(${fgShift * 0.1}px)` }}
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path d="M0 100 L0 50 Q200 35 400 45 Q600 55 800 40 Q1000 30 1200 45 L1200 100 Z" fill="#1a2a14" opacity="0.9" />
        <path d="M0 100 L0 65 Q200 50 400 58 Q600 68 800 55 Q1000 45 1200 58 L1200 100 Z" fill="#15200e" opacity="0.7" />
      </svg>

      {/* ===== LAKE — with reflections, shimmer, and depth ===== */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '34%', overflow: 'hidden' }}
      >
        {/* Water gradient — deep to shallow */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #2a4a50 0%, #1a3540 30%, #102530 60%, #081820 100%)',
        }} />

        {/* Mountain reflections — blurred and inverted */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '70%',
            background: `
              radial-gradient(ellipse 30% 100% at 28% 0%, rgba(60,75,60,0.25), transparent 70%),
              radial-gradient(ellipse 25% 100% at 50% 0%, rgba(50,65,50,0.2), transparent 70%),
              radial-gradient(ellipse 30% 100% at 72% 0%, rgba(55,70,55,0.22), transparent 70%)
            `,
            transform: 'scaleY(-1)',
            filter: 'blur(4px)',
            opacity: 0.6,
          }}
        />

        {/* Sky reflection gradient */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(160,180,150,0.08), transparent)',
          }}
        />

        {/* Water surface line — shimmering */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(200,220,200,0.4) 30%, rgba(200,220,200,0.5) 50%, rgba(200,220,200,0.4) 70%, transparent)',
            animation: 'water-shimmer 4s ease-in-out infinite',
          }}
        />

        {/* Water surface ripples — subtle horizontal lines */}
        {[8, 18, 30, 45, 60, 75].map((y, i) => (
          <div
            key={`water-line-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${y}%`,
              background: `linear-gradient(to right, transparent, rgba(200,220,200,${0.04 + (i % 2) * 0.03}), transparent)`,
              opacity: 0.6 - i * 0.08,
              animation: `water-shimmer ${3 + i}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}

        {/* ===== RIPPLES from Marichka falling ===== */}
        {[0, 0.15, 0.3, 0.5, 0.7].map((delay, i) => {
          const localRipple = clamp((rippleProgress - delay) * 2.5);
          if (localRipple <= 0) return null;
          const rippleOpacity = (1 - localRipple) * 0.5 * (1 - waterCalm * 0.5);
          return (
            <div
              key={`ripple-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '12%',
                width: `${15 + localRipple * 250}px`,
                height: `${6 + localRipple * 90}px`,
                border: `${2 - localRipple}px solid rgba(200,225,200,${rippleOpacity})`,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                boxShadow: `0 0 ${10 * (1 - localRipple)}px rgba(200,220,200,${rippleOpacity * 0.3})`,
              }}
            />
          );
        })}

        {/* Secondary smaller ripples */}
        {[0.1, 0.35, 0.6].map((delay, i) => {
          const localRipple = clamp((rippleProgress - delay) * 3);
          if (localRipple <= 0) return null;
          return (
            <div
              key={`ripple-sm-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${45 + i * 8}%`,
                top: `${15 + i * 5}%`,
                width: `${8 + localRipple * 100}px`,
                height: `${3 + localRipple * 35}px`,
                border: `1px solid rgba(200,225,200,${(1 - localRipple) * 0.3})`,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
              }}
            />
          );
        })}

        {/* Mist on water */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '35%',
            background: 'linear-gradient(to bottom, rgba(180,195,175,0.1), transparent)',
            filter: 'blur(10px)',
            animation: 'mist-drift 15s ease-in-out infinite',
          }}
        />
      </div>

      {/* ===== MARIСHKA — cinematic illustration with traditional dress ===== */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '52%',
          transform: `translateX(-50%) translateY(${walkProgress * 85 + submerge * 70}px) translateZ(0)`,
          opacity: marichkaAppear * (1 - submerge * 0.95),
          filter: `blur(${(1 - marichkaAppear) * 12 + submerge * 10}px) drop-shadow(0 5px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 15px rgba(200,180,150,0.1))`,
        }}
      >
        <svg width="65" height="105" viewBox="0 0 65 105">
          <defs>
            <linearGradient id="marichkaDress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d44a6a" />
              <stop offset="50%" stopColor="#c43858" />
              <stop offset="100%" stopColor="#a8304a" />
            </linearGradient>
            <linearGradient id="marichkaDressShade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,200,180,0.1)" />
              <stop offset="40%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>
            <radialGradient id="marichkaSkin" cx="0.35" cy="0.3">
              <stop offset="0%" stopColor="#f0d0a8" />
              <stop offset="60%" stopColor="#e0c090" />
              <stop offset="100%" stopColor="#c8a070" />
            </radialGradient>
            <linearGradient id="marichkaHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a3a1a" />
              <stop offset="50%" stopColor="#4a2a10" />
              <stop offset="100%" stopColor="#3a2008" />
            </linearGradient>
            <radialGradient id="marichkaGlow" cx="0.5" cy="0.3">
              <stop offset="0%" stopColor="rgba(255,220,180,0.12)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Soft character glow */}
          <ellipse cx="32" cy="40" rx="28" ry="50" fill="url(#marichkaGlow)" />

          {/* Dress — flowing with realistic folds */}
          <g style={{ animation: 'breathe 4.5s ease-in-out infinite', transformOrigin: '32px 50px' }}>
            <path d="M20 42 Q32 38 44 42 L48 88 L16 88 Z" fill="url(#marichkaDress)" opacity="0.92" />
            <path d="M20 42 Q32 38 44 42 L48 88 L16 88 Z" fill="url(#marichkaDressShade)" opacity="0.5" />
            {/* Dress fold shadows */}
            <path d="M28 44 Q27 65 28 85" fill="none" stroke="#a8304a" strokeWidth="0.6" opacity="0.4" />
            <path d="M36 44 Q37 65 36 85" fill="none" stroke="#a8304a" strokeWidth="0.5" opacity="0.3" />
            {/* Dress embroidery — traditional Ukrainian patterns */}
            <path d="M18 54 Q32 52 46 54 L47 62 Q32 60 17 62 Z" fill="rgba(255,240,200,0.15)" />
            {/* Cross-stitch pattern */}
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={`emb-${i}`} d={`M${22 + i * 4} 56 L${24 + i * 4} 58 L${22 + i * 4} 60 L${20 + i * 4} 58 Z`} fill="rgba(255,240,200,0.2)" />
            ))}
            <path d="M17 70 Q32 68 47 70 L48 77 Q32 75 16 77 Z" fill="rgba(255,240,200,0.1)" />
            {/* Decorative belt */}
            <path d="M18 40 Q32 38 46 40 L46 44 Q32 42 18 44 Z" fill="#8a3020" opacity="0.7" />
          </g>

          {/* Head — proportionate */}
          <circle cx="32" cy="26" r="11" fill="url(#marichkaSkin)" />
          {/* Face shadow — lit from upper left */}
          <ellipse cx="36" cy="28" rx="9" ry="10" fill="#c8a070" opacity="0.25" />
          {/* Cheeks — natural warmth */}
          <circle cx="26" cy="28" r="2.5" fill="#e8a080" opacity="0.2" />
          <circle cx="37" cy="28" r="2.5" fill="#e8a080" opacity="0.15" />
          {/* Eyes — gentle, expressive */}
          <ellipse cx="28" cy="25" rx="1.8" ry="2.5" fill="#3a5a4a" />
          <ellipse cx="36" cy="25" rx="1.8" ry="2.5" fill="#3a5a4a" />
          <circle cx="28.5" cy="24" r="0.6" fill="#ffffff" opacity="0.7" />
          <circle cx="36.5" cy="24" r="0.6" fill="#ffffff" opacity="0.7" />
          {/* Eyebrows — delicate */}
          <path d="M25 22 Q28 21 31 22" fill="none" stroke="#4a2a1a" strokeWidth="0.7" strokeLinecap="round" />
          <path d="M33 22 Q36 21 39 22" fill="none" stroke="#4a2a1a" strokeWidth="0.7" strokeLinecap="round" />
          {/* Nose */}
          <path d="M32 27 L31 31 L32 31.5 L33 31" fill="none" stroke="#c8a070" strokeWidth="0.4" opacity="0.4" />
          {/* Mouth — soft */}
          <path d="M29 34 Q32 35 35 34" fill="none" stroke="#a06050" strokeWidth="0.7" strokeLinecap="round" />

          {/* Hair — long, flowing with wind animation */}
          <g style={{ animation: 'hair-sway 4s ease-in-out infinite', transformOrigin: '32px 14px' }}>
            <path d="M18 24 Q20 8 32 5 Q44 8 46 24 L44 45 Q40 32 32 30 Q24 32 20 45 Z" fill="url(#marichkaHair)" opacity="0.92" />
            {/* Hair strand detail */}
            <path d="M20 22 Q24 10 32 8 Q40 10 44 22" fill="none" stroke="#6a4a2a" strokeWidth="0.6" opacity="0.4" />
            {/* Long flowing hair down */}
            <path d="M20 32 Q16 50 14 62 L17 62 Q18 50 22 38" fill="url(#marichkaHair)" opacity="0.75" />
            <path d="M44 32 Q48 50 50 62 L47 62 Q46 50 42 38" fill="url(#marichkaHair)" opacity="0.75" />
            {/* Hair highlights */}
            <path d="M22 28 Q24 16 30 12" fill="none" stroke="#6a4a2a" strokeWidth="0.5" opacity="0.3" />
          </g>

          {/* Flower wreath — traditional vinok with detailed flowers */}
          <circle cx="22" cy="10" r="3" fill="#fff0a0" opacity="0.85" />
          <circle cx="22" cy="10" r="1.5" fill="#ffe060" opacity="0.6" />
          <circle cx="27" cy="7" r="2.5" fill="#ffb0c0" opacity="0.85" />
          <circle cx="27" cy="7" r="1" fill="#ff90a0" opacity="0.6" />
          <circle cx="32" cy="5.5" r="3" fill="#fff0a0" opacity="0.85" />
          <circle cx="32" cy="5.5" r="1.5" fill="#ffe060" opacity="0.6" />
          <circle cx="38" cy="7" r="2.5" fill="#ffb0c0" opacity="0.85" />
          <circle cx="38" cy="7" r="1" fill="#ff90a0" opacity="0.6" />
          <circle cx="42" cy="10" r="2" fill="#b0e0a0" opacity="0.7" />
          {/* Wreath base — green leaves */}
          <path d="M18 12 Q32 4 46 12" fill="none" stroke="#3a6a2a" strokeWidth="1.5" opacity="0.4" />

          {/* Arms — natural, graceful pose */}
          <path d="M21 44 Q15 52 13 60" stroke="url(#marichkaSkin)" strokeWidth="4" strokeLinecap="round" opacity="0.88" />
          <path d="M43 44 Q49 52 51 60" stroke="url(#marichkaSkin)" strokeWidth="4" strokeLinecap="round" opacity="0.88" />
          {/* Fingertips */}
          <circle cx="13" cy="60" r="2" fill="url(#marichkaSkin)" opacity="0.8" />
          <circle cx="51" cy="60" r="2" fill="url(#marichkaSkin)" opacity="0.8" />

          {/* Flowing ribbons from wreath */}
          <path d="M22 10 Q18 18 16 28" fill="none" stroke="#ffb0c0" strokeWidth="0.8" opacity="0.5" style={{ animation: 'scarf-wave 3s ease-in-out infinite' }} />
          <path d="M42 10 Q46 18 48 28" fill="none" stroke="#fff0a0" strokeWidth="0.8" opacity="0.4" style={{ animation: 'scarf-wave 3.5s ease-in-out 0.5s infinite' }} />
        </svg>
      </div>

      {/* ===== SPLASH DROPLETS ===== */}
      {splashIntensity > 0 && Array.from({ length: 12 }).map((_, i) => {
        const angle = -Math.PI / 2 + (i - 6) * 0.25;
        const dist = splashIntensity * (30 + (i % 4) * 15);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <div
            key={`drop-${i}`}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '63%',
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: 'rgba(200,225,210,0.7)',
              boxShadow: '0 0 4px rgba(200,220,200,0.5)',
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
              opacity: splashIntensity,
            }}
          />
        );
      })}

      {/* ===== SPLASH EFFECT — water impact ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '63%',
          transform: `translate(-50%, -50%) scale(${fallProgress * 1.8})`,
          opacity: fallProgress * clamp(1 - rippleProgress * 0.6),
        }}
      >
        <svg width="100" height="50" viewBox="0 0 100 50">
          {/* Splash crown */}
          <path d="M15 35 Q25 15 35 30 Q45 8 50 25 Q55 8 65 30 Q75 15 85 35" stroke="rgba(200,225,210,0.6)" strokeWidth="2.5" fill="none" />
          {/* Inner splash */}
          <path d="M20 35 Q30 22 40 32 Q50 18 60 32 Q70 22 80 35" stroke="rgba(200,225,210,0.4)" strokeWidth="1.5" fill="none" />
          {/* Droplets */}
          <circle cx="25" cy="18" r="2.5" fill="rgba(200,225,210,0.5)" />
          <circle cx="50" cy="12" r="3" fill="rgba(200,225,210,0.5)" />
          <circle cx="75" cy="18" r="2.5" fill="rgba(200,225,210,0.5)" />
          <circle cx="35" cy="8" r="1.5" fill="rgba(200,225,210,0.4)" />
          <circle cx="65" cy="8" r="1.5" fill="rgba(200,225,210,0.4)" />
        </svg>
      </div>

      {/* ===== SOFT NATURAL LIGHT ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 40% 25%, rgba(220,200,160,${0.12 - p * 0.04}), transparent 65%)`,
        }}
      />

      {/* Atmospheric depth haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 30%, rgba(150,170,140,0.06) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* The phrase slowly appears as the scene unfolds, then stays readable. */}
      <p
        className="absolute top-[38%] left-1/2 z-10 w-full max-w-3xl px-10 text-center font-serif-c text-2xl italic leading-relaxed text-emerald-50 sm:text-4xl md:text-5xl pointer-events-none"
        style={{
          opacity: quoteReveal,
          filter: 'blur(' + (1 - quoteReveal) * 8 + 'px)',
          transform: 'translateX(-50%) translateY(' + (1 - quoteReveal) * 18 + 'px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 28px rgba(150,200,170,0.35)',
        }}
      >
        Laat het verleden achter je.
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
          className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-emerald-50 tracking-wide"
          style={{ textShadow: '0 0 40px rgba(150,200,170,0.35), 0 0 80px rgba(100,170,140,0.12)' }}
        >
          Schaduwen van vergeten voorouders
        </h1>
        <p className="font-serif-c italic text-lg sm:text-xl md:text-2xl text-emerald-200/60 mt-3 tracking-wide">
          Mychajlo Kotsjoebynsky
        </p>
      </div>

      <div className="absolute bottom-6 left-6 font-display text-white/15 text-sm tracking-widest z-10">
        03 / 04
      </div>
    </section>
  );
}
