import { FORGE } from '../theme'

export default function ForgeTag({ children, color = FORGE.blue, weight = 500 }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 4,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color, fontFamily: FORGE.mono, fontSize: 9.5, fontWeight: weight,
      letterSpacing: 1, textTransform: 'uppercase',
    }}>{children}</span>
  )
}
