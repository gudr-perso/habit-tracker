import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { useApp } from '../AppContext'
import { api } from '../api'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const CLASSES = [
  { key: 'sage',    label: 'Sage',      g: '☾', color: FORGE.cyan   },
  { key: 'athlete', label: 'Athlète',   g: '➤', color: FORGE.fire   },
  { key: 'builder', label: 'Bâtisseur', g: '◧', color: FORGE.purple },
]

const RARITY_COLOR = { common: FORGE.cyan, rare: FORGE.blue, epic: FORGE.purple, legend: FORGE.yellow }

export default function Profile() {
  const navigate = useNavigate()
  const { profile, loadDashboard } = useApp()
  const p = profile || {}
  const xpPct = p.xp_next ? Math.min((p.xp ?? 0) / p.xp_next, 1) : 0
  const initial = (p.name || '?')[0].toUpperCase()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editClass, setEditClass] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10) })()

  const [yesterdayData, setYesterdayData] = useState(null)
  const [catFilter, setCatFilter] = useState('all')
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    api.getDashboard(yesterday).then(setYesterdayData).catch(console.error)
  }, [yesterday])

  async function toggleYesterday(habit) {
    if (togglingId) return
    setTogglingId(habit.id)
    const newDone = habit.log?.done ? 0 : 1
    await api.upsertLog(habit.id, {
      date: yesterday,
      done: newDone,
      xp_earned: newDone ? habit.xp_per_session : 0,
    })
    const [updated] = await Promise.all([
      api.getDashboard(yesterday),
      newDone ? loadDashboard() : Promise.resolve(),
    ])
    setYesterdayData(updated)
    setTogglingId(null)
  }

  function startEdit() {
    setEditName(p.name || '')
    setEditClass(p.class || 'sage')
    setEditing(true)
  }

  async function saveEdit() {
    if (!editName.trim() || saving) return
    setSaving(true)
    await api.updateProfile({ name: editName.trim(), class: editClass })
    await loadDashboard()
    setSaving(false)
    setEditing(false)
  }

  const classInfo = CLASSES.find(c => c.key === (p.class || 'sage')) || CLASSES[0]

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.purple}33`} br={`${FORGE.cyan}22`} />
      <Status dark />

      {/* Hero */}
      <div style={{ padding: '8px 14px 14px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, ${FORGE.blueGlow}, ${FORGE.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontFamily: FORGE.sans, fontSize: 24, boxShadow: `0 0 20px ${FORGE.blueGlow}88, inset 0 0 0 1.5px rgba(255,255,255,0.18)` }}>{initial}</div>
            <div style={{ position: 'absolute', bottom: -4, right: -4, padding: '2px 7px', borderRadius: 5, background: FORGE.bg, border: `1px solid ${FORGE.lineHot}`, fontFamily: FORGE.mono, fontSize: 10, fontWeight: 700, color: FORGE.cyan, letterSpacing: 0.5, boxShadow: `0 0 8px ${FORGE.cyan}33` }}>LV {p.level ?? 1}</div>
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                maxLength={24}
                style={{ background: 'transparent', border: 'none', borderBottom: `1.5px solid ${FORGE.cyan}88`, outline: 'none', fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.4, width: '100%', paddingBottom: 3 }}
              />
            ) : (
              <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.4, lineHeight: 1.05 }}>{p.name ?? '—'}</div>
            )}
            <div style={{ marginTop: 4 }}>
              <ForgeTag color={classInfo.color}>{classInfo.g} {classInfo.label}</ForgeTag>
            </div>
          </div>
          <div
            onClick={editing ? saveEdit : startEdit}
            style={{ fontFamily: FORGE.mono, fontSize: 11, color: editing ? FORGE.cyan : FORGE.fgDim, cursor: 'pointer', padding: '6px 10px', border: `1px solid ${editing ? FORGE.cyan + '66' : FORGE.line}`, borderRadius: 8, letterSpacing: 0.5 }}
          >{saving ? '…' : editing ? 'SAUVER' : 'ÉDITER'}</div>
        </div>

        {/* Class picker in edit mode */}
        {editing && (
          <div style={{ display: 'flex', gap: 8 }}>
            {CLASSES.map(c => (
              <div key={c.key} onClick={() => setEditClass(c.key)}
                style={{ flex: 1, padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: editClass === c.key ? `${c.color}22` : FORGE.surface, border: `1px solid ${editClass === c.key ? c.color : FORGE.line}`, cursor: 'pointer', boxShadow: editClass === c.key ? `0 0 8px ${c.color}44` : 'none' }}>
                <div style={{ fontSize: 20, color: c.color }}>{c.g}</div>
                <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: editClass === c.key ? c.color : FORGE.fgDim, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>

        {/* XP bar */}
        <ForgeBox accent={FORGE.purple} glow={FORGE.purple}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.purple}>LV {p.level ?? 1} → {(p.level ?? 1) + 1}</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>{p.xp ?? 0} / {p.xp_next ?? 500} XP</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={xpPct} color={FORGE.purple} segments height={10} /></div>
          <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint }}>{(p.xp_next ?? 500) - (p.xp ?? 0)} XP avant LV {(p.level ?? 1) + 1}</div>
        </ForgeBox>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Série',  v: String(p.streak ?? 0),        sub: 'j', c: FORGE.fire,   glow: FORGE.fireGlow, prefix: '🔥' },
            { k: 'Record', v: String(p.record_streak ?? 0), sub: 'j', c: FORGE.fg },
            { k: 'XP total', v: String(p.xp ?? 0),         sub: 'xp', c: FORGE.purple, glow: FORGE.purple },
          ].map((s) => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c === FORGE.fg ? undefined : s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.k}</div>
              <div style={{ marginTop: 4, fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: s.c, letterSpacing: -0.6, lineHeight: 1, textShadow: s.glow ? `0 0 10px ${s.glow}aa` : 'none' }}>
                {s.prefix && <span style={{ fontSize: 13, marginRight: 2 }}>{s.prefix}</span>}{s.v}
                <span style={{ fontSize: 11, color: FORGE.fgDim, fontWeight: 500, marginLeft: 2 }}>{s.sub}</span>
              </div>
            </ForgeBox>
          ))}
        </div>

        {/* Yesterday widget */}
        {yesterdayData && yesterdayData.habits.length > 0 && (() => {
          const yDate = new Date(yesterday + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
          const filtered = catFilter === 'pro'
            ? yesterdayData.habits.filter(h => h.category === 'pro')
            : yesterdayData.habits
          const doneCnt = filtered.filter(h => h.log?.done).length
          return (
            <ForgeBox accent={doneCnt === filtered.length ? FORGE.green : FORGE.fire}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <ForgeTag color={doneCnt === filtered.length ? FORGE.green : FORGE.fire}>
                    Hier · {doneCnt}/{filtered.length}
                  </ForgeTag>
                  <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, marginTop: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{yDate}</div>
                </div>
                {/* Filtre pro / tout */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {['all', 'pro'].map(f => (
                    <div key={f} onClick={() => setCatFilter(f)}
                      style={{ padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: FORGE.mono, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.8, background: catFilter === f ? `${FORGE.purple}22` : 'transparent', border: `1px solid ${catFilter === f ? FORGE.purple : FORGE.line}`, color: catFilter === f ? FORGE.purple : FORGE.fgFaint }}>
                      {f === 'all' ? 'Tout' : 'Pro'}
                    </div>
                  ))}
                </div>
              </div>
              {filtered.length === 0 ? (
                <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '6px 0' }}>Aucune habitude "pro"</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {filtered.map(h => {
                    const done = !!h.log?.done
                    const isToggling = togglingId === h.id
                    return (
                      <div key={h.id} onClick={() => !isToggling && toggleYesterday(h)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: done ? `${h.color}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? h.color + '44' : FORGE.line}`, cursor: 'pointer', opacity: isToggling ? 0.5 : 1, transition: 'all 0.15s' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? `${h.color}33` : 'rgba(255,255,255,0.05)', border: `1px solid ${done ? h.color : FORGE.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: done ? h.color : FORGE.fgFaint, flexShrink: 0 }}>
                          {done ? '✓' : h.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: done ? FORGE.fg : FORGE.fgDim }}>{h.name}</div>
                          <div style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint, marginTop: 1 }}>{h.category} · {done ? `+${h.xp_per_session} XP` : 'non fait'}</div>
                        </div>
                        {!done && <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fire, letterSpacing: 0.5 }}>rattraper</div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </ForgeBox>
          )
        })()}

        {/* Class card */}
        <ForgeBox accent={classInfo.color} glow={classInfo.color}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${classInfo.color}22`, border: `1.5px solid ${classInfo.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: classInfo.color, boxShadow: `0 0 12px ${classInfo.color}44`, flexShrink: 0 }}>{classInfo.g}</div>
            <div>
              <ForgeTag color={classInfo.color}>Classe · {classInfo.label}</ForgeTag>
              <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
                {p.active_title ? `Titre actif : « ${p.active_title} »` : 'Aucun titre actif'}
              </div>
            </div>
          </div>
        </ForgeBox>

        {/* Badges placeholder */}
        <ForgeBox accent={FORGE.yellow} pad={14}>
          <ForgeTag color={FORGE.yellow}>★ Hauts faits</ForgeTag>
          <div style={{ marginTop: 10, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '8px 0' }}>
            Les badges seront débloqués au fil des séries et records ✦
          </div>
        </ForgeBox>

        {/* Links */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div onClick={() => navigate('/notifications')} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: FORGE.surface, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, cursor: 'pointer', textAlign: 'center' }}>🔔 Notifications</div>
          <div onClick={() => navigate('/stats')} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: FORGE.surface, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, cursor: 'pointer', textAlign: 'center' }}>📊 Stats</div>
        </div>

        {/* Danger zone */}
        <div
          onClick={() => { if (window.confirm('Relancer l\'onboarding ? Ton profil et tes habitudes sont conservés.')) { api.updateProfile({ onboarded: 0 }).then(async () => { await loadDashboard(); navigate('/onboarding') }) } }}
          style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, cursor: 'pointer', padding: '8px 0', letterSpacing: 0.5 }}
        >Relancer l'onboarding →</div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
