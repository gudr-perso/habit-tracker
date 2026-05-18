export default function Gesture({ color = 'rgba(255,255,255,0.35)' }) {
  return (
    <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 92, height: 4, borderRadius: 2, background: color }} />
    </div>
  )
}
