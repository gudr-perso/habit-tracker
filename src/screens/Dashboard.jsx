import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const HABITS = [
  { id: '1', name: 'Méditation',  meta: '10 min',          g: '☾', color: FORGE.cyan,   streak: 23, status: 'done',     xp: 30, boss: false },
  { id: '2', name: 'Hydratation', meta: '1.4 / 2.0 L',     g: '◯', color: FORGE.blue,   streak: 12, status: 'progress', xp: 20, pct: 0.7, boss: false },
  { id: '3', name: 'Run 5 km',    meta: 'Plus dur du jour', g: '➤', color: FORGE.fire,   streak:  4, status: 'todo',     xp: 50, boss: true },
  { id: '4', name: 'Lecture',     meta: '0 / 20 min',       g: '▤', color: FORGE.purple, streak:  8, status: 'todo',     xp: 25, boss: false },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* nebula */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 60% 30% at 20% 0%, ${FORGE.blueGlow}33, transparent), radial-gradient(ellipse 50% 25% at 100% 90%, ${FORGE.fireGlow}1f, transparent)` }} />

      <Status dark />

      {/* Header */}
      <div style={{ padding: '2px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${FORGE.blueGlow}, ${FORGE.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontFamily: FORGE.sans, fontSize: 16, boxShadow: `0 0 12px ${FORGE.blueGlow}77, inset 0 0 0 1px rgba(255,255,255,0.18)`, position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate('/profil')}
          >
            R
            <div style={{ position: 'absolute', bottom: -3, right: -3, padding: '1px 5px', borderRadius: 4, background: FORGE.bg, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 8.5, fontWeight: 700, color: FORGE.cyan, letterSpacing: 0.5 }}>12</div>
          </div>
          <div>
            <div style={{ fontFamily: FORGE.sans, fontSize: 17, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.2, lineHeight: 1.1 }}>Romain</div>
            <div style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.cyan, letterSpacing: 1, marginTop: 2 }}>« CONSTANT »</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>LUN 18 MAI</div>
          <div style={{ fontFamily: FORGE.sans, fontSize: 17, color: FORGE.fg, fontWeight: 600, marginTop: 1 }}>JOUR 167</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Completion + Streak */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 10 }}>
          <ForgeBox glow={FORGE.blueGlow} accent={FORGE.blue} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: `radial-gradient(circle at 80% 110%, ${FORGE.blueGlow}33, transparent 55%)`, borderRadius: 12 }} />
            <div style={{ position: 'relative' }}>
              <ForgeTag color={FORGE.blue}>Complétion</ForgeTag>
              <div style={{ marginTop: 12, fontFamily: FORGE.sans, fontSize: 54, fontWeight: 700, letterSpacing: -2.2, lineHeight: 0.9, color: FORGE.fg, textShadow: `0 0 18px ${FORGE.blueGlow}88` }}>
                50<span style={{ fontSize: 22, color: FORGE.fgDim, fontWeight: 500 }}>%</span>
              </div>
              <div style={{ marginTop: 10 }}><ForgeGauge value={0.5} color={FORGE.blue} segments height={6} /></div>
              <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>3 / 6 habitudes</div>
            </div>
          </ForgeBox>

          <ForgeBox glow={FORGE.fireGlow} accent={FORGE.fire} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 120%, ${FORGE.fireGlow}44, transparent 55%)`, borderRadius: 12 }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ForgeTag color={FORGE.fire}>Série</ForgeTag>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 26 }}>🔥</span>
                <span style={{ fontFamily: FORGE.sans, fontSize: 36, fontWeight: 700, letterSpacing: -1.2, color: FORGE.fire, textShadow: `0 0 14px ${FORGE.fireGlow}cc`, lineHeight: 1 }}>23</span>
              </div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, marginTop: 3 }}>jours · 🏆 34</div>
              <div style={{ flex: 1 }} />
              <div style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Danger · -8h</div>
            </div>
          </ForgeBox>
        </div>

        {/* XP bar */}
        <ForgeBox accent={FORGE.purple} pad={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <ForgeTag color={FORGE.purple}>LV 12 → 13</ForgeTag>
              <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>+120 today</span>
            </div>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>1840 / 2500 XP</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={0.74} color={FORGE.purple} segments height={8} /></div>
        </ForgeBox>

        {/* Habits list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 2px 0' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1.5 }}>Habitudes du jour</span>
          <span onClick={() => navigate('/create')} style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.blue, letterSpacing: 0.5, cursor: 'pointer' }}>+ NEW</span>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {HABITS.map((h) => (
            <ForgeBox key={h.id} pad={0} style={{ overflow: 'hidden' }}
              accent={h.boss ? FORGE.fire : undefined}
              glow={h.boss ? FORGE.fireGlow : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => navigate(`/habit/${h.id}`)}>
                <div style={{ width: 3, background: h.color, boxShadow: `0 0 8px ${h.color}aa` }} />
                <div style={{ width: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h.status === 'done' ? `${h.color}1f` : 'transparent', color: h.color, fontSize: 22 }}>
                  {h.status === 'done' ? <span style={{ textShadow: `0 0 8px ${h.color}` }}>✓</span> : h.g}
                </div>
                <div style={{ flex: 1, padding: '11px 12px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 14, color: FORGE.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</span>
                      {h.boss && <ForgeTag color={FORGE.fire}>★ BOSS</ForgeTag>}
                    </div>
                    <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: h.status === 'done' ? FORGE.green : h.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      +{h.xp}<span style={{ color: FORGE.fgFaint, marginLeft: 2, fontSize: 9 }}>XP</span>
                    </span>
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>{h.meta}</span>
                    <span style={{ color: FORGE.fgFaint, fontSize: 8 }}>•</span>
                    <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fire }}>🔥 {h.streak}</span>
                  </div>
                  {h.status === 'progress' && (
                    <div style={{ marginTop: 7 }}><ForgeGauge value={h.pct} color={h.color} height={4} /></div>
                  )}
                </div>
              </div>
            </ForgeBox>
          ))}
        </div>

        {/* Weekly quest */}
        <ForgeBox accent={FORGE.yellow} glow={FORGE.yellow} style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <ForgeTag color={FORGE.yellow}>★ Quête hebdo</ForgeTag>
              <div style={{ marginTop: 6, fontFamily: FORGE.sans, fontSize: 15, color: FORGE.fg, fontWeight: 700, letterSpacing: -0.1 }}>Semaine parfaite</div>
              <div style={{ marginTop: 2, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>6/6 pendant 7 jours · 4 / 7</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: FORGE.yellow, lineHeight: 1, textShadow: `0 0 12px ${FORGE.yellow}aa` }}>+200</div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1 }}>XP REWARD</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
            {[1, 1, 1, 1, 0, 0, 0].map((v, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: v ? FORGE.yellow : 'rgba(255,255,255,0.06)', boxShadow: v ? `0 0 6px ${FORGE.yellow}88` : 'none' }} />
            ))}
          </div>
        </ForgeBox>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
