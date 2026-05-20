import { useState, useEffect, useCallback } from 'react'
import { FORGE } from '../theme'
import { useApp } from '../AppContext'
import { api } from '../api'
import Status from '../components/Status'
import ForgeBar from '../components/ForgeBar'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

function todayISO() { return new Date().toISOString().slice(0, 10) }

function fmtDue(due) {
  if (!due) return null
  const today = todayISO()
  if (due === today) return { label: 'Aujourd\'hui', color: FORGE.todo }
  if (due < today) {
    const d = new Date(due + 'T00:00:00')
    const label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    return { label: `⚠ En retard · ${label}`, color: FORGE.fire }
  }
  const d = new Date(due + 'T00:00:00')
  const label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return { label: `◆ ${label}`, color: FORGE.fgDim }
}

function Section({ title, color, tasks, onDone, onDelete, toggling, deleting }) {
  if (!tasks.length) return null
  return (
    <div>
      <div style={{ padding: '4px 2px 6px', fontFamily: FORGE.mono, fontSize: 9.5, color, textTransform: 'uppercase', letterSpacing: 1.5 }}>{title}</div>
      <ForgeBox accent={color} pad={0}>
        {tasks.map((t, i) => {
          const fmt = fmtDue(t.due_date)
          const isToggling = toggling === t.id
          const isDeleting = deleting === t.id
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderTop: i > 0 ? `1px solid ${FORGE.lineSoft}` : 'none', gap: 10, opacity: (isToggling || isDeleting) ? 0.5 : 1, transition: 'opacity 0.15s' }}>
              {/* Coche */}
              <div onClick={() => !isToggling && onDone(t)}
                style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${FORGE.todo}66`, background: `${FORGE.todo}11`, color: FORGE.todo, fontSize: 16, cursor: 'pointer' }}>
                {isToggling ? '…' : '○'}
              </div>
              {/* Nom + date */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                {fmt && <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: fmt.color, marginTop: 2 }}>{fmt.label}</div>}
              </div>
              {/* Supprimer */}
              <div onClick={() => !isDeleting && onDelete(t)}
                style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, cursor: 'pointer', padding: '4px 8px', border: `1px solid ${FORGE.line}`, borderRadius: 6 }}>
                {isDeleting ? '…' : '⊘'}
              </div>
            </div>
          )
        })}
      </ForgeBox>
    </div>
  )
}

export default function Todo() {
  const { loadDashboard } = useApp()
  const [todos,    setTodos]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [newName,  setNewName]  = useState('')
  const [newDate,  setNewDate]  = useState('')
  const [adding,   setAdding]   = useState(false)
  const [toggling, setToggling] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { setTodos(await api.getTodos()) } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd() {
    if (!newName.trim() || adding) return
    setAdding(true)
    await api.createTodo({ name: newName.trim(), due_date: newDate || null })
    setNewName('')
    setNewDate('')
    await load()
    setAdding(false)
  }

  async function handleDone(t) {
    setToggling(t.id)
    try {
      await api.doneTodo(t.id)
      await Promise.all([load(), loadDashboard()])
    } catch (_) {}
    setToggling(null)
  }

  async function handleDelete(t) {
    if (!window.confirm(`Supprimer « ${t.name} » ?`)) return
    setDeleting(t.id)
    await api.deleteTodo(t.id)
    await load()
    setDeleting(null)
  }

  const today = todayISO()
  const overdue  = todos.filter(t => t.due_date && t.due_date < today)
  const todayArr = todos.filter(t => t.due_date === today)
  const upcoming = todos.filter(t => t.due_date && t.due_date > today)
  const noDate   = todos.filter(t => !t.due_date)

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.todo}22`} br={`${FORGE.todo}11`} />
      <Status dark />
      <ForgeBar title="Tâches" sub="ToDo · +10 XP" right={null} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Quick-add */}
          <ForgeBox accent={FORGE.todo}>
            <ForgeTag color={FORGE.todo}>◆ Nouvelle tâche</ForgeTag>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Nom de la tâche…"
                maxLength={64}
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${FORGE.line}`, borderRadius: 8, padding: '9px 12px', fontFamily: FORGE.sans, fontSize: 14, fontWeight: 600, color: FORGE.fg, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = FORGE.todo + '88'}
                onBlur={e  => e.target.style.borderColor = FORGE.line}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${FORGE.line}`, borderRadius: 8, padding: '8px 12px', fontFamily: FORGE.mono, fontSize: 12, color: newDate ? FORGE.fg : FORGE.fgFaint, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
                  onFocus={e => e.target.style.borderColor = FORGE.todo + '88'}
                  onBlur={e  => e.target.style.borderColor = FORGE.line}
                />
                <div onClick={handleAdd}
                  style={{ padding: '8px 18px', borderRadius: 8, cursor: newName.trim() ? 'pointer' : 'default', background: newName.trim() ? `${FORGE.todo}22` : 'rgba(255,255,255,0.03)', border: `1px solid ${newName.trim() ? FORGE.todo + '66' : FORGE.line}`, fontFamily: FORGE.mono, fontSize: 12, fontWeight: 700, color: newName.trim() ? FORGE.todo : FORGE.fgFaint, whiteSpace: 'nowrap', opacity: adding ? 0.5 : 1 }}>
                  {adding ? '…' : '+ ADD'}
                </div>
              </div>
            </div>
          </ForgeBox>

          {loading ? (
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, textAlign: 'center', padding: '20px 0', letterSpacing: 2 }}>CHARGEMENT…</div>
          ) : todos.length === 0 ? (
            <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, textAlign: 'center', padding: '24px 0' }}>
              Aucune tâche · commence par en ajouter une ✦
            </div>
          ) : (
            <>
              <Section title="En retard" color={FORGE.fire}  tasks={overdue}  onDone={handleDone} onDelete={handleDelete} toggling={toggling} deleting={deleting} />
              <Section title="Aujourd'hui" color={FORGE.todo} tasks={todayArr} onDone={handleDone} onDelete={handleDelete} toggling={toggling} deleting={deleting} />
              <Section title="À venir"   color={FORGE.fgDim} tasks={upcoming} onDone={handleDone} onDelete={handleDelete} toggling={toggling} deleting={deleting} />
              <Section title="Sans date" color={FORGE.fgFaint} tasks={noDate} onDone={handleDone} onDelete={handleDelete} toggling={toggling} deleting={deleting} />
            </>
          )}

        </div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
