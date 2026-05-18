import { FORGE } from '../theme'

export default function Status({ time = '8:24', dark = false, color }) {
  const c = color || (dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)')
  return (
    <div style={{
      height: 28, padding: '0 18px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      color: c, fontSize: 11,
      fontFamily: FORGE.mono,
      fontWeight: 500, letterSpacing: 0.2,
      flexShrink: 0,
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span>● ● ●</span>
        <span style={{ width: 16, height: 8, border: `1.2px solid ${c}`, borderRadius: 1.5, display: 'inline-block' }} />
      </span>
    </div>
  )
}
