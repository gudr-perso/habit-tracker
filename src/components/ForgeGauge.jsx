export default function ForgeGauge({ value, color, height = 8, segments = false }) {
  return (
    <div style={{
      height, position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}30`,
      borderRadius: 4,
    }}>
      {segments && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 9px, rgba(0,0,0,0.35) 9px, rgba(0,0,0,0.35) 10px)',
        }} />
      )}
      <div style={{
        width: `${value * 100}%`, height: '100%',
        background: `linear-gradient(90deg, ${color}aa, ${color})`,
        boxShadow: `0 0 10px ${color}88, inset 0 0 4px ${color}66`,
      }} />
    </div>
  )
}
