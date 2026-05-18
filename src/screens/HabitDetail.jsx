import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import Gesture from '../components/Gesture'

const JOURNAL = [
  { d: "Aujourd'hui · 08:12", v: '10 min', note: 'matin calme', xp: 30 },
  { d: 'Hier · 07:48',        v: '12 min', xp: 30 },
  { d: 'Sam 16 · 09:30',      v: '10 min', xp: 30 },
]

export default function HabitDetail() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 60% 30% at 50% 0%, ${FORGE.cyan}22, transparent)` }} />
      <Status dark />

      {/* App bar */}
      <div style={{ padding: '2px 14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={() => navigate(-1)} style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16, cursor: 'pointer' }}>←</span>
          <ForgeTag color={FORGE.cyan}>Mental · 10 min</ForgeTag>
        </div>
        <span style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16 }}>⋯</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${FORGE.cyan}, ${FORGE.blueGlow})`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: `0 0 22px ${FORGE.cyan}77, inset 0 0 0 1px rgba(255,255,255,0.18)`, flexShrink: 0 }}>☾</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FORGE.sans, fontSize: 26, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.5, lineHeight: 1.05 }}>Méditation</div>
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, marginTop: 3 }}>quotidien · 08:00 · niveau habit <span style={{ color: FORGE.cyan, fontWeight: 600 }}>5</span></div>
          </div>
        </div>

        {/* Habit level */}
        <ForgeBox accent={FORGE.cyan} pad={10}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.cyan}>Habit Level 5 → 6</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>23 / 30 séances</span>
          </div>
          <div style={{ marginTop: 8 }}><ForgeGauge value={23 / 30} color={FORGE.cyan} segments height={8} /></div>
          <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint, letterSpacing: 0.5 }}>Reward: badge « Marathon mental »</div>
        </ForgeBox>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Série',  v: '23', sub: 'jours',   c: FORGE.fire,  glow: FORGE.fireGlow, prefix: '🔥' },
            { k: 'Record', v: '34', sub: 'jours',   c: FORGE.fg },
            { k: 'Total',  v: '186', sub: 'séances', c: FORGE.cyan,  glow: FORGE.cyan },
          ].map((s) => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.k}</div>
              <div style={{ marginTop: 6, fontFamily: FORGE.sans, fontSize: 24, fontWeight: 700, color: s.c, letterSpacing: -0.8, lineHeight: 1, textShadow: s.glow ? `0 0 12px ${s.glow}cc` : 'none' }}>
                {s.prefix && <span style={{ fontSize: 14, marginRight: 2 }}>{s.prefix}</span>}{s.v}
              </div>
              <div style={{ marginTop: 2, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgDim }}>{s.sub}</div>
            </ForgeBox>
          ))}
        </div>

        {/* Heatmap */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>365 jours</span>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>312 actives · <span style={{ color: FORGE.cyan }}>86%</span></span>
        </div>
        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflowX: 'auto' }}>
            {Array.from({ length: 7 }, (_, r) => (
              <div key={r} style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 26 }, (_, c) => {
                  const seed = (r * 13 + c * 7 + 3) % 11
                  const empty = c >= 24 && r >= 5
                  const v = empty ? 0 : (seed < 2 ? 0 : Math.min(4, Math.floor(seed / 2)))
                  return (
                    <div key={c} style={{ width: 9, height: 9, borderRadius: 1.5, background: v === 0 ? 'rgba(255,255,255,0.04)' : `color-mix(in oklch, ${FORGE.cyan} ${20 + v * 20}%, #060812)`, boxShadow: v >= 3 ? `0 0 4px ${FORGE.cyan}66` : 'none' }} />
                  )
                })}
              </div>
            ))}
          </div>
        </ForgeBox>

        {/* Duration chart */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Durée · 30 j</span>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.green }}>↗ +2 min</span>
        </div>
        <ForgeBox accent={FORGE.blue}>
          <svg width="100%" height="70" viewBox="0 0 300 70" preserveAspectRatio="none">
            <defs>
              <linearGradient id="det-g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={FORGE.cyan} stopOpacity="0.55" />
                <stop offset="1" stopColor={FORGE.cyan} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,48 L20,44 L40,48 L60,36 L80,38 L100,30 L120,26 L140,29 L160,18 L180,24 L200,14 L220,18 L240,11 L260,14 L280,8 L300,12 L300,70 L0,70 Z" fill="url(#det-g)" />
            <path d="M0,48 L20,44 L40,48 L60,36 L80,38 L100,30 L120,26 L140,29 L160,18 L180,24 L200,14 L220,18 L240,11 L260,14 L280,8 L300,12" stroke={FORGE.cyan} strokeWidth="1.8" fill="none" style={{ filter: `drop-shadow(0 0 4px ${FORGE.cyan}cc)` }} />
          </svg>
        </ForgeBox>

        {/* Journal */}
        <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase', padding: '0 2px' }}>Journal</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {JOURNAL.map((l, i) => (
            <ForgeBox key={i} pad={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 26, background: FORGE.cyan, borderRadius: 2, boxShadow: `0 0 6px ${FORGE.cyan}aa`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>
                    {l.v}{l.note && <span style={{ color: FORGE.fgDim, fontWeight: 400, marginLeft: 6 }}>· {l.note}</span>}
                  </div>
                  <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 2 }}>{l.d}</div>
                </div>
                <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.green, fontWeight: 600 }}>+{l.xp}<span style={{ color: FORGE.fgFaint, fontSize: 9, marginLeft: 2 }}>XP</span></div>
              </div>
            </ForgeBox>
          ))}
        </div>
      </div>
      <Gesture />
    </div>
  )
}
