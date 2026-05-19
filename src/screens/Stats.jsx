import { useState, useEffect } from 'react'
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

const RANGES = [
  { label: '7 j',  days: 7 },
  { label: '30 j', days: 30 },
  { label: '90 j', days: 90 },
  { label: '1 an', days: 365 },
]

export default function Stats() {
  const [rangeIdx, setRangeIdx] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    api.getStats(RANGES[rangeIdx].days, today).then(setData).catch(console.error)
  }, [rangeIdx])

  if (!data) {
    return (
      <div style={{ flex: 1, background: FORGE.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>CHARGEMENT…</div>
      </div>
    )
  }

  const { globalPct, perHabit, dailyChart } = data
  const maxPts = Math.max(...dailyChart.map(d => d.pct), 1)
  const chartW = 300, chartH = 64

  function pctToY(pct) {
    return chartH - (pct / maxPts) * (chartH - 8) - 4
  }

  const points = dailyChart.map((d, i) => {
    const x = (i / Math.max(dailyChart.length - 1, 1)) * chartW
    const y = pctToY(d.pct)
    return `${x},${y}`
  })
  const polyline = points.join(' L')
  const area = `M${points[0]} L${polyline} L${chartW},${chartH} L0,${chartH} Z`

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar title="Stats" sub="insights" right={<span style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16 }}>⌕</span>} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {RANGES.map((r, i) => (
            <div key={r.label}
              onClick={() => setRangeIdx(i)}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, textAlign: 'center', background: i === rangeIdx ? FORGE.surface : 'transparent', border: i === rangeIdx ? `1px solid ${FORGE.lineHot}` : `1px solid ${FORGE.line}`, color: i === rangeIdx ? FORGE.fg : FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 11, fontWeight: 500, position: 'relative', cursor: 'pointer' }}>
              {i === rangeIdx && <div style={{ position: 'absolute', top: -1, left: 6, right: 6, height: 1, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}` }} />}
              {r.label}
            </div>
          ))}
        </div>

        <ForgeBox accent={FORGE.cyan} glow={FORGE.cyan}>
          <ForgeTag color={FORGE.cyan}>Taux de complétion · {RANGES[rangeIdx].label}</ForgeTag>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
            <div style={{ fontFamily: FORGE.sans, fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 0.95, color: FORGE.fg, textShadow: `0 0 18px ${FORGE.cyan}99` }}>
              {globalPct}<span style={{ fontSize: 24, color: FORGE.fgDim }}>%</span>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="stats-g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={FORGE.cyan} stopOpacity="0.55" />
                  <stop offset="1" stopColor={FORGE.cyan} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#stats-g)" />
              <polyline points={points.join(' ')} stroke={FORGE.cyan} strokeWidth="1.8" fill="none" style={{ filter: `drop-shadow(0 0 4px ${FORGE.cyan}cc)` }} />
            </svg>
          </div>
        </ForgeBox>

        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Performance par habitude</div>
        <ForgeBox accent={FORGE.blue} pad={12}>
          {perHabit.map((r, i) => (
            <div key={r.id} style={{ padding: '8px 0', borderTop: i > 0 ? `1px solid ${FORGE.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, background: r.color, boxShadow: `0 0 4px ${r.color}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>{r.name}</span>
                </div>
                <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
                  {r.done}/{r.total} · <span style={{ color: r.color, fontWeight: 600 }}>{Math.round(r.pct * 100)}%</span>
                </span>
              </div>
              <div style={{ marginTop: 5 }}><ForgeGauge value={r.pct} color={r.color} height={4} /></div>
            </div>
          ))}
          {perHabit.length === 0 && (
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '12px 0' }}>Aucune donnée</div>
          )}
        </ForgeBox>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
