import { FORGE } from '../theme'

export default function ForgeNebula({ tl, br }) {
  const t = tl || `${FORGE.blueGlow}22`
  const b = br || `${FORGE.fireGlow}1a`
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `radial-gradient(ellipse 60% 30% at 15% 0%, ${t}, transparent), radial-gradient(ellipse 50% 25% at 100% 100%, ${b}, transparent)`,
      zIndex: 0,
    }} />
  )
}
