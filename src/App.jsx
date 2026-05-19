import { Routes, Route, Navigate } from 'react-router-dom'
import { FORGE } from './theme'
import { useApp } from './AppContext'
import Onboarding    from './screens/Onboarding'
import CreateHabit   from './screens/CreateHabit'
import Dashboard     from './screens/Dashboard'
import HabitDetail   from './screens/HabitDetail'
import WeekView      from './screens/WeekView'
import MonthView     from './screens/MonthView'
import Stats         from './screens/Stats'
import Profile       from './screens/Profile'
import Notifications from './screens/Notifications'
import Menu          from './screens/Menu'
import Badges        from './screens/Badges'

function SmartRedirect() {
  const { loading, profile } = useApp()
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FORGE.mono, color: FORGE.fgDim, fontSize: 12, letterSpacing: 2 }}>FORGE…</div>
      </div>
    )
  }
  return <Navigate to={profile?.onboarded ? '/dashboard' : '/onboarding'} replace />
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100dvh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 430, height: '100%', background: FORGE.bg, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/"              element={<SmartRedirect />} />
          <Route path="/onboarding"    element={<Onboarding />} />
          <Route path="/create"        element={<CreateHabit />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/habit/:id"     element={<HabitDetail />} />
          <Route path="/semaine"       element={<WeekView />} />
          <Route path="/mois"          element={<MonthView />} />
          <Route path="/stats"         element={<Stats />} />
          <Route path="/profil"        element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/menu"          element={<Menu />} />
          <Route path="/badges"        element={<Badges />} />
        </Routes>
      </div>
    </div>
  )
}
