import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import { useApp } from '../AppContext'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import Gesture from '../components/Gesture'

const FR_DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function computeStreak(logs, today) {
  const doneSet = new Set(logs.filter(l => l.done).map(l => l.date))
  let streak = 0
  let d = today
  while (doneSet.has(d)) {
    streak++
    d = addDays(d, -1)
  }
  if (streak === 0) {
    d = addDays(today, -1)
    while (doneSet.has(d)) {
      streak++
      d = addDays(d, -1)
    }
  }
  // record streak
  const sorted = [...doneSet].sort()
  let record = 0, cur = 0, prev = null
  for (const date of sorted) {
    if (prev && date === addDays(prev, 1)) {
      cur++
    } else {
      cur = 1
    }
    record = Math.max(record, cur)
    prev = date
  }
  return { streak, record }
}

function buildHeatmap(logs, today, weeks = 13) {
  const total = weeks * 7
  const doneMap = Object.fromEntries(logs.filter(l => l.done).map(l => [l.date, l]))
  const cells = []
  for (let i = total - 1; i >= 0; i--) {
    const d = addDays(today, -i)
    cells.push({ date: d, log: doneMap[d] || null })
  }
  // pad front so first cell is Monday
  const firstDow = (new Date(cells[0].date + 'T00:00:00').getDay() + 6) % 7 // 0=Mon
  const padded = [...Array(firstDow).fill(null), ...cells]
  // split into rows (7 per week, by column = week)
  const numWeeks = Math.ceil(padded.length / 7)
  const rows = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: numWeeks }, (_, w) => padded[w * 7 + r] ?? null)
  )
  return { rows, numWeeks }
}

export default function HabitDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { loadDashboard } = useApp()
  const today = new Date().toISOString().slice(0, 10)

  const [habit, setHabit] = useState(null)
  const [logs, setLogs] = useState([])
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedLog, setSelectedLog] = useState(null)
  const [note, setNote] = useState('')
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState(false)

  const load = useCallback(async () => {
    const from = addDays(today, -364)
    const [h, ls] = await Promise.all([
      api.getHabit(id),
      api.getLogs(id, from, today),
    ])
    setHabit(h)
    setLogs(ls)
    const tl = ls.find(l => l.date === selectedDate) || null
    setSelectedLog(tl)
    setNote(tl?.note || '')
    setValue(tl?.value != null ? String(tl.value) : '')
    setLoading(false)
  }, [id, today])

  useEffect(() => { load() }, [load])

  function selectDate(date) {
    const log = logs.find(l => l.date === date) || null
    setSelectedDate(date)
    setSelectedLog(log)
    setNote(log?.note || '')
    setValue(log?.value != null ? String(log.value) : '')
    setEditingNote(false)
  }

  async function handleToggle() {
    if (saving) return
    setSaving(true)
    const newDone = selectedLog?.done ? 0 : 1
    await api.upsertLog(id, {
      date: selectedDate,
      done: newDone,
      value: value ? parseFloat(value) : null,
      note: note || null,
      xp_earned: newDone ? (habit?.xp_per_session || 0) : 0,
    })
    if (selectedDate === today) await loadDashboard()
    await load()
    setSaving(false)
  }

  async function handleSaveNote() {
    if (saving) return
    setSaving(true)
    await api.upsertLog(id, {
      date: selectedDate,
      done: selectedLog?.done || 0,
      value: value ? parseFloat(value) : null,
      note: note || null,
      xp_earned: selectedLog?.xp_earned || 0,
    })
    await load()
    setSaving(false)
    setEditingNote(false)
  }

  if (loading || !habit) {
    return (
      <div style={{ flex: 1, background: FORGE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>CHARGEMENT…</div>
      </div>
    )
  }

  const color = habit.color || FORGE.cyan
  const { streak, record } = computeStreak(logs, today)
  const totalDone = logs.filter(l => l.done).length
  const { rows, numWeeks } = buildHeatmap(logs, today, 13)

  const last30 = logs.filter(l => l.date >= addDays(today, -29)).sort((a, b) => a.date.localeCompare(b.date))
  const showChart = habit.type !== 'boolean' && last30.some(l => l.value)

  const journal = logs.filter(l => l.done).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)
  const done = !!selectedLog?.done
  const isFuture = selectedDate > today

  function fmtDate(iso) {
    if (iso === today) return "Aujourd'hui"
    if (iso === addDays(today, -1)) return 'Hier'
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  function fmtValue(log) {
    if (log.value == null) return ''
    if (habit.type === 'duration') return `${log.value} min`
    if (habit.type === 'count') return `${log.value}×`
    return ''
  }

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 60% 30% at 50% 0%, ${color}22, transparent)` }} />
      <Status dark />

      <div style={{ padding: '2px 14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={() => navigate(-1)} style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16, cursor: 'pointer' }}>←</span>
          <ForgeTag color={color}>{habit.category} · {habit.type}</ForgeTag>
        </div>
        <span
          onClick={() => { if (window.confirm(`Archiver « ${habit.name} » ?`)) api.deleteHabit(id).then(() => navigate('/dashboard')) }}
          style={{ color: FORGE.fgFaint, fontFamily: FORGE.mono, fontSize: 13, cursor: 'pointer' }}
        >⋯</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${color}cc, ${color}44)`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: `0 0 22px ${color}77, inset 0 0 0 1px rgba(255,255,255,0.18)`, flexShrink: 0 }}>{habit.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FORGE.sans, fontSize: 26, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.5, lineHeight: 1.05 }}>{habit.name}</div>
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, marginTop: 3 }}>
              {habit.frequency}
              {habit.reminder_time && ` · ${habit.reminder_time}`}
              {totalDone > 0 && <span> · <span style={{ color }}>{totalDone} séances</span></span>}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Série',  v: String(streak),     sub: 'jours',    c: FORGE.fire,  glow: FORGE.fireGlow, prefix: streak > 0 ? '🔥' : '' },
            { k: 'Record', v: String(record),      sub: 'jours',    c: FORGE.fg },
            { k: 'Total',  v: String(totalDone),   sub: 'séances',  c: color, glow: color },
          ].map((s) => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c === FORGE.fg ? undefined : s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.k}</div>
              <div style={{ marginTop: 6, fontFamily: FORGE.sans, fontSize: 24, fontWeight: 700, color: s.c, letterSpacing: -0.8, lineHeight: 1, textShadow: s.glow ? `0 0 12px ${s.glow}cc` : 'none' }}>
                {s.prefix && <span style={{ fontSize: 14, marginRight: 2 }}>{s.prefix}</span>}{s.v}
              </div>
              <div style={{ marginTop: 2, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgDim }}>{s.sub}</div>
            </ForgeBox>
          ))}
        </div>

        {/* Selected date action */}
        <ForgeBox accent={done ? color : selectedDate !== today ? FORGE.purple : FORGE.line} glow={done ? color : undefined}>
          {selectedDate !== today && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.purple, letterSpacing: 1, textTransform: 'uppercase' }}>
                ← {fmtDate(selectedDate)}
              </div>
              <div onClick={() => selectDate(today)} style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, cursor: 'pointer' }}>retour à aujourd'hui ×</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              onClick={isFuture ? undefined : handleToggle}
              style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0, cursor: isFuture ? 'default' : 'pointer',
                background: done ? `linear-gradient(135deg, ${color}cc, ${color}44)` : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${done ? color : FORGE.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: done ? '#001022' : isFuture ? FORGE.fgFaint : color,
                boxShadow: done ? `0 0 16px ${color}77` : 'none',
                transition: 'all 0.2s',
              }}
            >{done ? '✓' : isFuture ? '—' : habit.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FORGE.sans, fontWeight: 700, fontSize: 14, color: done ? color : FORGE.fg }}>
                {isFuture ? 'Jour futur' : done ? (selectedDate === today ? "Fait aujourd'hui !" : 'Fait ce jour-là ✓') : (selectedDate === today ? 'Marquer comme fait' : 'Pas encore fait — rattraper ?')}
              </div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, marginTop: 2 }}>
                {isFuture ? 'Impossible de logger un jour futur' : done ? `+${habit.xp_per_session} XP gagné` : `Tap pour valider · +${habit.xp_per_session} XP`}
              </div>
            </div>
          </div>

          {/* Value input for duration/count */}
          {!isFuture && habit.type !== 'boolean' && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={habit.type === 'duration' ? 'minutes…' : 'répétitions…'}
                min="0"
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${FORGE.line}`,
                  borderRadius: 8, padding: '8px 12px', fontFamily: FORGE.mono, fontSize: 14,
                  color: FORGE.fg, outline: 'none',
                }}
              />
              <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>{habit.type === 'duration' ? 'min' : '×'}</span>
            </div>
          )}

          {/* Note */}
          {!isFuture && (editingNote || selectedLog?.note) ? (
            <div style={{ marginTop: 10 }}>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onBlur={handleSaveNote}
                onKeyDown={e => e.key === 'Enter' && handleSaveNote()}
                placeholder="Note du jour…"
                autoFocus={editingNote}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${FORGE.line}`,
                  borderRadius: 8, padding: '8px 12px', fontFamily: FORGE.mono, fontSize: 12,
                  color: FORGE.fg, outline: 'none',
                }}
              />
            </div>
          ) : !isFuture ? (
            <div onClick={() => setEditingNote(true)} style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, cursor: 'pointer' }}>+ ajouter une note</div>
          ) : null}
        </ForgeBox>

        {/* Heatmap */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>13 semaines</span>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>{totalDone} faites</span>
        </div>
        <ForgeBox accent={color} pad={10}>
          <div style={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
            {Array.from({ length: numWeeks }, (_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {rows.map((row, r) => {
                  const cell = row[w]
                  if (!cell) return <div key={r} style={{ width: 9, height: 9 }} />
                  const isDone = !!cell.log?.done
                  const isToday = cell.date === today
                  const isSel = cell.date === selectedDate
                  return (
                    <div key={r}
                      onClick={() => cell.date <= today && selectDate(cell.date)}
                      style={{
                        width: 9, height: 9, borderRadius: 1.5,
                        background: isDone ? `color-mix(in oklch, ${color} 70%, #060812)` : isToday ? `${color}22` : 'rgba(255,255,255,0.04)',
                        boxShadow: isSel ? `0 0 0 1.5px ${FORGE.yellow}, 0 0 6px ${FORGE.yellow}88` : isDone ? `0 0 4px ${color}66` : 'none',
                        border: isToday && !isSel ? `1px solid ${color}66` : 'none',
                        cursor: cell.date <= today ? 'pointer' : 'default',
                      }} />
                  )
                })}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 8, fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: `color-mix(in oklch, ${color} 70%, #060812)`, display: 'inline-block' }} />fait</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}44`, display: 'inline-block' }} />aujourd'hui</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: 'rgba(255,255,255,0.04)', display: 'inline-block' }} />manqué</span>
          </div>
        </ForgeBox>

        {/* Chart for duration/count */}
        {showChart && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
              <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>
                {habit.type === 'duration' ? 'Durée' : 'Répétitions'} · 30 j
              </span>
            </div>
            <ForgeBox accent={color}>
              {(() => {
                const vals = last30.map(l => l.value || 0)
                const maxV = Math.max(...vals, 1)
                const W = 300, H = 60
                const pts = vals.map((v, i) => {
                  const x = (i / Math.max(vals.length - 1, 1)) * W
                  const y = H - (v / maxV) * (H - 8) - 4
                  return `${x},${y}`
                })
                const poly = pts.join(' L')
                const area = `M${pts[0]} L${poly} L${W},${H} L0,${H} Z`
                return (
                  <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`det-g-${id}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor={color} stopOpacity="0.55" />
                        <stop offset="1" stopColor={color} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#det-g-${id})`} />
                    <polyline points={pts.join(' ')} stroke={color} strokeWidth="1.8" fill="none" style={{ filter: `drop-shadow(0 0 4px ${color}cc)` }} />
                  </svg>
                )
              })()}
            </ForgeBox>
          </>
        )}

        {/* Journal */}
        {journal.length > 0 && (
          <>
            <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase', padding: '0 2px' }}>Journal</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {journal.map((l) => (
                <ForgeBox key={l.id} pad={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 3, height: 26, background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}aa`, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>
                        {fmtValue(l) || '✓'}
                        {l.note && <span style={{ color: FORGE.fgDim, fontWeight: 400, marginLeft: 6 }}>· {l.note}</span>}
                      </div>
                      <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 2 }}>{fmtDate(l.date)}</div>
                    </div>
                    <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.green, fontWeight: 600 }}>+{l.xp_earned}<span style={{ color: FORGE.fgFaint, fontSize: 9, marginLeft: 2 }}>XP</span></div>
                  </div>
                </ForgeBox>
              ))}
            </div>
          </>
        )}

        {journal.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>
            Aucune séance enregistrée — commence aujourd'hui !
          </div>
        )}
      </div>
      <Gesture />
    </div>
  )
}
