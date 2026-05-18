import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'

const CLASSES = [
  { cl: 'Le Sage',       desc: 'Mental · méditation, lecture, gratitude', g: '☾', color: FORGE.cyan,   active: true },
  { cl: "L'Athlète",     desc: 'Forme · run, force, mobilité',            g: '➤', color: FORGE.fire },
  { cl: 'Le Bâtisseur',  desc: 'Pro · deep work, focus, lecture',         g: '◧', color: FORGE.purple },
]

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.blueGlow}55`} br={`${FORGE.fireGlow}33`} />
      <Status dark />

      <div style={{ flex: 1, padding: '24px 22px 22px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* page dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 0, 0, 0].map((v, i) => (
            <div key={i} style={{
              width: v ? 22 : 6, height: 4, borderRadius: 2,
              background: v ? FORGE.blue : 'rgba(255,255,255,0.18)',
              boxShadow: v ? `0 0 6px ${FORGE.blue}` : 'none',
            }} />
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <ForgeTag color={FORGE.cyan}>chapitre I · bienvenue</ForgeTag>
        </div>

        <div style={{ marginTop: 12, fontFamily: FORGE.sans, fontSize: 38, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.02, color: FORGE.fg }}>
          Tes habitudes,<br />
          <span style={{ color: FORGE.cyan, textShadow: `0 0 20px ${FORGE.cyan}66` }}>ton perso.</span>
        </div>

        <div style={{ marginTop: 14, color: FORGE.fgDim, fontSize: 14, lineHeight: 1.5, maxWidth: 280 }}>
          Tu commences en <span style={{ color: FORGE.fg, fontWeight: 600 }}>Niveau 1</span>. Chaque habitude tenue te fait gagner de l&rsquo;XP et débloque des titres.
        </div>

        {/* Class cards */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 2, textTransform: 'uppercase' }}>
            Choisis ta classe de départ
          </div>

          {CLASSES.map((c) => (
            <ForgeBox key={c.cl} accent={c.active ? c.color : undefined} glow={c.active ? c.color : undefined} pad={0}
              style={{ borderColor: c.active ? `${c.color}88` : FORGE.line, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ width: 3, background: c.color, opacity: c.active ? 1 : 0.4, boxShadow: c.active ? `0 0 6px ${c.color}` : 'none' }} />
                <div style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: 22 }}>{c.g}</div>
                <div style={{ flex: 1, padding: '10px 12px' }}>
                  <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 14, color: FORGE.fg }}>{c.cl}</div>
                  <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, marginTop: 2 }}>{c.desc}</div>
                </div>
                <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 999, border: `1.5px solid ${c.active ? c.color : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.active && <div style={{ width: 6, height: 6, borderRadius: 999, background: c.color, boxShadow: `0 0 6px ${c.color}` }} />}
                  </div>
                </div>
              </div>
            </ForgeBox>
          ))}

          <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textAlign: 'center', marginTop: 4 }}>(Pourra évoluer plus tard)</div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ height: 50, marginTop: 18, position: 'relative' }}>
          <div
            onClick={() => navigate('/dashboard')}
            style={{
              height: '100%', borderRadius: 12, cursor: 'pointer',
              background: `linear-gradient(135deg, ${FORGE.blue}, ${FORGE.cyan})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FORGE.sans, fontWeight: 700, color: '#001022', fontSize: 15, letterSpacing: 0.5,
              boxShadow: `0 0 24px ${FORGE.cyan}55`,
              userSelect: 'none',
            }}
          >COMMENCER →</div>
        </div>
        <div style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textAlign: 'center', letterSpacing: 0.5 }}>
          Aucun compte · juste toi
        </div>
      </div>
    </div>
  )
}
