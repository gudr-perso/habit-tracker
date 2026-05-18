import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import { api } from '../api'
import { useApp } from '../AppContext'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'
import ForgeBar from '../components/ForgeBar'

const TEMPLATES = [
  { name: 'Méditer 10m', icon: '☾', color: '#5dd7ff', category: 'mental', type: 'duration', xp: 30 },
  { name: 'Eau 2L',      icon: '◯', color: '#3aa8ff', category: 'forme',  type: 'count',    xp: 20 },
  { name: 'Run 5km',     icon: '➤', color: '#ff7a1a', category: 'forme',  type: 'boolean',  xp: 50 },
  { name: 'Lire 20m',    icon: '▤', color: '#a47cff', category: 'mental', type: 'duration', xp: 25 },
  { name: 'No sucre',    icon: '⊘', color: '#4dffa0', category: 'mental', type: 'boolean',  xp: 20 },
  { name: 'Deep work',   icon: '◆', color: '#a47cff', category: 'pro',    type: 'duration', xp: 40 },
]

const ICONS = ['☾', '◯', '➤', '▤', '⊘', '◆', '★', '♥', '⚡', '◎', '✦', '▲']
const COLORS = ['#5dd7ff', '#3aa8ff', '#ff7a1a', '#a47cff', '#4dffa0', '#ffd166', '#ffffff']
const CATEGORIES = ['mental', 'forme', 'pro', 'autre']
const TYPES = [
  { key: 'boolean',  label: 'Fait / Pas fait' },
  { key: 'duration', label: 'Durée (minutes)' },
  { key: 'count',    label: 'Répétitions' },
]
const DIFFICULTIES = [
  { level: 1, label: 'Facile',  xp: 10 },
  { level: 2, label: 'Moyen',   xp: 25 },
  { level: 3, label: 'Difficile', xp: 50 },
]

function Pill({ active, color, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
      background: active ? `${color}22` : 'transparent',
      border: `1px solid ${active ? color : FORGE.line}`,
      fontFamily: FORGE.mono, fontSize: 10, fontWeight: 600,
      color: active ? color : FORGE.fgDim,
      textTransform: 'uppercase', letterSpacing: 0.8,
      boxShadow: active ? `0 0 8px ${color}44` : 'none',
      transition: 'all 0.15s',
    }}>{children}</div>
  )
}

export default function CreateHabit() {
  const navigate = useNavigate()
  const { loadDashboard } = useApp()

  const [form, setForm] = useState({
    name: '', icon: '☾', color: '#5dd7ff',
    category: 'mental', type: 'boolean',
    reminder_time: '', xp_per_session: 25,
  })
  const [difficulty, setDifficulty] = useState(2)
  const [saving, setSaving] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function applyTemplate(t) {
    setForm({ name: t.name, icon: t.icon, color: t.color, category: t.category, type: t.type, reminder_time: '', xp_per_session: t.xp })
    const d = DIFFICULTIES.find(d => d.xp === t.xp) || DIFFICULTIES[1]
    setDifficulty(d.level)
  }

  function setDiff(d) {
    setDifficulty(d.level)
    set('xp_per_session', d.xp)
  }

  async function handleSave() {
    if (!form.name.trim() || saving) return
    setSaving(true)
    try {
      await api.createHabit({ ...form, name: form.name.trim(), reminder_time: form.reminder_time || null })
      await loadDashboard()
      localStorage.setItem('forge_ready', '1')
      navigate('/dashboard')
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  const ready = form.name.trim().length > 0
  const activeColor = form.color

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar
        back="×"
        onBack={() => navigate(-1)}
        title="Nouvelle habitude"
        right={
          <span
            onClick={handleSave}
            style={{ fontFamily: FORGE.mono, fontSize: 11, color: ready ? FORGE.cyan : FORGE.fgFaint, fontWeight: 600, letterSpacing: 1, cursor: ready ? 'pointer' : 'default' }}
          >SAUVER</span>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>

        {/* Templates */}
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Inspire-toi</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {TEMPLATES.map((t) => (
            <div key={t.name} onClick={() => applyTemplate(t)}
              style={{ minWidth: 84, padding: '8px 6px', borderRadius: 10, background: FORGE.surface, border: `1px solid ${FORGE.line}`, textAlign: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: t.color, opacity: 0.6 }} />
              <div style={{ fontSize: 18, color: t.color, lineHeight: 1 }}>{t.icon}</div>
              <div style={{ marginTop: 4, fontFamily: FORGE.mono, fontSize: 9.5, color: FORGE.fg }}>{t.name}</div>
            </div>
          ))}
        </div>

        {/* Name + icon */}
        <ForgeBox accent={activeColor}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              onClick={() => setShowIconPicker(v => !v)}
              style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${activeColor}cc, ${activeColor}44)`, color: '#001022', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: `0 0 20px ${activeColor}55, inset 0 0 0 1px rgba(255,255,255,0.18)`, flexShrink: 0, cursor: 'pointer' }}
            >{form.icon}</div>
            <div style={{ flex: 1 }}>
              <input
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nom de l'habitude…"
                maxLength={32}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'transparent', border: 'none', outline: 'none',
                  borderBottom: `1.5px solid ${activeColor}88`,
                  fontFamily: FORGE.sans, fontSize: 18, fontWeight: 700,
                  color: FORGE.fg, paddingBottom: 3,
                }}
              />
              <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 4, letterSpacing: 0.5 }}>
                {showIconPicker ? 'choisir une icône ↑' : 'tap icône pour changer'}
              </div>
            </div>
          </div>

          {/* Icon picker */}
          {showIconPicker && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICONS.map(ic => (
                <div key={ic} onClick={() => { set('icon', ic); setShowIconPicker(false) }}
                  style={{ width: 38, height: 38, borderRadius: 10, background: form.icon === ic ? `${activeColor}33` : FORGE.surface, border: `1px solid ${form.icon === ic ? activeColor : FORGE.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: activeColor, cursor: 'pointer' }}>
                  {ic}
                </div>
              ))}
            </div>
          )}

          {/* Color swatches */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {COLORS.map((c) => (
              <div key={c} onClick={() => set('color', c)}
                style={{ width: 26, height: 26, borderRadius: 999, background: c, border: form.color === c ? `2px solid ${FORGE.bg}` : '2px solid transparent', boxShadow: form.color === c ? `0 0 0 2px ${c}, 0 0 8px ${c}aa` : 'none', cursor: 'pointer', flexShrink: 0 }} />
            ))}
          </div>
        </ForgeBox>

        {/* Category */}
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Catégorie</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Pill key={cat} active={form.category === cat} color={activeColor} onClick={() => set('category', cat)}>{cat}</Pill>
          ))}
        </div>

        {/* Type */}
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Type de suivi</div>
        <ForgeBox accent={FORGE.blue} pad={0}>
          {TYPES.map((t, i) => (
            <div key={t.key} onClick={() => set('type', t.key)}
              style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderTop: i > 0 ? `1px solid ${FORGE.line}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, border: `1.5px solid ${form.type === t.key ? activeColor : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {form.type === t.key && <div style={{ width: 6, height: 6, borderRadius: 999, background: activeColor, boxShadow: `0 0 6px ${activeColor}` }} />}
              </div>
              <div style={{ fontFamily: FORGE.sans, fontSize: 13.5, color: form.type === t.key ? FORGE.fg : FORGE.fgDim, fontWeight: form.type === t.key ? 600 : 400 }}>{t.label}</div>
            </div>
          ))}
        </ForgeBox>

        {/* Reminder */}
        <div style={{ padding: '0 2px', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Rappel (optionnel)</div>
        <ForgeBox accent={form.reminder_time ? activeColor : undefined} pad={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="time"
              value={form.reminder_time}
              onChange={e => set('reminder_time', e.target.value)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: FORGE.mono, fontSize: 22, fontWeight: 700,
                color: form.reminder_time ? activeColor : FORGE.fgFaint,
                cursor: 'pointer', flex: 1,
              }}
            />
            {form.reminder_time && (
              <span onClick={() => set('reminder_time', '')} style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, cursor: 'pointer' }}>effacer</span>
            )}
          </div>
        </ForgeBox>

        {/* Difficulty / XP */}
        <ForgeBox accent={FORGE.purple} glow={FORGE.purple}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <ForgeTag color={FORGE.purple}>Récompense XP</ForgeTag>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                {DIFFICULTIES.map(d => (
                  <Pill key={d.level} active={difficulty === d.level} color={FORGE.purple} onClick={() => setDiff(d)}>{d.label}</Pill>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FORGE.sans, fontSize: 28, fontWeight: 700, color: FORGE.purple, letterSpacing: -0.8, textShadow: `0 0 14px ${FORGE.purple}aa`, lineHeight: 1 }}>+{form.xp_per_session}</div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1, marginTop: 2 }}>XP / SÉANCE</div>
            </div>
          </div>
        </ForgeBox>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 14px 14px', flexShrink: 0 }}>
        <div
          onClick={handleSave}
          style={{
            height: 50, borderRadius: 12, cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(135deg, ${FORGE.blue}, ${FORGE.cyan})` : 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FORGE.sans, fontWeight: 700,
            color: ready ? '#001022' : FORGE.fgFaint,
            fontSize: 15, letterSpacing: 0.5,
            boxShadow: ready ? `0 0 24px ${FORGE.cyan}55` : 'none',
            transition: 'all 0.2s', userSelect: 'none',
          }}
        >{saving ? 'FORGE EN COURS…' : "FORGER L'HABITUDE"}</div>
      </div>
    </div>
  )
}
