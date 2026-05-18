import { FORGE } from '../theme'

export default function ForgeBar({ back, onBack, title, sub, tag, right }) {
  return (
    <div style={{ padding: '2px 14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {back && (
          <span
            onClick={onBack}
            style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16, cursor: 'pointer' }}
          >{back}</span>
        )}
        {tag}
        {title && (
          <div>
            {sub && <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>{sub}</div>}
            <div style={{ fontFamily: FORGE.sans, fontSize: 18, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.2, lineHeight: 1.1, marginTop: sub ? 1 : 0 }}>{title}</div>
          </div>
        )}
      </div>
      {right !== undefined ? right : <span style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16 }}>⋯</span>}
    </div>
  )
}
