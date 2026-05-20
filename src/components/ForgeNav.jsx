import { useNavigate, useLocation } from 'react-router-dom'
import { FORGE } from '../theme'

const ITEMS = [
  { id: 'home',    label: 'Jour',  path: '/dashboard' },
  { id: 'week',    label: 'Sem.',  path: '/semaine' },
  { id: 'todo',    label: 'ToDo',  path: '/todo' },
  { id: 'stats',   label: 'Stats', path: '/stats' },
  { id: 'profile', label: 'Profil',path: '/profil' },
  { id: 'menu',    label: '⋯',     path: '/menu' },
]

export default function ForgeNav() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  const activeId = ITEMS.find(it =>
    pathname === it.path || pathname.startsWith(it.path + '/')
  )?.id ?? 'home'

  return (
    <div style={{
      display: 'flex', gap: 4, padding: '7px 10px',
      borderTop: `1px solid ${FORGE.line}`,
      background: FORGE.bg,
      position: 'relative', flexShrink: 0,
    }}>
      {ITEMS.map((it) => (
        <div
          key={it.id}
          onClick={() => navigate(it.path)}
          style={{
            flex: 1, height: 32, borderRadius: 8,
            background: it.id === activeId ? FORGE.surface : 'transparent',
            border: it.id === activeId ? `1px solid ${FORGE.lineHot}` : '1px solid transparent',
            color: it.id === activeId ? FORGE.fg : FORGE.fgDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FORGE.mono, fontSize: 10, fontWeight: 500,
            position: 'relative', cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {it.id === activeId && (
            <div style={{
              position: 'absolute', top: -1, left: 6, right: 6, height: 1,
              background: it.id === 'todo' ? FORGE.todo : FORGE.blue,
              boxShadow: `0 0 6px ${it.id === 'todo' ? FORGE.todo : FORGE.blue}`,
            }} />
          )}
          {it.label}
        </div>
      ))}
    </div>
  )
}
