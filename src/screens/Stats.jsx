import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const HABITS_PERF = [
  { name: 'Méditation', pct: 0.96, color: FORGE.cyan,   n: '29/30' },
  { name: 'Sommeil',    pct: 0.86, color: FORGE.blue,   n: '26/30' },
  { name: 'Eau · 2L',   pct: 0.72, color: FORGE.blue,   n: '21/29' },
  { name: 'No sucre',   pct: 0.66, color: FORGE.green,  n: '20/30' },
  { name: 'Run',        pct: 0.40, color: FORGE.fire,   n: '6/15' },
  { name: 'Deep work',  pct: 0.28, color: FORGE.purple, n: '8/28' },
]

const INSIGHTS = [
  { icon: '↗', color: FORGE.cyan,   title: 'Ton meilleur jour :', em: 'le mercredi', body: '91% en moyenne (vs 67% le dimanche)' },
  { icon: '!',  color: FORGE.fire,   title: 'Run lâché',          em: '4 fois ce mois', body: "Réduire l'objectif à 3×/semaine ?" },
  { icon: '✦', color: FORGE.yellow, title: '3 j avant un',       em: 'nouveau record', body: 'Méditation · actuel 23 · best 26' },
]

export default function Stats() {
  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar title="Stats" sub="insights" right={<span style={{ color: FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 16 }}>⌕</span>} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* Range tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {['7 j', '30 j', '90 j', '1 an'].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '7px 10px', borderRadius: 8, textAlign: 'center', background: i === 1 ? FORGE.surface : 'transparent', border: i === 1 ? `1px solid ${FORGE.lineHot}` : `1px solid ${FORGE.line}`, color: i === 1 ? FORGE.fg : FORGE.fgDim, fontFamily: FORGE.mono, fontSize: 11, fontWeight: 500, position: 'relative', cursor: 'pointer' }}>
              {i === 1 && <div style={{ position: 'absolute', top: -1, left: 6, right: 6, height: 1, background: FORGE.cyan, boxShadow: `0 0 4px ${FORGE.cyan}` }} />}
              {s}
            </div>
          ))}
        </div>

        {/* Hero metric */}
        <ForgeBox accent={FORGE.cyan} glow={FORGE.cyan}>
          <ForgeTag color={FORGE.cyan}>Taux de complétion · 30 j</ForgeTag>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
            <div style={{ fontFamily: FORGE.sans, fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 0.95, color: FORGE.fg, textShadow: `0 0 18px ${FORGE.cyan}99` }}>
              78<span style={{ fontSize: 24, color: FORGE.fgDim }}>%</span>
            </div>
            <ForgeTag color={FORGE.green}>↗ +6 pts</ForgeTag>
          </div>
          <div style={{ marginTop: 10 }}>
            <svg width="100%" height="64" viewBox="0 0 300 64" preserveAspectRatio="none">
              <defs>
                <linearGradient id="stats-g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={FORGE.cyan} stopOpacity="0.55" />
                  <stop offset="1" stopColor={FORGE.cyan} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,46 L20,42 L40,46 L60,34 L80,36 L100,30 L120,26 L140,29 L160,18 L180,24 L200,14 L220,18 L240,11 L260,14 L280,8 L300,12 L300,64 L0,64 Z" fill="url(#stats-g)" />
              <path d="M0,46 L20,42 L40,46 L60,34 L80,36 L100,30 L120,26 L140,29 L160,18 L180,24 L200,14 L220,18 L240,11 L260,14 L280,8 L300,12" stroke={FORGE.cyan} strokeWidth="1.8" fill="none" style={{ filter: `drop-shadow(0 0 4px ${FORGE.cyan}cc)` }} />
            </svg>
          </div>
        </ForgeBox>

        {/* Per habit */}
        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Performance par habitude</div>
        <ForgeBox accent={FORGE.blue} pad={12}>
          {HABITS_PERF.map((r, i) => (
            <div key={r.name} style={{ padding: '8px 0', borderTop: i > 0 ? `1px solid ${FORGE.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, background: r.color, boxShadow: `0 0 4px ${r.color}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13, color: FORGE.fg }}>{r.name}</span>
                </div>
                <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>
                  {r.n} · <span style={{ color: r.color, fontWeight: 600 }}>{Math.round(r.pct * 100)}%</span>
                </span>
              </div>
              <div style={{ marginTop: 5 }}><ForgeGauge value={r.pct} color={r.color} height={4} /></div>
            </div>
          ))}
        </ForgeBox>

        {/* Insights */}
        <div style={{ padding: '4px 2px 0', fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, letterSpacing: 1.5, textTransform: 'uppercase' }}>Insights</div>
        {INSIGHTS.map((c, i) => (
          <ForgeBox key={i} accent={c.color}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${c.color}22`, border: `1px solid ${c.color}66`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, boxShadow: `0 0 8px ${c.color}55`, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FORGE.sans, fontWeight: 600, fontSize: 13.5, color: FORGE.fg }}>{c.title} <span style={{ color: c.color }}>{c.em}</span></div>
                <div style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim, marginTop: 4, lineHeight: 1.4 }}>{c.body}</div>
              </div>
            </div>
          </ForgeBox>
        ))}
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
