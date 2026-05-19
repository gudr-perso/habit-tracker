import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { useApp } from '../AppContext'
import { getLevelTitle } from '../lib/levels'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()
}

function habitColor(h) {
  const map = { '#5dd7ff': FORGE.cyan, '#3aa8ff': FORGE.blue, '#ff7a1a': FORGE.fire, '#a47cff': FORGE.purple }
  return map[h.color] || h.color
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { date, dashboard, profile, loading, toggleLog } = useApp()
  const [catFilter, setCatFilter] = useState('all')

  if (loading || !dashboard) {
    return (
      <div style={{ flex: 1, background: FORGE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>CHARGEMENT…</div>
      </div>
    )
  }

  const { habits: allHabits, weeklyHabits: allWeeklyHabits = [], completion } = dashboard
  const habits = catFilter === 'pro'   ? allHabits.filter(h => h.category === 'pro')
               : catFilter === 'perso' ? allHabits.filter(h => h.category !== 'pro')
               : allHabits
  const weeklyHabits = catFilter === 'pro'   ? allWeeklyHabits.filter(h => h.category === 'pro')
                     : catFilter === 'perso' ? allWeeklyHabits.filter(h => h.category !== 'pro')
                     : allWeeklyHabits
  const p = profile || {}
  const xpPct = p.xp_next ? Math.min(p.xp / p.xp_next, 1) : 0

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 60% 30% at 20% 0%, ${FORGE.blueGlow}33, transparent), radial-gradient(ellipse 50% 25% at 100% 90%, ${FORGE.fireGlow}1f, transparent)` }} />

      <Status dark />

      <div style={{ padding: '2px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${FORGE.blueGlow}, ${FORGE.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontFamily: FORGE.sans, fontSize: 16, boxShadow: `0 0 12px ${FORGE.blueGlow}77, inset 0 0 0 1px rgba(255,255,255,0.18)`, position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => navigate('/profil')}
          >
            {(p.name || 'R')[0].toUpperCase()}
            <div style={{ position: 'absolute', bottom: -3, right: -3, padding: '1px 5px', borderRadius: 4, background: FORGE.bg, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 8.5, fontWeight: 700, color: FORGE.cyan, letterSpacing: 0.5 }}>{p.level ?? 1}</div>
          </div>
          <div>
            <div style={{ fontFamily: FORGE.sans, fontSize: 17, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.2, lineHeight: 1.1 }}>{p.name ?? 'Romain'}</div>
            <div style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.cyan, letterSpacing: 1, marginTop: 2 }}>« {p.active_title || getLevelTitle(p.class, p.level ?? 1)} »</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>{fmtDate(date)}</div>
          <div style={{ fontFamily: FORGE.sans, fontSize: 17, color: FORGE.fg, fontWeight: 600, marginTop: 1 }}>{completion}% complété</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 10 }}>
          <ForgeBox glow={FORGE.blueGlow} accent={FORGE.blue} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: `radial-gradient(circle at 80% 110%, ${FORGE.blueGlow}33, transparent 55%)`, borderRadius: 12 }} />
            <div style={{ position: 'relative' }}>
              <ForgeTag color={FORGE.blue}>Complétion</ForgeTag>
              <div style={{ marginTop: 12, fontFamily: FORGE.sans, fontSize: 54, fontWeight: 700, letterSpacing: -2.2, lineHeight: 0.9, color: FORGE.fg, textShadow: `0 0 18px ${FORGE.blueGlow}88` }}>
                {completion}<span style={{ fontSize: 22, color: FORGE.fgDim, fontWeight: 500 }}>%</span>
              </div>
              <div style={{ marginTop: 10 }}><ForgeGauge value={completion / 100} color={FORGE.blue} segments height={6} /></div>
              <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
                {habits.filter(h => h.log?.done).length} / {habits.length} habitudes
              </div>
            </div>
          </ForgeBox>

          <ForgeBox glow={FORGE.fireGlow} accent={FORGE.fire} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 120%, ${FORGE.fireGlow}44, transparent 55%)`, borderRadius: 12 }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <ForgeTag color={FORGE.fire}>Série</ForgeTag>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 26 }}>🔥</span>
                <span style={{ fontFamily: FORGE.sans, fontSize: 36, fontWeight: 700, letterSpacing: -1.2, color: FORGE.fire, textShadow: `0 0 14px ${FORGE.fireGlow}cc`, lineHeight: 1 }}>{p.streak ?? 0}</span>
              </div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, marginTop: 3 }}>jours · 🏆 {p.record_streak ?? 0}</div>
            </div>
          </ForgeBox>
        </div>

        <ForgeBox accent={FORGE.purple} pad={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.purple}>LV {p.level ?? 1} → {(p.level ?? 1) + 1}</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>{p.xp ?? 0} / {p.xp_next ?? 500} XP</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={xpPct} color={FORGE.purple} segments height={8} /></div>
        </ForgeBox>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 2px 0' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1.5 }}>Habitudes du jour</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[['all', 'Tout'], ['perso', 'Perso'], ['pro', 'Pro']].map(([f, label]) => (
              <div key={f} onClick={() => setCatFilter(f)}
                style={{ padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontFamily: FORGE.mono, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.8, background: catFilter === f ? `${FORGE.purple}22` : 'transparent', border: `1px solid ${catFilter === f ? FORGE.purple : FORGE.line}`, color: catFilter === f ? FORGE.purple : FORGE.fgFaint }}>
                {label}
              </div>
            ))}
            <span onClick={() => navigate('/create')} style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.blue, letterSpacing: 0.5, cursor: 'pointer' }}>+ NEW</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {habits.map((h) => {
            const color = habitColor(h)
            const done = !!h.log?.done
            return (
              <ForgeBox key={h.id} pad={0} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ width: 3, background: color, boxShadow: `0 0 8px ${color}aa` }} />
                  <div
                    style={{ width: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? `${color}1f` : 'transparent', color, fontSize: 22, cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => toggleLog(h.id, !done, h.xp_per_session)}
                  >
                    {done ? <span style={{ textShadow: `0 0 8px ${color}` }}>✓</span> : h.icon}
                  </div>
                  <div style={{ flex: 1, padding: '11px 12px', minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/habit/${h.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 14, color: FORGE.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</span>
                      <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: done ? FORGE.green : color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        +{h.xp_per_session}<span style={{ color: FORGE.fgFaint, marginLeft: 2, fontSize: 9 }}>XP</span>
                      </span>
                    </div>
                    <div style={{ marginTop: 4, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>
                      {h.category} · {h.type}
                      {h.reminder_time && <span style={{ color: FORGE.fgFaint }}> · {h.reminder_time}</span>}
                    </div>
                  </div>
                </div>
              </ForgeBox>
            )
          })}
          {habits.length === 0 && (
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '20px 0' }}>
              Aucune habitude active — <span style={{ color: FORGE.blue, cursor: 'pointer' }} onClick={() => navigate('/create')}>créer +</span>
            </div>
          )}
        </div>

        {weeklyHabits.length > 0 && (
          <>
            <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Objectifs hebdo
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {weeklyHabits.map((h) => {
                const color = habitColor(h)
                const done = !!h.log?.done
                const pct = Math.min((h.weekly_done ?? 0) / (h.weekly_target ?? 1), 1)
                return (
                  <ForgeBox key={h.id} pad={0} style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                      <div style={{ width: 3, background: color, boxShadow: `0 0 8px ${color}aa` }} />
                      <div
                        style={{ width: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? `${color}1f` : 'transparent', color, fontSize: 22, cursor: 'pointer', flexShrink: 0 }}
                        onClick={() => toggleLog(h.id, !done, h.xp_per_session)}
                      >
                        {done ? <span style={{ textShadow: `0 0 8px ${color}` }}>✓</span> : h.icon}
                      </div>
                      <div style={{ flex: 1, padding: '10px 12px', minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/habit/${h.id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 14, color: FORGE.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</span>
                          <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: done ? FORGE.green : color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            +{h.xp_per_session}<span style={{ color: FORGE.fgFaint, marginLeft: 2, fontSize: 9 }}>XP</span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                          <div style={{ flex: 1, height: 4, background: FORGE.lineSoft, borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${pct * 100}%`, background: pct >= 1 ? FORGE.green : color, borderRadius: 2, transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: pct >= 1 ? FORGE.green : FORGE.fgDim, whiteSpace: 'nowrap' }}>
                            {h.weekly_done ?? 0}/{h.weekly_target} cette sem.
                          </span>
                        </div>
                      </div>
                    </div>
                  </ForgeBox>
                )
              })}
            </div>
          </>
        )}
        </div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
