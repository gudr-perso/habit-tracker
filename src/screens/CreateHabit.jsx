import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'
import ForgeBar from '../components/ForgeBar'

const TEMPLATES = [
  { n: 'Méditer 10m', g: '☾', c: FORGE.cyan },
  { n: 'Eau 2L',      g: '◯', c: FORGE.blue },
  { n: 'Run 5km',     g: '➤', c: FORGE.fire },
  { n: 'Lire 20m',    g: '▤', c: FORGE.purple },
  { n: 'No sucre',    g: '⊘', c: FORGE.green },
]

const COLORS = [FORGE.cyan, FORGE.blue, FORGE.fire, FORGE.purple, FORGE.green, FORGE.yellow, FORGE.fg]

function Field({ label, value, right, valueColor = FORGE.fg }) {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${FORGE.line}` }}>
      <div style={{ width: 92, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ flex: 1, fontFamily: FORGE.sans, fontSize: 13.5, color: valueColor, fontWeight: 500 }}>{value}</div>
      {right}
    </div>
  )
}

export default function CreateHabit() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        back="×"
        onBack={() => navigate(-1)}
        title="Nouvelle habitude"
        right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.cyan, fontWeight: 600, letterSpacing: 1, cursor: 'pointer' }}>SAUVER</span>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Templates */}
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Inspire-toi</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {TEMPLATES.map((t) => (
            <div key={t.n} style={{ minWidth: 84, padding: '8px 6px', borderRadius: 10, background: FORGE.surface, border: `1px solid ${FORGE.line}`, textAlign: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: t.c, opacity: 0.5 }} />
              <div style={{ fontSize: 18, color: t.c, lineHeight: 1 }}>{t.g}</div>
              <div style={{ marginTop: 4, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fg }}>{t.n}</div>
            </div>
          ))}
        </div>

        {/* Name + icon + color */}
        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${FORGE.cyan}, ${FORGE.blueGlow})`, color: '#001022', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: `0 0 20px ${FORGE.cyan}55, inset 0 0 0 1px rgba(255,255,255,0.18)`, flexShrink: 0 }}>☾</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FORGE.sans, fontSize: 20, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.3, borderBottom: `1.5px solid ${FORGE.cyan}88`, paddingBottom: 3 }}>
                Méditer 10 min<span style={{ color: FORGE.cyan, fontWeight: 400 }}>|</span>
              </div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 4, letterSpacing: 0.5 }}>tape pour renommer</div>
            </div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {COLORS.map((c, i) => (
              <div key={c} style={{ width: 26, height: 26, borderRadius: 999, background: c, border: i === 0 ? `2px solid ${FORGE.bg}` : '2px solid transparent', boxShadow: i === 0 ? `0 0 0 2px ${c}, 0 0 8px ${c}aa` : 'none', cursor: 'pointer' }} />
            ))}
          </div>
        </ForgeBox>

        {/* Form fields */}
        <ForgeBox accent={FORGE.blue} pad={0}>
          <Field label="Type"      value="Durée · 10 min"   right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>›</span>} />
          <Field label="Catégorie" value={<ForgeTag color={FORGE.cyan}>Mental</ForgeTag>} right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>›</span>} />
          <Field label="Fréquence" value="Tous les jours"   right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>›</span>} />
          <Field label="Quand"     value="Matin · avant 9h" right={<span style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint }}>›</span>} />
          <Field label="Rappel"
            value={<span style={{ fontFamily: FORGE.mono, color: FORGE.cyan }}>08:00</span>}
            right={
              <div style={{ width: 36, height: 22, borderRadius: 11, background: FORGE.cyan, padding: 2, display: 'flex', justifyContent: 'flex-end', boxShadow: `0 0 8px ${FORGE.cyan}88` }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, background: '#001022' }} />
              </div>
            }
          />
        </ForgeBox>

        {/* XP reward */}
        <ForgeBox accent={FORGE.purple} glow={FORGE.purple}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <ForgeTag color={FORGE.purple}>Récompense</ForgeTag>
              <div style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim }}>Difficulté <span style={{ color: FORGE.fg }}>moyenne</span></div>
              <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                {[1, 1, 0].map((v, i) => (
                  <div key={i} style={{ width: 24, height: 8, borderRadius: 2, background: v ? FORGE.purple : 'rgba(255,255,255,0.07)', boxShadow: v ? `0 0 6px ${FORGE.purple}aa` : 'none' }} />
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FORGE.sans, fontSize: 28, fontWeight: 700, color: FORGE.purple, letterSpacing: -0.8, textShadow: `0 0 14px ${FORGE.purple}aa`, lineHeight: 1 }}>+30</div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1, marginTop: 2 }}>XP / SÉANCE</div>
            </div>
          </div>
        </ForgeBox>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 14px 14px', flexShrink: 0 }}>
        <div style={{ height: 50, borderRadius: 12, background: `linear-gradient(135deg, ${FORGE.blue}, ${FORGE.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FORGE.sans, fontWeight: 700, color: '#001022', fontSize: 15, letterSpacing: 0.5, boxShadow: `0 0 24px ${FORGE.cyan}55`, cursor: 'pointer', userSelect: 'none' }}>
          FORGER L&rsquo;HABITUDE
        </div>
      </div>
    </div>
  )
}
