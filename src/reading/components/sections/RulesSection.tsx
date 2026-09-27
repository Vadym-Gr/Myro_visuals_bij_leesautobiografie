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

export default function RulesSection() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const p = progress;

  // ===== TITLE =====
  const titleIn = clamp(p / 0.1);
  const titleOut = p > 0.85 ? clamp(1 - (p - 0.85) / 0.15) : 1;
  const titleOpacity = titleIn * titleOut;
  const titleBlur = (1 - titleIn) * 18;
  const titleY = (1 - titleIn) * 40;

  // ===== PARALLAX with subtle camera =====
  const cameraZoom = 1 + easeInOut(p) * 0.08;
  const bgShift = p * 25;
  const midShift = p * 55;
  const fgShift = p * 90;

  // ===== ANIMATION PHASES =====
  // 1. Person reads quietly (0 → 0.12)
  // 2. Thought cloud forms (0.12 → 0.30)
  // 3. Cloud rises slowly (0.25 → 0.50)
  // 4. Light particles gather in cloud (0.35 → 0.55)
  // 5. Lightbulb appears — small, dim (0.48 → 0.62)
  // 6. Bulb glows brighter (0.58 → 0.82)
  // 7. Warm glow halo expands (0.65 → 0.88)
  // 8. Idea particles orbit bulb (0.70 → 0.95)

  const cloudAppear = easeInOut(range(p, 0.12, 0.30));
  const cloudRise = easeInOut(range(p, 0.25, 0.50));
  const cloudParticles = range(p, 0.35, 0.55);
  const bulbAppear = range(p, 0.48, 0.62);
  const bulbBright = easeInOut(range(p, 0.58, 0.82));
  const glowHalo = range(p, 0.65, 0.88);
  const ideaParticles = range(p, 0.70, 0.95);
  const quoteReveal = easeInOut(range(p, 0.48, 0.74));

  // Head subtle movement while reading
  const headBob = Math.sin(p * 8) * 1.5;

  return (
    <section
      ref={ref}
      id="rules"
      className="relative h-screen w-full overflow-hidden vignette"
      style={{
        background: 'linear-gradient(to bottom, #2e2218 0%, #241a12 30%, #1e1510 60%, #18100a 100%)',
      }}
    >
      {/* ===== WARM AMBIENT ROOM LIGHT ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 55%, rgba(255,180,100,${0.08 + bulbBright * 0.18}) 0%, rgba(200,140,70,${0.04 + bulbBright * 0.08}) 30%, transparent 65%)`,
          transform: `translateY(${bgShift * 0.15}px) scale(${cameraZoom})`,
          transformOrigin: '50% 60%',
        }}
      />

      {/* ===== DEPTH-OF-FIELD BACKGROUND BLUR ===== */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${1 + p * 2}px)`,
          opacity: 0.3,
        }}
      />

      {/* ===== WINDOW — with moonlight and depth ===== */}
      <div
        className="absolute"
        style={{
          right: '10%', top: '12%', width: '140px', height: '180px',
          transform: `translateY(${bgShift * 0.25}px) scale(${cameraZoom * 0.98})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Window frame — wooden */}
        <div
          className="relative w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(200,180,120,0.15), rgba(160,140,90,0.08))',
            border: '5px solid #3a2a1a',
            borderRadius: '70px 70px 4px 4px',
            boxShadow: 'inset 0 0 40px rgba(255,200,120,0.08), 0 0 30px rgba(0,0,0,0.4)',
          }}
        >
          {/* Window cross frames */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-[#3a2a1a] -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-[#3a2a1a] -translate-y-1/2" />
          {/* Moonlight through window */}
          <div className="absolute inset-2 rounded-t-[60px]" style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(200,190,160,0.12), transparent 70%)',
          }} />
          {/* Distant sky through window */}
          <div className="absolute inset-2 rounded-t-[60px]" style={{
            background: 'linear-gradient(to bottom, rgba(40,35,50,0.3), rgba(30,25,35,0.2))',
          }} />
        </div>
        {/* Light ray from window */}
        <div
          className="absolute"
          style={{
            left: '-30px', top: '40px',
            width: '200px', height: '300px',
            background: 'linear-gradient(to left, rgba(200,180,120,0.06), transparent 70%)',
            filter: 'blur(15px)',
            transform: 'rotate(15deg)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ===== BOOKSHELVES — with depth of field ===== */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '24%', transform: `translateY(${bgShift * 0.2}px) scale(${cameraZoom})`, transformOrigin: '0% 50%', filter: `blur(${1 + p * 1.5}px)` }}
      >
        <Bookshelf rows={7} />
      </div>
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{ width: '24%', transform: `translateY(${bgShift * 0.2}px) scale(${cameraZoom})`, transformOrigin: '100% 50%', filter: `blur(${1 + p * 1.5}px)` }}
      >
        <Bookshelf rows={7} />
      </div>

      {/* ===== DUST PARTICLES in light beam ===== */}
      {Array.from({ length: 18 }).map((_, i) => {
        const px = 55 + (i * 7 + 3) % 35;
        const py = 20 + (i * 13) % 60;
        const delay = (i * 0.7) % 6;
        return (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              width: '2px',
              height: '2px',
              background: 'rgba(255,220,160,0.6)',
              boxShadow: '0 0 3px rgba(255,200,140,0.4)',
              animation: `dust-float ${5 + i % 4}s ease-in-out ${delay}s infinite`,
              opacity: 0.4 + bulbBright * 0.3,
            }}
          />
        );
      })}

      {/* ===== DESK — detailed wood ===== */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: '4%',
          transform: `translateX(-50%) translateY(${fgShift * 0.08}px) scale(${cameraZoom * 0.98})`,
          transformOrigin: '50% 100%',
        }}
      >
        {/* Desk surface — wood grain */}
        <div
          className="relative"
          style={{
            width: 'min(400px, 75vw)',
            height: '14px',
            background: 'linear-gradient(to bottom, #7b5a3a 0%, #6b4a2a 40%, #5a3a1a 100%)',
            borderRadius: '4px',
            boxShadow: '0 6px 25px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,140,0.15)',
          }}
        >
          {/* Wood grain lines */}
          <div className="absolute left-4 right-4 h-px bg-[#8a6a4a]/30" style={{ top: '5px' }} />
          <div className="absolute left-8 right-8 h-px bg-[#8a6a4a]/20" style={{ top: '9px' }} />

          {/* Desk legs — with shading */}
          <div className="absolute -bottom-22 left-3 w-4 h-22 rounded-sm" style={{
            background: 'linear-gradient(to right, #5a3a1a, #4a2a0a, #3a1a08)',
          }} />
          <div className="absolute -bottom-22 right-3 w-4 h-22 rounded-sm" style={{
            background: 'linear-gradient(to right, #5a3a1a, #4a2a0a, #3a1a08)',
          }} />

          {/* ===== DESK LAMP — detailed ===== */}
          <div className="absolute" style={{ bottom: '14px', left: '12px' }}>
            <svg width="80" height="110" viewBox="0 0 80 110">
              <defs>
                <linearGradient id="lampGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3a2a1a" />
                  <stop offset="50%" stopColor="#5a4a2a" />
                  <stop offset="100%" stopColor="#3a2a1a" />
                </linearGradient>
                <radialGradient id="lampBulb" cx="0.5" cy="0.5">
                  <stop offset="0%" stopColor="#ffe090" />
                  <stop offset="100%" stopColor="#cc8830" />
                </radialGradient>
              </defs>
              {/* Base — weighted */}
              <ellipse cx="40" cy="105" rx="18" ry="5" fill="#2a1a0a" />
              <ellipse cx="40" cy="103" rx="16" ry="4" fill="url(#lampGrad)" />
              {/* Stem */}
              <line x1="40" y1="103" x2="40" y2="55" stroke="url(#lampGrad)" strokeWidth="4" />
              {/* Arm joint */}
              <circle cx="40" cy="55" r="3" fill="#3a2a1a" />
              {/* Arm — angled */}
              <line x1="40" y1="55" x2="62" y2="38" stroke="url(#lampGrad)" strokeWidth="3.5" />
              {/* Shade — conical metal */}
              <path d="M50 18 L72 18 L66 42 L56 42 Z" fill="url(#lampGrad)" />
              {/* Shade inner glow */}
              <path d="M52 20 L70 20 L65 40 L57 40 Z" fill="rgba(255,200,120,0.12)" />
              {/* Shade highlight */}
              <path d="M50 18 L55 18 L54 24 L51 22 Z" fill="rgba(255,220,160,0.15)" />
              {/* Light cone — volumetric */}
              <path d="M54 40 L68 40 L82 95 L40 95 Z" fill="rgba(255,200,120,0.06)" />
              <path d="M56 40 L66 40 L76 90 L46 90 Z" fill="rgba(255,200,120,0.04)" />
              {/* Bulb glow */}
              <circle cx="60" cy="40" r="5" fill="url(#lampBulb)" opacity="0.9" style={{ animation: 'flicker-warm 4s ease-in-out infinite' }} />
              <circle cx="60" cy="40" r="8" fill="rgba(255,200,120,0.15)" filter="blur(3px)" style={{ animation: 'flicker-warm 3s ease-in-out infinite' }} />
            </svg>
          </div>

          {/* ===== OPEN BOOK on desk ===== */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <svg width="70" height="25" viewBox="0 0 70 25">
              <defs>
                <linearGradient id="pageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0e8d4" />
                  <stop offset="100%" stopColor="#d8c8a8" />
                </linearGradient>
              </defs>
              {/* Book pages — curved */}
              <path d="M0 18 L0 8 Q17 2 35 8 Q53 2 70 8 L70 18 Q53 12 35 18 Q17 12 0 18 Z" fill="url(#pageGrad)" />
              {/* Spine */}
              <line x1="35" y1="8" x2="35" y2="18" stroke="#c8b890" strokeWidth="0.8" />
              {/* Text lines */}
              {[10, 12, 14].map((y, i) => (
                <g key={`line-${i}`}>
                  <line x1="5" y1={y} x2="30" y2={y} stroke="#b0a080" strokeWidth="0.4" opacity="0.5" />
                  <line x1="40" y1={y} x2="65" y2={y} stroke="#b0a080" strokeWidth="0.4" opacity="0.5" />
                </g>
              ))}
            </svg>
          </div>

          {/* Coffee cup — extra detail */}
          <div className="absolute" style={{ bottom: '2px', right: '20px' }}>
            <svg width="18" height="20" viewBox="0 0 18 20">
              <ellipse cx="9" cy="3" rx="7" ry="2" fill="#3a2a1a" />
              <path d="M2 3 Q2 16 9 18 Q16 16 16 3 Z" fill="#4a3a2a" />
              <ellipse cx="9" cy="3" rx="6" ry="1.5" fill="#2a1a0a" />
              {/* Handle */}
              <path d="M16 7 Q19 7 19 10 Q19 13 16 13" fill="none" stroke="#4a3a2a" strokeWidth="1.5" />
              {/* Steam */}
              <path d="M6 1 Q5 -2 7 -4 Q9 -2 8 1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" style={{ animation: 'smoke-rise 3s ease-in-out infinite' }} />
              <path d="M11 1 Q10 -2 12 -4 Q14 -2 13 1" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" style={{ animation: 'smoke-rise 3.5s ease-in-out 0.5s infinite' }} />
            </svg>
          </div>
        </div>
      </div>

      {/* ===== PERSON READING — cinematic illustration with natural movement ===== */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: '6%',
          transform: `translateX(-50%) translateY(${fgShift * 0.06}px) scale(${cameraZoom * 0.98})`,
          transformOrigin: '50% 100%',
        }}
      >
        <svg width="140" height="160" viewBox="0 0 140 160">
          <defs>
            <linearGradient id="rsSweater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3540" />
              <stop offset="50%" stopColor="#2a2530" />
              <stop offset="100%" stopColor="#1a1520" />
            </linearGradient>
            <linearGradient id="rsSweaterShade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,240,220,0.05)" />
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>
            <radialGradient id="rsSkin" cx="0.35" cy="0.3">
              <stop offset="0%" stopColor="#e0c0a0" />
              <stop offset="60%" stopColor="#c8a888" />
              <stop offset="100%" stopColor="#a08868" />
            </radialGradient>
            <linearGradient id="rsHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a3828" />
              <stop offset="100%" stopColor="#3a2818" />
            </linearGradient>
            <linearGradient id="rsWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a321a" />
              <stop offset="100%" stopColor="#2a1a0a" />
            </linearGradient>
          </defs>

          {/* Chair back — wooden with slats and grain */}
          <rect x="42" y="52" width="42" height="60" fill="url(#rsWood)" rx="6" />
          <rect x="46" y="56" width="2.5" height="52" fill="#2a1a08" opacity="0.5" />
          <rect x="54" y="56" width="2.5" height="52" fill="#2a1a08" opacity="0.5" />
          <rect x="62" y="56" width="2.5" height="52" fill="#2a1a08" opacity="0.5" />
          <rect x="70" y="56" width="2.5" height="52" fill="#2a1a08" opacity="0.5" />
          <rect x="78" y="56" width="2.5" height="52" fill="#2a1a08" opacity="0.5" />
          {/* Chair top rail */}
          <rect x="40" y="50" width="46" height="4" fill="#3a2210" rx="2" />

          {/* Body / sweater with breathing animation */}
          <g style={{ animation: 'breathe 4s ease-in-out infinite', transformOrigin: '63px 90px' }}>
            <ellipse cx="63" cy="92" rx="26" ry="30" fill="url(#rsSweater)" />
            <ellipse cx="63" cy="92" rx="26" ry="30" fill="url(#rsSweaterShade)" />
            {/* Sweater knit texture */}
            <path d="M42 82 Q63 79 84 82" fill="none" stroke="#2a2530" strokeWidth="0.5" opacity="0.3" />
            <path d="M40 95 Q63 92 86 95" fill="none" stroke="#2a2530" strokeWidth="0.5" opacity="0.3" />
            <path d="M42 108 Q63 105 84 108" fill="none" stroke="#2a2530" strokeWidth="0.5" opacity="0.3" />
            {/* Collar */}
            <path d="M52 62 Q63 64 74 62 L72 68 Q63 69 54 68 Z" fill="#1a1520" />
          </g>

          {/* Head — with subtle reading bob */}
          <g style={{ transform: `translateY(${headBob}px)`, transformOrigin: '63px 47px' }}>
            <circle cx="63" cy="46" r="17" fill="url(#rsSkin)" />
            {/* Face shadow — warm lamp light from left */}
            <ellipse cx="58" cy="48" rx="12" ry="14" fill="#d4a888" opacity="0.15" />
            <ellipse cx="68" cy="48" rx="12" ry="14" fill="#a08868" opacity="0.2" />
            {/* Warm light on face from lamp */}
            <ellipse cx="56" cy="44" rx="8" ry="10" fill="rgba(255,200,120,0.06)" />

            {/* Hair — styled with strand detail */}
            <path d="M47 44 Q49 24 63 20 Q77 24 79 44 L77 49 Q72 34 63 31 Q54 34 49 49 Z" fill="url(#rsHair)" />
            <path d="M49 42 Q53 28 63 25 Q73 28 77 42" fill="none" stroke="#5a4838" strokeWidth="0.6" opacity="0.4" />
            {/* Hair strands */}
            <path d="M52 38 Q56 28 62 26" fill="none" stroke="#5a4838" strokeWidth="0.5" opacity="0.3" />
            <path d="M64 26 Q70 28 74 38" fill="none" stroke="#5a4838" strokeWidth="0.5" opacity="0.3" />

            {/* Reading glasses — thin frame with light reflection */}
            <circle cx="57" cy="46" r="5" fill="none" stroke="rgba(200,180,120,0.4)" strokeWidth="1" />
            <circle cx="69" cy="46" r="5" fill="none" stroke="rgba(200,180,120,0.4)" strokeWidth="1" />
            <line x1="62" y1="46" x2="64" y2="46" stroke="rgba(200,180,120,0.3)" strokeWidth="0.8" />
            {/* Glass reflection from lamp */}
            <ellipse cx="55" cy="44" rx="1.5" ry="2.5" fill="rgba(255,220,140,0.15)" opacity={0.5 + bulbBright * 0.3} />

            {/* Eyes — focused, looking down at book */}
            <ellipse cx="57" cy="47" rx="1.5" ry="1.8" fill="#3a3530" opacity="0.7" />
            <ellipse cx="69" cy="47" rx="1.5" ry="1.8" fill="#3a3530" opacity="0.7" />

            {/* Nose */}
            <path d="M63 48 L62 53 L63 54 L64 53" fill="none" stroke="#a08868" strokeWidth="0.4" opacity="0.4" />
            {/* Mouth — subtle, content */}
            <path d="M60 57 Q63 58 66 57" fill="none" stroke="#8a6048" strokeWidth="0.6" strokeLinecap="round" />
          </g>

          {/* Arms holding book — natural relaxed pose */}
          <path d="M45 78 Q38 84 41 96" stroke="url(#rsSweater)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M81 78 Q88 84 85 96" stroke="url(#rsSweater)" strokeWidth="10" fill="none" strokeLinecap="round" />
          {/* Hands */}
          <circle cx="41" cy="96" r="3.5" fill="url(#rsSkin)" />
          <circle cx="85" cy="96" r="3.5" fill="url(#rsSkin)" />

          {/* Book in hands — open with page detail */}
          <g style={{ animation: 'page-turn 8s ease-in-out infinite', transformOrigin: '63px 86px' }}>
            <rect x="35" y="86" width="56" height="18" fill="#e8dcc8" rx="1" />
            <path d="M35 88 Q63 84 91 88 L91 90 Q63 86 35 90 Z" fill="#d8c8a8" />
            <line x1="63" y1="86" x2="63" y2="104" stroke="#c8b890" strokeWidth="0.7" />
            {/* Page text lines — left page */}
            {[90, 93, 96, 99].map((y, i) => (
              <line key={`bk-l-${i}`} x1="38" y1={y} x2="59" y2={y} stroke="#b0a080" strokeWidth="0.3" opacity="0.4 + (i % 2) * 0.1" />
            ))}
            {/* Page text lines — right page */}
            {[90, 93, 96, 99].map((y, i) => (
              <line key={`bk-r-${i}`} x1="67" y1={y} x2="88" y2={y} stroke="#b0a080" strokeWidth="0.3" opacity="0.4 + (i % 2) * 0.1" />
            ))}
            {/* Page curl shadow */}
            <path d="M35 86 L40 86 L38 104 L35 104 Z" fill="#c8b890" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* ===== THOUGHT CLOUD — with particles ===== */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: `${22 + cloudRise * 16}%`,
          transform: `translateX(-50%) translateY(${fgShift * 0.04}px)`,
          opacity: cloudAppear,
          filter: `blur(${(1 - cloudAppear) * 10}px)`,
        }}
      >
        <div className="relative" style={{ width: '140px', height: '80px' }}>
          {/* Cloud puffs — layered for volume */}
          <div className="absolute rounded-full" style={{ width: '55px', height: '55px', left: '0', top: '15px', background: 'radial-gradient(circle, rgba(255,240,220,0.15), rgba(200,180,160,0.05) 60%, transparent)', filter: 'blur(4px)' }} />
          <div className="absolute rounded-full" style={{ width: '65px', height: '65px', left: '35px', top: '5px', background: 'radial-gradient(circle, rgba(255,240,220,0.2), rgba(200,180,160,0.08) 60%, transparent)', filter: 'blur(4px)' }} />
          <div className="absolute rounded-full" style={{ width: '50px', height: '50px', left: '80px', top: '18px', background: 'radial-gradient(circle, rgba(255,240,220,0.15), transparent)', filter: 'blur(3px)' }} />
          <div className="absolute rounded-full" style={{ width: '40px', height: '40px', left: '25px', top: '35px', background: 'radial-gradient(circle, rgba(255,240,220,0.12), transparent)', filter: 'blur(2px)' }} />

          {/* Cloud particles — gathering light */}
          {cloudParticles > 0 && Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = cloudParticles * 35;
            return (
              <div
                key={`cp-${i}`}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${2 + (i % 2)}px`,
                  height: `${2 + (i % 2)}px`,
                  background: 'rgba(255,230,160,0.8)',
                  boxShadow: '0 0 6px rgba(255,200,120,0.6)',
                  transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist * 0.6}px)`,
                  opacity: cloudParticles * (0.5 + (i % 3) * 0.15),
                }}
              />
            );
          })}

          {/* Thought bubble trail */}
          <div className="absolute rounded-full" style={{ width: '8px', height: '8px', left: '50%', bottom: '-28px', transform: 'translateX(-50%)', background: 'rgba(255,240,220,0.1)', filter: 'blur(1.5px)' }} />
          <div className="absolute rounded-full" style={{ width: '12px', height: '12px', left: '50%', bottom: '-15px', transform: 'translateX(-50%)', background: 'rgba(255,240,220,0.12)', filter: 'blur(1.5px)' }} />
        </div>
      </div>

      {/* ===== LIGHTBULB — cinematic idea animation ===== */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: `${36 + cloudRise * 6}%`,
          transform: `translateX(-50%) translateY(${fgShift * 0.04}px) scale(${0.3 + bulbAppear * 0.8})`,
          opacity: bulbAppear,
        }}
      >
        {/* Expanding warm glow halo */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${100 + glowHalo * 180}px`,
            height: `${100 + glowHalo * 180}px`,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,220,120,${glowHalo * 0.35}) 0%, rgba(255,200,100,${glowHalo * 0.15}) 30%, transparent 70%)`,
            filter: 'blur(12px)',
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${60 + bulbBright * 60}px`,
            height: `${60 + bulbBright * 60}px`,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,240,180,${bulbBright * 0.4}), transparent 70%)`,
            filter: 'blur(6px)',
          }}
        />

        <svg width="55" height="78" viewBox="0 0 55 78">
          <defs>
            <radialGradient id="bulbGlass" cx="0.4" cy="0.35">
              <stop offset="0%" stopColor={bulbBright > 0.3 ? '#fff8dc' : '#4a4540'} />
              <stop offset="60%" stopColor={bulbBright > 0.3 ? '#ffe890' : '#3a3530'} />
              <stop offset="100%" stopColor={bulbBright > 0.3 ? '#ffc960' : '#2a2520'} />
            </radialGradient>
          </defs>

          {/* Bulb glass — shaped */}
          <path d="M27 5 Q42 5 44 24 Q46 38 32 46 L32 52 L22 52 L22 46 Q8 38 10 24 Q12 5 27 5 Z"
            fill="url(#bulbGlass)"
            opacity={0.7 + bulbBright * 0.3}
            style={{
              filter: bulbBright > 0.15
                ? `drop-shadow(0 0 ${bulbBright * 18}px rgba(255,220,120,${bulbBright * 0.8})) drop-shadow(0 0 ${bulbBright * 35}px rgba(255,200,100,${bulbBright * 0.4}))`
                : 'none',
            }}
          />

          {/* Glass highlight */}
          <ellipse cx="20" cy="16" rx="4" ry="8" fill="rgba(255,255,255,0.15)" opacity={bulbBright} />

          {/* Filament — glowing */}
          <path d="M18 28 Q22 22 27 28 Q32 34 37 28" stroke="#ffaa44" strokeWidth="1.8" fill="none" opacity={bulbBright}
            style={{ filter: bulbBright > 0.3 ? `drop-shadow(0 0 3px rgba(255,180,60,${bulbBright}))` : 'none' }} />
          {/* Filament supports */}
          <line x1="18" y1="28" x2="18" y2="38" stroke="#8a7a6a" strokeWidth="0.8" opacity="0.5" />
          <line x1="37" y1="28" x2="37" y2="38" stroke="#8a7a6a" strokeWidth="0.8" opacity="0.5" />

          {/* Screw base — metal detail */}
          <rect x="22" y="52" width="10" height="9" fill="#5a5a5a" rx="1" />
          <line x1="22" y1="55" x2="32" y2="55" stroke="#3a3a3a" strokeWidth="0.8" />
          <line x1="22" y1="58" x2="32" y2="58" stroke="#3a3a3a" strokeWidth="0.8" />
          {/* Metal highlight */}
          <line x1="23" y1="53" x2="23" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />

          {/* Bottom contact */}
          <circle cx="27" cy="63" r="3.5" fill="#4a4a4a" />
          <circle cx="26" cy="62" r="1" fill="rgba(255,255,255,0.1)" />
        </svg>

        {/* ===== IDEA PARTICLES orbiting the bulb ===== */}
        {ideaParticles > 0 && Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2 + p * 0.8;
          const dist = 25 + ideaParticles * 50 + (i % 3) * 12;
          const size = 2 + (i % 2);
          return (
            <div
              key={`ip-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%', top: '38%',
                width: `${size}px`,
                height: `${size}px`,
                background: i % 2 === 0 ? '#ffe8a0' : '#ffc966',
                boxShadow: `0 0 ${size * 3}px rgba(255,200,100,0.8), 0 0 ${size * 6}px rgba(255,180,80,0.4)`,
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist * 0.8}px)`,
                opacity: ideaParticles * (0.4 + Math.sin(i + p * 4) * 0.3),
                animation: `float-gentle ${2 + i % 2}s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* The phrase emerges with the lightbulb and stays visible for reading. */}
      <p
        className="absolute top-[32%] left-1/2 z-10 w-full max-w-3xl px-10 text-center font-serif-c text-2xl italic leading-relaxed text-amber-50 sm:text-4xl md:text-5xl pointer-events-none"
        style={{
          opacity: quoteReveal,
          filter: 'blur(' + (1 - quoteReveal) * 8 + 'px)',
          transform: 'translateX(-50%) translateY(' + (1 - quoteReveal) * 18 + 'px)',
          textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 28px rgba(255,200,120,0.35)',
        }}
      >
        Breng structuur in je leven en vind rust.
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
          className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-amber-50 tracking-wide"
          style={{ textShadow: '0 0 40px rgba(255,200,120,0.35), 0 0 80px rgba(255,180,80,0.12)' }}
        >
          De regels van alles
        </h1>
        <p className="font-serif-c italic text-lg sm:text-xl md:text-2xl text-amber-200/60 mt-3 tracking-wide">
          Richard Templar
        </p>
      </div>

      <div className="absolute bottom-6 left-6 font-display text-white/15 text-sm tracking-widest z-10">
        04 / 04
      </div>
    </section>
  );
}

function Bookshelf({ rows }: { rows: number }) {
  const bookColors = [
    '#8a3a2a', '#3a5a8a', '#5a8a3a', '#8a6a3a',
    '#6a3a6a', '#3a8a7a', '#8a5a3a', '#5a5a8a',
    '#7a4a2a', '#4a6a3a', '#6a5a3a', '#5a3a5a',
  ];
  const bookHeights = [35, 40, 38, 42, 36, 44, 39, 41];
  return (
    <div className="w-full h-full flex flex-col justify-start gap-0 pt-3 px-1">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={`row-${row}`} className="flex flex-col">
          {/* Shelf — wooden with depth */}
          <div className="h-1.5 w-full mb-0.5" style={{
            background: 'linear-gradient(to bottom, #4a3a2a, #3a2a1a, #2a1a0a)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }} />
          {/* Books — varied sizes and colors */}
          <div className="flex items-end gap-0.5 h-14 px-1" style={{ opacity: 0.65 + (row % 2) * 0.1 }}>
            {Array.from({ length: 14 }).map((_, b) => {
              const h = bookHeights[(b + row * 3) % bookHeights.length] + ((b * 3) % 8);
              const color = bookColors[(b + row * 3) % bookColors.length];
              const w = 5 + (b % 4) * 2;
              return (
                <div
                  key={`book-${row}-${b}`}
                  className="flex-shrink-0 relative"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    background: `linear-gradient(to right, ${color} 0%, ${color}dd 30%, ${color} 70%, ${color}aa 100%)`,
                    opacity: 0.6 + (b % 4) * 0.08,
                    borderRadius: '1px 1px 0 0',
                    boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.3), 1px 0 1px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Book spine detail — gold band */}
                  {b % 3 === 0 && (
                    <div className="absolute left-0 right-0 h-px" style={{ top: '30%', background: 'rgba(255,220,140,0.2)' }} />
                  )}
                  {b % 4 === 1 && (
                    <div className="absolute left-0 right-0 h-px" style={{ top: '60%', background: 'rgba(255,220,140,0.15)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
