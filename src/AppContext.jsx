import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from './api'

const Ctx = createContext(null)

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function AppProvider({ children }) {
  const [date, setDate]           = useState(todayISO)
  const [dashboard, setDashboard] = useState(null)
  const [profile, setProfile]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const loadDashboard = useCallback(async (d = date) => {
    try {
      setLoading(true)
      const data = await api.getDashboard(d)
      setDashboard(data)
      setProfile(data.profile)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [date])

  // Au démarrage : sync Notion en silencieux puis charge le dashboard
  useEffect(() => {
    async function init() {
      try { await api.syncNotion() } catch (_) { /* silencieux */ }
      await loadDashboard(date)
    }
    init()
  }, [date])

  const toggleLog = useCallback(async (habitId, done, xpPerSession, source) => {
    if (source === 'notion') {
      if (done) await api.doneNotionTask(habitId)
      // décocher non supporté pour les tâches Notion
    } else if (source === 'todo') {
      if (done) await api.doneTodo(habitId)
      // décocher non supporté pour les tâches ToDo
    } else {
      await api.upsertLog(habitId, {
        date,
        done: done ? 1 : 0,
        xp_earned: done ? xpPerSession : 0,
      })
    }
    await loadDashboard(date)
  }, [date, loadDashboard])

  return (
    <Ctx.Provider value={{ date, setDate, dashboard, profile, loading, error, loadDashboard, toggleLog }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
