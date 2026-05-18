import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import Gesture from '../components/Gesture'

function Toggle({ on = true, color = FORGE.cyan }) {
  return (
    <div style={{ width: 36, height: 22, borderRadius: 11, background: on ? color : 'rgba(255,255,255,0.08)', border: on ? 'none' : `1px solid ${FORGE.line}`, padding: 2, display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', boxShadow: on ? `0 0 8px ${color}88` : 'none', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: 999, background: on ? '#001022' : FORGE.fgDim }} />
    </div>
  )
}

function Row({ title, sub, on, right, color }) {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${FORGE.lineSoft}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13.5, color: FORGE.fg }}>{title}</div>
        {sub && <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
      {on !== undefined && <Toggle on={on} color={color} />}
    </div>
  )
}

const PER_HABIT = [
  { name: 'Méditation', g: '☾', color: FORGE.cyan,   time: '08:00',               on: true  },
  { name: 'Eau · 2L',   g: '◯', color: FORGE.blue,   time: '10:00 · 14:00 · 17:00', on: true },
  { name: 'Run',        g: '➤', color: FORGE.fire,   time: 'aucun',               on: false },
  { name: 'Lecture',    g: '▤', color: FORGE.purple, time: '21:00',               on: true  },
]

export default function Notifications() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar back="←" onBack={() => navigate(-1)} title="Notifications" right={null} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Global</div>
        <ForgeBox accent={FORGE.blue} pad={0}>
          <Row title="Notifications activées" sub="autorise rappels & récaps" on={true} color={FORGE.cyan} />
          <Row title="Heures silencieuses" sub="22:00 → 07:00" on={true} color={FORGE.purple}
            right={<span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.purple, marginRight: 10, cursor: 'pointer' }}>configurer</span>} />
          <Row title="Son & vibration" sub="discrète" on={true} color={FORGE.cyan} />
        </ForgeBox>

        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Récap quotidien</div>
        <ForgeBox accent={FORGE.cyan} pad={0}>
          <Row title="Récap du matin" sub="« voici ton plan du jour »" on={true} color={FORGE.cyan}
            right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.cyan, marginRight: 10 }}>08:00</span>} />
          <Row title="Récap du soir" sub="« ce que tu as fait aujourd'hui »" on={true} color={FORGE.cyan}
            right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.cyan, marginRight: 10 }}>21:30</span>} />
          <Row title="Série en danger" sub="2 h avant minuit · alerte critique" on={true} color={FORGE.fire} />
        </ForgeBox>

        <div style={{ padding: '4px 2px 0', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Par habitude</span>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.cyan, cursor: 'pointer' }}>TOUT OUVRIR →</span>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          {PER_HABIT.map((h) => (
            <ForgeBox key={h.name} pad={0} accent={h.on ? h.color : undefined}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 3, background: h.color, opacity: h.on ? 1 : 0.3, boxShadow: h.on ? `0 0 6px ${h.color}` : 'none', alignSelf: 'stretch' }} />
                <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.color, fontSize: 18, opacity: h.on ? 1 : 0.5 }}>{h.g}</div>
                <div style={{ flex: 1, padding: '10px 4px' }}>
                  <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>{h.name}</div>
                  <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: h.on ? FORGE.fgDim : FORGE.fgFaint, marginTop: 2 }}>{h.time}</div>
                </div>
                <div style={{ padding: '0 12px' }}><Toggle on={h.on} color={h.color} /></div>
              </div>
            </ForgeBox>
          ))}
        </div>
      </div>
      <Gesture />
    </div>
  )
}
