import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const DOW = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function weekOf(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay() || 7
  const mon = new Date(d)
  mon.setDate(d.getDate() - dow + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(mon); dd.setDate(mon.getDate() + i)
    return dd.toISOString().slice(0, 10)
  })
}

function isoWeekNum(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const dayOfYear = Math.floor((d - startOfYear) / 86400000)
  return Math.ceil((dayOfYear + startOfYear.getUTCDay() + 1) / 7)
}

function Cell({ v, color }) {
  if (v === 'done')  return <div style={{ width: 22, height: 22, borderRadius: 5, background: color, boxShadow: `0 0 6px ${color}66` }} />
  if (v === 'today') return <div style={{ width: 22, height: 22, borderRadius: 5, background: `${color}1a`, border: `1.5px dashed ${color}88` }} />
  return <div style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: `1px solid ${FORGE.line}` }} />
}

export default function WeekView() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [refDate, setRefDate] = useState(today)
  const [data, setData] = useState(null)

  useEffect(() => {
    api.getWeek(refDate).then(setData).catch(console.error)
  }, [refDate])

  function shiftWeek(delta) {
    const d = new Date(refDate + 'T00:00:00')
    d.setDate(d.getDate() + delta * 7)
    setRefDate(d.toISOString().slice(0, 10))
  }

  if (!data) {
    return (
      <div style={{ flex: 1, background: FORGE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>CHARGEMENT…</div>
      </div>
    )
  }

  const { days, habits } = data
  const dayLabels = days.map(d => DOW[new Date(d + 'T00:00:00').getDay()])
  const weekNum = isoWeekNum(days[0])
  const rangeLabel = `${days[0].slice(8)} — ${days[6].slice(8)} ${new Date(days[6] + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}`

  const totals = days.map(d =>
    habits.reduce((n, h) => n + (h.days.find(dd => dd.date === d)?.done ? 1 : 0), 0)
  )
  const totalDone   = totals.reduce((a, b) => a + b, 0)
  const totalSlots  = habits.length * 6
  const weekPct     = totalSlots ? Math.round((totalDone / totalSlots) * 100) : 0

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        title={`Semaine ${weekNum}`}
        sub={rangeLabel}
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span onClick={() => shiftWeek(-1)} style={{ fontFamily: FORGE.mono, fontSize: 16, color: FORGE.fgDim, cursor: 'pointer' }}>‹</span>
            <span onClick={() => shiftWeek(+1)} style={{ fontFamily: FORGE.mono, fontSize: 16, color: FORGE.fgDim, cursor: 'pointer' }}>›</span>
          </div>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Sem.', path: '/semaine', active: true }, { label: 'Mois', path: '/mois', active: false }].map(s => (
            <div key={s.label} onClick={() => s.path && navigate(s.path)}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, textAlign: 'center', background: s.active ? FORGE.surface : 'transparent', border: s.active ? `1px solid ${FORGE.lineHot}` : `1px solid ${FORGE.line}`, color: s.active ? FORGE.fg : FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 11, fontWeight: 500, position: 'relative', cursor: 'pointer' }}>
              {s.active && <div style={{ position: 'absolute', top: -1, left: 6, right: 6, height: 1, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}` }} />}
              {s.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Done',    v: String(totalDone),           c: FORGE.fg },
            { k: 'Manqué',  v: String(Math.max(0, totalSlots - totalDone)), c: FORGE.fgDim },
            { k: 'Sem. %',  v: `${weekPct}%`,               c: FORGE.cyan, glow: FORGE.cyan },
          ].map(s => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c === FORGE.fgDim ? undefined : s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1 }}>{s.k}</div>
              <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: s.c, marginTop: 4, letterSpacing: -0.6, textShadow: s.glow ? `0 0 10px ${s.glow}aa` : 'none' }}>{s.v}</div>
            </ForgeBox>
          ))}
        </div>

        <ForgeBox accent={FORGE.blue}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.blue}>Complétion · semaine</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fg, fontWeight: 600 }}>{weekPct}%</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={weekPct / 100} color={FORGE.blue} segments height={8} /></div>
        </ForgeBox>

        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <div />
            {dayLabels.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 10, color: days[i] === today ? FORGE.fire : FORGE.fgFaint, fontWeight: days[i] === today ? 700 : 500 }}>{d}</div>
            ))}
          </div>
          {habits.map((h, hi) => (
            <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', alignItems: 'center', gap: 4, padding: '6px 0', borderTop: hi > 0 ? `1px solid ${FORGE.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: h.color, boxShadow: `0 0 6px ${h.color}aa` }} />
                <div style={{ fontFamily: FORGE.sans, fontSize: 11, fontWeight: 600, color: FORGE.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
              </div>
              {days.map((d, di) => {
                const log = h.days.find(dd => dd.date === d)
                const v = log?.done ? 'done' : d === today ? 'today' : 'miss'
                return <div key={di} style={{ display: 'flex', justifyContent: 'center' }}><Cell v={v} color={h.color} /></div>
              })}
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 4, paddingTop: 10, marginTop: 6, borderTop: `1.5px solid ${FORGE.lineHot}`, alignItems: 'center' }}>
            <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>TOTAL</div>
            {totals.map((v, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 11, color: days[i] === today ? FORGE.fgFaint : FORGE.cyan, fontWeight: 700 }}>
                {days[i] === today ? '—' : `${v}/${habits.length}`}
              </div>
            ))}
          </div>
        </ForgeBox>

        <div style={{ display: 'flex', gap: 14, padding: '0 4px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}`, display: 'inline-block' }} /> fait</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: `${FORGE.cyan}1a`, border: `1.5px dashed ${FORGE.cyan}88`, display: 'inline-block' }} /> aujourd&rsquo;hui</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: `1px solid ${FORGE.line}`, display: 'inline-block' }} /> manqué</span>
        </div>
      </div>
      <ForgeNav />
      <Gesture />
    </div>
  )
}
