import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import { useApp } from '../AppContext'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'

const CLASSES = [
  { key: 'sage',      label: 'Le Sage',      desc: 'Mental · méditation, lecture, gratitude', g: '☾', color: FORGE.cyan   },
  { key: 'athlete',   label: "L'Athlète",    desc: 'Forme · run, force, mobilité',            g: '➤', color: FORGE.fire   },
  { key: 'builder',   label: 'Le Bâtisseur', desc: 'Pro · deep work, focus, lecture',         g: '◧', color: FORGE.purple },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { loadDashboard } = useApp()
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState('sage')
  const [saving, setSaving] = useState(false)

  async function handleStart() {
    if (!name.trim() || saving) return
    setSaving(true)
    try {
      await api.updateProfile({ name: name.trim(), class: selectedClass })
      await loadDashboard()
      localStorage.setItem('forge_ready', '1')
      navigate('/create')
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  const ready = name.trim().length > 0

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.blueGlow}55`} br={`${FORGE.fireGlow}33`} />
      <Status dark />

      <div style={{ flex: 1, padding: '24px 22px 22px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 0, 0, 0].map((v, i) => (
            <div key={i} style={{ width: v ? 22 : 6, height: 4, borderRadius: 2, background: v ? FORGE.blue : 'rgba(255,255,255,0.18)', boxShadow: v ? `0 0 6px ${FORGE.blue}` : 'none' }} />
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
          Tu commences en <span style={{ color: FORGE.fg, fontWeight: 600 }}>Niveau 1</span>. Chaque habitude tenue te fait gagner de l&rsquo;XP.
        </div>

        {/* Name input */}
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Ton prénom
          </div>
          <div style={{ position: 'relative' }}>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Romain…"
              maxLength={24}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px',
                background: FORGE.surface,
                border: `1.5px solid ${name ? FORGE.cyan + '88' : FORGE.line}`,
                borderRadius: 10,
                fontFamily: FORGE.sans, fontSize: 18, fontWeight: 700,
                color: FORGE.fg,
                outline: 'none',
                boxShadow: name ? `0 0 12px ${FORGE.cyan}22` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            {name && (
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: FORGE.cyan, fontSize: 16 }}>✓</div>
            )}
          </div>
        </div>

        {/* Class cards */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 2, textTransform: 'uppercase' }}>
            Ta classe de départ
          </div>

          {CLASSES.map((c) => {
            const active = selectedClass === c.key
            return (
              <ForgeBox key={c.key} accent={active ? c.color : undefined} glow={active ? c.color : undefined} pad={0}
                style={{ borderColor: active ? `${c.color}88` : FORGE.line, cursor: 'pointer' }}
                onClick={() => setSelectedClass(c.key)}
              >
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div style={{ width: 3, background: c.color, opacity: active ? 1 : 0.4, boxShadow: active ? `0 0 6px ${c.color}` : 'none' }} />
                  <div style={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: 22 }}>{c.g}</div>
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 14, color: FORGE.fg }}>{c.label}</div>
                    <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim, marginTop: 2 }}>{c.desc}</div>
                  </div>
                  <div style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 999, border: `1.5px solid ${active ? c.color : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {active && <div style={{ width: 6, height: 6, borderRadius: 999, background: c.color, boxShadow: `0 0 6px ${c.color}` }} />}
                    </div>
                  </div>
                </div>
              </ForgeBox>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ height: 50, marginTop: 18, position: 'relative' }}>
          <div
            onClick={handleStart}
            style={{
              height: '100%', borderRadius: 12, cursor: ready ? 'pointer' : 'default',
              background: ready ? `linear-gradient(135deg, ${FORGE.blue}, ${FORGE.cyan})` : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FORGE.sans, fontWeight: 700,
              color: ready ? '#001022' : FORGE.fgFaint,
              fontSize: 15, letterSpacing: 0.5,
              boxShadow: ready ? `0 0 24px ${FORGE.cyan}55` : 'none',
              transition: 'all 0.2s',
              userSelect: 'none',
            }}
          >{saving ? 'FORGE EN COURS…' : 'COMMENCER →'}</div>
        </div>
        <div style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textAlign: 'center', letterSpacing: 0.5 }}>
          Aucun compte · juste toi
        </div>
      </div>
    </div>
  )
}
