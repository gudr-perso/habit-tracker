import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const DAYS_HDR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const CALENDAR = Array.from({ length: 35 }, (_, i) => {
  const d = i - 2
  if (d < 1 || d > 31) return null
  if (d === 18) return { d, pct: 0.5, today: true }
  if (d > 18) return { d, pct: null }
  return { d, pct: ((d * 17 + 3) % 11) / 10 }
})

function cellBg(pct) {
  if (pct === null) return 'rgba(255,255,255,0.025)'
  if (pct === 0)   return `${FORGE.fire}15`
  return `color-mix(in oklch, ${FORGE.cyan} ${25 + pct * 55}%, ${FORGE.bg})`
}

export default function MonthView() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        title="Mai 2026"
        sub="vue mois"
        right={<span style={{ fontFamily: FORGE.mono, fontSize: 13, color: FORGE.fgDim }}>‹ ›</span>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Range tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'Sem.', path: '/semaine', active: false },
            { label: 'Mois', path: '/mois',    active: true },
            { label: 'Année',path: null,        active: false },
          ].map((s) => (
            <div key={s.label}
              onClick={() => s.path && navigate(s.path)}
              style={{ flex: 1, padding: '7px 10px', borderRadius: 8, textAlign: 'center', background: s.active ? FORGE.surface : 'transparent', border: s.active ? `1px solid ${FORGE.lineHot}` : `1px solid ${FORGE.line}`, color: s.active ? FORGE.fg : FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 11, fontWeight: 500, position: 'relative', cursor: s.path ? 'pointer' : 'default' }}>
              {s.active && <div style={{ position: 'absolute', top: -1, left: 6, right: 6, height: 1, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}` }} />}
              {s.label}
            </div>
          ))}
        </div>

        {/* Top metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
          <ForgeBox accent={FORGE.cyan} glow={FORGE.cyan} pad={12}>
            <ForgeTag color={FORGE.cyan}>Moyenne · mois</ForgeTag>
            <div style={{ marginTop: 8, fontFamily: FORGE.sans, fontSize: 46, fontWeight: 700, letterSpacing: -1.8, lineHeight: 0.95, color: FORGE.fg, textShadow: `0 0 16px ${FORGE.cyan}88` }}>
              74<span style={{ fontSize: 20, color: FORGE.fgDim, fontWeight: 500 }}>%</span>
            </div>
            <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>+6 pts vs avril</div>
          </ForgeBox>
          <ForgeBox accent={FORGE.yellow} glow={FORGE.yellow} pad={12}>
            <ForgeTag color={FORGE.yellow}>★ J. parfaits</ForgeTag>
            <div style={{ marginTop: 8, fontFamily: FORGE.sans, fontSize: 36, fontWeight: 700, color: FORGE.yellow, letterSpacing: -1.2, lineHeight: 1, textShadow: `0 0 12px ${FORGE.yellow}aa` }}>23</div>
            <div style={{ marginTop: 4, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>sur 18 j écoulés</div>
          </ForgeBox>
        </div>

        {/* Calendar grid */}
        <ForgeBox accent={FORGE.blue}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {DAYS_HDR.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 0.5 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {CALENDAR.map((dd, i) => {
              if (!dd) return <div key={i} style={{ aspectRatio: '1', borderRadius: 6 }} />
              return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: cellBg(dd.pct), border: dd.today ? `1.5px solid ${FORGE.cyan}` : 'none', boxShadow: dd.today ? `0 0 10px ${FORGE.cyan}aa` : dd.pct === 1 ? `0 0 6px ${FORGE.cyan}66` : 'none', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 3 }}>
                  <span style={{ fontFamily: FORGE.mono, fontSize: 9.5, fontWeight: 600, color: dd.pct === null ? FORGE.fgFaint : dd.pct > 0.5 ? '#001022' : FORGE.fg }}>{dd.d}</span>
                  {dd.pct === 1 && <span style={{ position: 'absolute', bottom: 3, left: 4, fontSize: 9, color: '#001022' }}>✦</span>}
                </div>
              )
            })}
          </div>
        </ForgeBox>

        {/* Legend */}
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

        {/* Selected day card */}
        <div style={{ marginTop: 4, padding: '0 4px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Sam 17 mai · jour parfait</div>
        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[['Méditer', FORGE.cyan], ['Eau', FORGE.blue], ['Run', FORGE.fire], ['Lecture', FORGE.purple], ['No sucre', FORGE.green], ['Sommeil', FORGE.cyan]].map(([n, c]) => (
              <span key={n} style={{ fontFamily: FORGE.mono, fontSize: 10, color: '#001022', fontWeight: 600, background: c, padding: '4px 8px', borderRadius: 5, boxShadow: `0 0 6px ${c}66` }}>✓ {n}</span>
            ))}
          </div>
        </ForgeBox>
      </div>
      <ForgeNav />
      <Gesture />
    </div>
  )
}
