import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const DAYS_HDR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const FR_MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function cellBg(pct) {
  if (pct === null || pct === undefined) return 'rgba(255,255,255,0.025)'
  if (pct === 0) return `${FORGE.fire}15`
  return `color-mix(in oklch, ${FORGE.cyan} ${25 + pct * 55}%, ${FORGE.bg})`
}

export default function MonthView() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [refDate, setRefDate] = useState(today.slice(0, 7) + '-01')
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.getMonth(refDate).then(d => { setData(d); setSelected(null) }).catch(console.error)
  }, [refDate])

  function shiftMonth(delta) {
    const [y, m] = refDate.slice(0, 7).split('-').map(Number)
    const nd = new Date(Date.UTC(y, m - 1 + delta, 1))
    setRefDate(nd.toISOString().slice(0, 10).slice(0, 7) + '-01')
  }

  if (!data) {
    return (
      <div style={{ flex: 1, background: FORGE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>CHARGEMENT…</div>
      </div>
    )
  }

  const { year, month, days } = data
  const monthName = `${FR_MONTHS[month - 1]} ${year}`

  const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7
  const gridCells = []
  for (let i = 0; i < firstDow; i++) gridCells.push(null)
  for (const d of days) gridCells.push(d)

  const elapsed = days.filter(d => d.date <= today && d.total > 0)
  const avgPct = elapsed.length ? Math.round(elapsed.reduce((s, d) => s + d.completion, 0) / elapsed.length) : 0
  const perfectDays = elapsed.filter(d => d.completion === 100).length

  const selDay = selected ? data.habits.reduce((out, h) => {
    const log = h.logs.find(l => l.date === selected)
    if (log?.done) out.push({ name: h.name, color: h.color })
    return out
  }, []) : []

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        title={monthName}
        sub="vue mois"
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <span onClick={() => shiftMonth(-1)} style={{ fontFamily: FORGE.mono, fontSize: 16, color: FORGE.fgDim, cursor: 'pointer' }}>‹</span>
            <span onClick={() => shiftMonth(+1)} style={{ fontFamily: FORGE.mono, fontSize: 16, color: FORGE.fgDim, cursor: 'pointer' }}>›</span>
          </div>
        }
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Sem.', path: '/semaine', active: false }, { label: 'Mois', path: '/mois', active: true }].map(s => (
            <div key={s.label} onClick={() => s.path && navigate(s.path)}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, textAlign: 'center', background: s.active ? FORGE.surface : 'transparent', border: s.active ? `1px solid ${FORGE.lineHot}` : `1px solid ${FORGE.line}`, color: s.active ? FORGE.fg : FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 11, fontWeight: 500, position: 'relative', cursor: 'pointer' }}>
              {s.active && <div style={{ position: 'absolute', top: -1, left: 6, right: 6, height: 1, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}` }} />}
              {s.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
          <ForgeBox accent={FORGE.cyan} glow={FORGE.cyan} pad={12}>
            <ForgeTag color={FORGE.cyan}>Moyenne · mois</ForgeTag>
            <div style={{ marginTop: 8, fontFamily: FORGE.sans, fontSize: 46, fontWeight: 700, letterSpacing: -1.8, lineHeight: 0.95, color: FORGE.fg, textShadow: `0 0 16px ${FORGE.cyan}88` }}>
              {avgPct}<span style={{ fontSize: 20, color: FORGE.fgDim, fontWeight: 500 }}>%</span>
            </div>
          </ForgeBox>
          <ForgeBox accent={FORGE.yellow} glow={FORGE.yellow} pad={12}>
            <ForgeTag color={FORGE.yellow}>★ J. parfaits</ForgeTag>
            <div style={{ marginTop: 8, fontFamily: FORGE.sans, fontSize: 36, fontWeight: 700, color: FORGE.yellow, letterSpacing: -1.2, lineHeight: 1, textShadow: `0 0 12px ${FORGE.yellow}aa` }}>{perfectDays}</div>
            <div style={{ marginTop: 4, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>sur {elapsed.length} j écoulés</div>
          </ForgeBox>
        </div>

        <ForgeBox accent={FORGE.blue}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {DAYS_HDR.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 0.5 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {gridCells.map((dd, i) => {
              if (!dd) return <div key={i} style={{ aspectRatio: '1', borderRadius: 6 }} />
              const isToday = dd.date === today
              const isSel   = dd.date === selected
              const pct = dd.completion !== null ? dd.completion / 100 : null
              return (
                <div key={i} onClick={() => setSelected(dd.date === selected ? null : dd.date)}
                  style={{ aspectRatio: '1', borderRadius: 6, background: cellBg(pct), border: isSel ? `1.5px solid ${FORGE.yellow}` : isToday ? `1.5px solid ${FORGE.cyan}` : 'none', boxShadow: isSel ? `0 0 10px ${FORGE.yellow}aa` : isToday ? `0 0 10px ${FORGE.cyan}aa` : 'none', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 3, cursor: 'pointer' }}>
                  <span style={{ fontFamily: FORGE.mono, fontSize: 9.5, fontWeight: 600, color: pct === null ? FORGE.fgFaint : (pct ?? 0) > 0.5 ? '#001022' : FORGE.fg }}>{new Date(dd.date + 'T00:00:00').getDate()}</span>
                  {pct === 1 && <span style={{ position: 'absolute', bottom: 3, left: 4, fontSize: 9, color: '#001022' }}>✦</span>}
                </div>
              )
            })}
          </div>
        </ForgeBox>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>complétion par jour</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint }}>
            <span>0</span>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: cellBg(p) }} />
            ))}
            <span>1</span>
          </div>
        </div>

        {selected && (
          <>
            <div style={{ marginTop: 4, padding: '0 4px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>
              {new Date(selected + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <ForgeBox accent={FORGE.cyan}>
              {selDay.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selDay.map(({ name, color }) => (
                    <span key={name} style={{ fontFamily: FORGE.mono, fontSize: 10, color: '#001022', fontWeight: 600, background: color, padding: '4px 8px', borderRadius: 5, boxShadow: `0 0 6px ${color}66` }}>✓ {name}</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>Aucune habitude complétée ce jour</div>
              )}
            </ForgeBox>
          </>
        )}
      </div>
      <ForgeNav />
      <Gesture />
    </div>
  )
}
