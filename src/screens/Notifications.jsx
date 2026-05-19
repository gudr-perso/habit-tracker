import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import ForgeBox from '../components/ForgeBox'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import Status from '../components/Status'
import Gesture from '../components/Gesture'

function Toggle({ on, color = FORGE.cyan, onClick }) {
  return (
    <div onClick={onClick} style={{ width: 36, height: 22, borderRadius: 11, background: on ? color : 'rgba(255,255,255,0.08)', border: on ? 'none' : `1px solid ${FORGE.line}`, padding: 2, display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', boxShadow: on ? `0 0 8px ${color}88` : 'none', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ width: 18, height: 18, borderRadius: 999, background: on ? '#001022' : FORGE.fgDim, transition: 'background 0.2s' }} />
    </div>
  )
}

function StaticRow({ title, sub, on, color }) {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${FORGE.lineSoft}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13.5, color: FORGE.fg }}>{title}</div>
        {sub && <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle on={on} color={color} onClick={() => {}} />
    </div>
  )
}

export default function Notifications() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    api.getHabits().then(h => { setHabits(h); setLoading(false) }).catch(console.error)
  }, [])

  async function toggleReminder(habit) {
    const newTime = habit.reminder_time ? null : '08:00'
    const updated = await api.updateHabit(habit.id, { reminder_time: newTime })
    setHabits(hs => hs.map(h => h.id === habit.id ? updated : h))
    if (newTime) setEditingId(habit.id)
    else setEditingId(null)
  }

  async function saveTime(habit, time) {
    const updated = await api.updateHabit(habit.id, { reminder_time: time || null })
    setHabits(hs => hs.map(h => h.id === habit.id ? updated : h))
    setEditingId(null)
  }

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar back="←" onBack={() => navigate(-1)} title="Notifications" right={null} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Global</div>
        <ForgeBox accent={FORGE.blue} pad={0}>
          <StaticRow title="Notifications activées" sub="autorise rappels & récaps" on={true} color={FORGE.cyan} />
          <StaticRow title="Son & vibration" sub="discrète" on={true} color={FORGE.cyan} />
        </ForgeBox>

        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Rappels par habitude
        </div>

        {loading ? (
          <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 11, letterSpacing: 2, textAlign: 'center', padding: '20px 0' }}>CHARGEMENT…</div>
        ) : habits.length === 0 ? (
          <div style={{ fontFamily: FORGE.mono, color: FORGE.fgFaint, fontSize: 11, textAlign: 'center', padding: '20px 0' }}>Aucune habitude active</div>
        ) : (
          <div style={{ display: 'grid', gap: 6 }}>
            {habits.map(h => {
              const on = !!h.reminder_time
              const isEditing = editingId === h.id
              return (
                <ForgeBox key={h.id} pad={0} accent={on ? h.color : undefined}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 3, background: h.color, opacity: on ? 1 : 0.3, boxShadow: on ? `0 0 6px ${h.color}` : 'none', alignSelf: 'stretch' }} />
                    <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.color, fontSize: 18, opacity: on ? 1 : 0.5 }}>{h.icon}</div>
                    <div style={{ flex: 1, padding: '10px 4px' }}>
                      <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>{h.name}</div>
                      {isEditing ? (
                        <input
                          type="time"
                          defaultValue={h.reminder_time || '08:00'}
                          autoFocus
                          onBlur={e => saveTime(h, e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveTime(h, e.target.value)}
                          style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: FORGE.mono, fontSize: 12, color: h.color, cursor: 'pointer', marginTop: 2 }}
                        />
                      ) : (
                        <div
                          onClick={() => on && setEditingId(h.id)}
                          style={{ fontFamily: FORGE.mono, fontSize: 10, color: on ? FORGE.fgDim : FORGE.fgFaint, marginTop: 2, cursor: on ? 'pointer' : 'default' }}
                        >
                          {on ? h.reminder_time : 'aucun rappel'}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '0 12px' }}>
                      <Toggle on={on} color={h.color} onClick={() => toggleReminder(h)} />
                    </div>
                  </div>
                </ForgeBox>
              )
            })}
          </div>
        )}

        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Récap quotidien</div>
        <ForgeBox accent={FORGE.cyan} pad={0}>
          <StaticRow title="Récap du matin" sub="« voici ton plan du jour »" on={true} color={FORGE.cyan} />
          <StaticRow title="Récap du soir" sub="« ce que tu as fait aujourd'hui »" on={true} color={FORGE.cyan} />
          <StaticRow title="Série en danger" sub="2 h avant minuit · alerte critique" on={true} color={FORGE.fire} />
        </ForgeBox>
      </div>
      <Gesture />
    </div>
  )
}
