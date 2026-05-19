import { FORGE } from '../theme'

const TIERS = [
  { min: 0,   color: null,           speed: 0,    base: 0,    peak: 0    },
  { min: 3,   color: FORGE.blueGlow, speed: 4000, base: 0.12, peak: 0.22 },
  { min: 7,   color: '#ff9a2a',      speed: 2600, base: 0.15, peak: 0.32 },
  { min: 30,  color: FORGE.fire,     speed: 1600, base: 0.22, peak: 0.45 },
  { min: 100, color: '#ff3300',      speed: 900,  base: 0.3,  peak: 0.6  },
]

function getTier(streak) {
  let tier = TIERS[0]
  for (const t of TIERS) { if (streak >= t.min) tier = t }
  return tier
}

const ANIM_CSS = `
  @keyframes ff-pulse { 0%,100%{opacity:var(--ffb)} 50%{opacity:var(--ffp)} }
  @keyframes ff-spark {
    0%   { transform:translateY(0) scale(1); opacity:.8 }
    100% { transform:translateY(-70px) scale(.15); opacity:0 }
  }
`

const SPARK_POS = [
  { left: '12%', dur: 900,  delay: 0   },
  { left: '24%', dur: 1100, delay: 180 },
  { left: '38%', dur: 950,  delay: 90  },
  { left: '54%', dur: 1050, delay: 270 },
  { left: '68%', dur: 850,  delay: 150 },
  { left: '80%', dur: 1000, delay: 60  },
]

export default function ForgeFlame({ streak = 0 }) {
  const tier = getTier(streak)
  if (!tier.color) return null

  const dur = tier.speed
  const glowStyle = (base, peak, width, height, bottom, left, right, extra = {}) => ({
    '--ffb': base,
    '--ffp': peak,
    position: 'absolute',
    width, height,
    bottom, left, right,
    borderRadius: '50%',
    animation: `ff-pulse ${dur}ms ease-in-out infinite`,
    pointerEvents: 'none',
    ...extra,
  })

  return (
    <>
      <style>{ANIM_CSS}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

        {/* Lueur centrale basse */}
        <div style={{
          ...glowStyle(tier.base, tier.peak, '130%', '55%', '-15%', '50%', undefined),
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse at center, ${tier.color}, transparent 65%)`,
        }} />

        {/* Lueur haute */}
        {streak >= 7 && (
          <div style={{
            ...glowStyle(tier.base * 0.5, tier.peak * 0.5, '90%', '35%', undefined, '50%', undefined, {
              top: '-8%',
              animationDirection: 'reverse',
              animationDuration: `${Math.round(dur * 1.4)}ms`,
            }),
            transform: 'translateX(-50%)',
            background: `radial-gradient(ellipse at center, ${tier.color}, transparent 65%)`,
          }} />
        )}

        {/* Lueurs latérales */}
        {streak >= 30 && (
          <>
            <div style={{
              ...glowStyle(tier.base * 0.4, tier.peak * 0.4, '55%', '45%', '5%', '-5%', undefined, {
                animationDuration: `${Math.round(dur * 0.75)}ms`,
              }),
              background: `radial-gradient(ellipse at center, ${FORGE.purple}, transparent 65%)`,
            }} />
            <div style={{
              ...glowStyle(tier.base * 0.4, tier.peak * 0.4, '55%', '45%', '5%', undefined, '-5%', {
                animationDirection: 'reverse',
                animationDuration: `${Math.round(dur * 1.2)}ms`,
              }),
              background: `radial-gradient(ellipse at center, ${tier.color}, transparent 65%)`,
            }} />
          </>
        )}

        {/* Particules montantes (streak 100+) */}
        {streak >= 100 && SPARK_POS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            borderRadius: '50%',
            background: tier.color,
            bottom: `${12 + (i * 6) % 20}%`,
            left: s.left,
            animation: `ff-spark ${s.dur}ms ease-out ${s.delay}ms infinite`,
            pointerEvents: 'none',
          }} />
        ))}

      </div>
    </>
  )
}
