import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const HABITS = [
  { name: 'Méditer',  color: FORGE.cyan,   row: [1, 1, 1, 1, 1, 0, 2] },
  { name: 'Eau 2L',   color: FORGE.blue,   row: [1, 1, 0, 1, 1, 1, 2] },
  { name: 'Run',      color: FORGE.fire,   row: [0, 0, 1, 0, 0, 0, 2] },
  { name: 'Lecture',  color: FORGE.purple, row: [1, 1, 1, 1, 0, 1, 2] },
  { name: 'No sucre', color: FORGE.green,  row: [1, 0, 1, 1, 1, 1, 2] },
  { name: 'Sommeil',  color: FORGE.cyan,   row: [1, 1, 1, 0, 1, 1, 2] },
]

function Cell({ v, color }) {
  if (v === 1) return <div style={{ width: 22, height: 22, borderRadius: 5, background: color, boxShadow: `0 0 6px ${color}66` }} />
  if (v === 2) return <div style={{ width: 22, height: 22, borderRadius: 5, background: `${color}1a`, border: `1.5px dashed ${color}88` }} />
  return <div style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,0.03)', border: `1px solid ${FORGE.line}` }} />
}

export default function WeekView() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        title="Semaine 20"
        sub="12 — 18 mai"
        right={<span style={{ fontFamily: FORGE.mono, fontSize: 13, color: FORGE.fgDim }}>‹ ›</span>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Range tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { label: 'Sem.', path: '/semaine', active: true },
            { label: 'Mois', path: '/mois',    active: false },
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

        {/* Top stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Done',    v: '28',   c: FORGE.fg },
            { k: 'Manqué',  v: '6',    c: FORGE.fgDim },
            { k: 'XP sem.', v: '+760', c: FORGE.cyan, glow: FORGE.cyan },
          ].map((s) => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c === FORGE.fgDim ? undefined : s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1 }}>{s.k}</div>
              <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: s.c, marginTop: 4, letterSpacing: -0.6, textShadow: s.glow ? `0 0 10px ${s.glow}aa` : 'none' }}>{s.v}</div>
            </ForgeBox>
          ))}
        </div>

        {/* Completion bar */}
        <ForgeBox accent={FORGE.blue}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.blue}>Complétion · semaine</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fg, fontWeight: 600 }}>82%</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={0.82} color={FORGE.blue} segments height={8} /></div>
          <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fgFaint }}>Meilleure semaine du mois</div>
        </ForgeBox>

        {/* Grid */}
        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 10, color: i === 6 ? FORGE.fire : FORGE.fgFaint, fontWeight: i === 6 ? 700 : 500 }}>{d}</div>
            ))}
          </div>
          {HABITS.map((h, i) => (
            <div key={h.name} style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', alignItems: 'center', gap: 4, padding: '6px 0', borderTop: i > 0 ? `1px solid ${FORGE.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: h.color, boxShadow: `0 0 6px ${h.color}aa` }} />
                <div style={{ fontFamily: FORGE.sans, fontSize: 11, fontWeight: 600, color: FORGE.fg }}>{h.name}</div>
              </div>
              {h.row.map((v, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'center' }}><Cell v={v} color={h.color} /></div>
              ))}
            </div>
          ))}
          {/* Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 4, paddingTop: 10, marginTop: 6, borderTop: `1.5px solid ${FORGE.lineHot}`, alignItems: 'center' }}>
            <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1, textTransform: 'uppercase' }}>TOTAL</div>
            {[5, 4, 5, 4, 4, 4, '—'].map((v, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: FORGE.mono, fontSize: 11, color: typeof v === 'number' ? FORGE.cyan : FORGE.fgFaint, fontWeight: 700 }}>
                {typeof v === 'number' ? `${v}/6` : v}
              </div>
            ))}
          </div>
        </ForgeBox>

        {/* Legend */}
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
