import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import { useApp } from '../AppContext'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const ICONS = ['☾', '◯', '➤', '▤', '⊘', '◆', '★', '♥', '⚡', '◎', '✦', '▲']
const COLORS = ['#5dd7ff', '#3aa8ff', '#ff7a1a', '#a47cff', '#4dffa0', '#ffd166', '#ffffff']
const CATEGORIES = ['mental', 'forme', 'pro', 'autre']
const DIFFICULTIES = [
  { level: 1, label: 'Facile',    xp: 10 },
  { level: 2, label: 'Moyen',     xp: 25 },
  { level: 3, label: 'Difficile', xp: 50 },
]

function EditSheet({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit.name)
  const [icon, setIcon] = useState(habit.icon)
  const [color, setColor] = useState(habit.color)
  const [category, setCategory] = useState(habit.category)
  const [xp, setXp] = useState(habit.xp_per_session ?? 25)
  const [showIcons, setShowIcons] = useState(false)
  const [saving, setSaving] = useState(false)

  const activeDiff = DIFFICULTIES.reduce((best, d) =>
    Math.abs(d.xp - xp) < Math.abs(best.xp - xp) ? d : best
  , DIFFICULTIES[1])

  async function save() {
    if (!name.trim() || saving) return
    setSaving(true)
    await onSave(habit.id, { name: name.trim(), icon, color, category, xp_per_session: xp })
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}
      onClick={onCancel}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 430, background: FORGE.surface, borderRadius: '16px 16px 0 0', border: `1px solid ${FORGE.lineHot}`, padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FORGE.sans, fontWeight: 700, fontSize: 16, color: FORGE.fg }}>Modifier l'habitude</div>
          <div onClick={onCancel} style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, cursor: 'pointer' }}>ANNULER</div>
        </div>

        {/* Icon + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => setShowIcons(v => !v)}
            style={{ width: 48, height: 48, borderRadius: 12, background: `${color}22`, border: `1.5px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color, cursor: 'pointer' }}>
            {icon}
          </div>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            maxLength={32}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${FORGE.line}`, borderRadius: 8, padding: '10px 12px', fontFamily: FORGE.sans, fontSize: 15, fontWeight: 600, color: FORGE.fg, outline: 'none' }}
          />
        </div>

        {showIcons && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ICONS.map(ic => (
              <div key={ic} onClick={() => { setIcon(ic); setShowIcons(false) }}
                style={{ width: 36, height: 36, borderRadius: 8, background: icon === ic ? `${color}33` : FORGE.bg, border: `1px solid ${icon === ic ? color : FORGE.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color, cursor: 'pointer' }}>
                {ic}
              </div>
            ))}
          </div>
        )}

        {/* Colors */}
        <div style={{ display: 'flex', gap: 10 }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)}
              style={{ width: 26, height: 26, borderRadius: 999, background: c, border: color === c ? `2px solid ${FORGE.bg}` : '2px solid transparent', boxShadow: color === c ? `0 0 0 2px ${c}, 0 0 8px ${c}aa` : 'none', cursor: 'pointer' }} />
          ))}
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <div key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '6px 12px', borderRadius: 6, cursor: 'pointer', background: category === cat ? `${color}22` : 'transparent', border: `1px solid ${category === cat ? color : FORGE.line}`, fontFamily: FORGE.mono, fontSize: 10, color: category === cat ? color : FORGE.fgDim, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {cat}
            </div>
          ))}
        </div>

        {/* XP / Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0 }}>XP</div>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {DIFFICULTIES.map(d => (
              <div key={d.level} onClick={() => setXp(d.xp)}
                style={{ flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center', cursor: 'pointer', background: activeDiff.level === d.level ? `${FORGE.purple}22` : 'transparent', border: `1px solid ${activeDiff.level === d.level ? FORGE.purple : FORGE.line}`, fontFamily: FORGE.mono, fontSize: 9.5, color: activeDiff.level === d.level ? FORGE.purple : FORGE.fgDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {d.label}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: FORGE.sans, fontWeight: 700, fontSize: 18, color: FORGE.purple, minWidth: 42, textAlign: 'right' }}>+{xp}</div>
        </div>

        <div onClick={save}
          style={{ height: 48, borderRadius: 12, background: name.trim() ? `linear-gradient(135deg, ${FORGE.blue}, ${FORGE.cyan})` : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FORGE.sans, fontWeight: 700, color: name.trim() ? '#001022' : FORGE.fgFaint, fontSize: 14, cursor: name.trim() ? 'pointer' : 'default' }}>
          {saving ? 'SAUVEGARDE…' : 'SAUVEGARDER'}
        </div>
      </div>
    </div>
  )
}

export default function Menu() {
  const navigate = useNavigate()
  const { loadDashboard } = useApp()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  async function loadHabits() {
    // Load active + inactive: fetch active and we'll show them
    const h = await api.getHabits()
    setHabits(h)
    setLoading(false)
  }

  useEffect(() => { loadHabits() }, [])

  async function handleSave(id, data) {
    await api.updateHabit(id, data)
    await Promise.all([loadHabits(), loadDashboard()])
    setEditing(null)
  }

  async function handleArchive(habit) {
    if (!window.confirm(`Archiver « ${habit.name} » ?`)) return
    await api.deleteHabit(habit.id)
    await Promise.all([loadHabits(), loadDashboard()])
  }

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar title="Menu" sub="gérer · réglages" right={null} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>

        {/* Raccourcis */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: '+ Nouvelle habitude', color: FORGE.cyan,   path: '/create' },
            { label: '🔔 Notifications',    color: FORGE.purple, path: '/notifications' },
            { label: '📊 Statistiques',     color: FORGE.blue,   path: '/stats' },
            { label: '👤 Profil',           color: FORGE.fire,   path: '/profil' },
          ].map(item => (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{ padding: '14px 12px', borderRadius: 12, background: FORGE.surface, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 11, color: item.color, cursor: 'pointer', letterSpacing: 0.3 }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Gérer les habitudes */}
        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Mes habitudes
        </div>

        {loading ? (
          <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 11, textAlign: 'center', padding: '20px 0', letterSpacing: 2 }}>CHARGEMENT…</div>
        ) : habits.length === 0 ? (
          <ForgeBox accent={FORGE.blue}>
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '8px 0' }}>
              Aucune habitude — <span onClick={() => navigate('/create')} style={{ color: FORGE.cyan, cursor: 'pointer' }}>créer +</span>
            </div>
          </ForgeBox>
        ) : (
          <ForgeBox accent={FORGE.blue} pad={0}>
            {habits.map((h, i) => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderTop: i > 0 ? `1px solid ${FORGE.lineSoft}` : 'none', gap: 12 }}>
                <div style={{ width: 3, alignSelf: 'stretch', background: h.color, borderRadius: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 20, color: h.color, width: 28, textAlign: 'center', flexShrink: 0 }}>{h.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => navigate(`/habit/${h.id}`)}>
                  <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
                  <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h.category} · {h.type}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <div onClick={() => setEditing(h)}
                    style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.cyan, cursor: 'pointer', padding: '4px 8px', border: `1px solid ${FORGE.cyan}44`, borderRadius: 6 }}>
                    ÉDITER
                  </div>
                  <div onClick={() => handleArchive(h)}
                    style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, cursor: 'pointer', padding: '4px 8px', border: `1px solid ${FORGE.line}`, borderRadius: 6 }}>
                    ⊘
                  </div>
                </div>
              </div>
            ))}
          </ForgeBox>
        )}

        {/* Danger zone */}
        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Réglages</div>
        <ForgeBox accent={FORGE.fire} pad={0}>
          <div onClick={() => navigate('/profil')}
            style={{ padding: '14px 16px', fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fgDim, cursor: 'pointer', borderBottom: `1px solid ${FORGE.lineSoft}` }}>
            Modifier mon profil / classe →
          </div>
          <div onClick={() => { if (window.confirm('Réinitialiser la progression (XP, niveaux) ? Tes habitudes sont conservées.')) { api.updateProfile({ xp: 0, level: 1, xp_next: 500, streak: 0, record_streak: 0 }).then(() => loadDashboard()) } }}
            style={{ padding: '14px 16px', fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fire, cursor: 'pointer', borderBottom: `1px solid ${FORGE.lineSoft}` }}>
            Réinitialiser la progression XP
          </div>
          <div onClick={() => { if (window.confirm('Relancer l\'onboarding ? Ton profil et tes habitudes sont conservés.')) { api.updateProfile({ onboarded: 0 }).then(async () => { await loadDashboard(); navigate('/onboarding') }) } }}
            style={{ padding: '14px 16px', fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fgFaint, cursor: 'pointer' }}>
            Relancer l'onboarding
          </div>
        </ForgeBox>
      </div>

      {editing && (
        <EditSheet
          habit={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <ForgeNav />
      <Gesture />
    </div>
  )
}
