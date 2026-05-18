import { FORGE } from '../theme'

export default function ForgeBox({ children, style, glow, accent, pad = 14, corners = true }) {
  return (
    <div style={{
      position: 'relative',
      background: FORGE.surface,
      border: `1px solid ${FORGE.line}`,
      borderRadius: 12,
      padding: pad,
      boxShadow: glow
        ? `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 28px ${glow}22`
        : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      overflow: 'hidden',
      ...style,
    }}>
      {corners && accent && (
        <>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 1, background: accent, opacity: 0.7 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: 10, background: accent, opacity: 0.7 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 10, height: 1, background: accent, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1, height: 10, background: accent, opacity: 0.5 }} />
        </>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}
