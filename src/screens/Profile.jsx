import { useNavigate } from 'react-router-dom'
import { FORGE } from '../theme'
import Status from '../components/Status'
import ForgeBox from '../components/ForgeBox'
import ForgeTag from '../components/ForgeTag'
import ForgeGauge from '../components/ForgeGauge'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const BADGES = [
  { name: '7 j méditation',  g: '☾', c: FORGE.cyan,   rare: 'common', unlocked: true },
  { name: '30 j méditation',  g: '☾', c: FORGE.cyan,   rare: 'rare',   unlocked: true },
  { name: 'Marathon mental',  g: '◆', c: FORGE.purple, rare: 'epic',   pct: 0.77 },
  { name: 'Hydraté',          g: '◯', c: FORGE.blue,   rare: 'common', unlocked: true },
  { name: '100 km',           g: '➤', c: FORGE.fire,   rare: 'rare',   pct: 0.42 },
  { name: 'Lève-tôt 100',    g: '☀', c: FORGE.yellow, rare: 'epic',   unlocked: true },
  { name: 'No sucre 30 j',   g: '⊘', c: FORGE.green,  rare: 'rare',   pct: 0.20 },
  { name: 'Niveau 15',        g: '★', c: FORGE.yellow, rare: 'legend', pct: 0.62 },
]

const RARITY_COLOR = { common: FORGE.cyan, rare: FORGE.blue, epic: FORGE.purple, legend: FORGE.yellow }

const TITLES = [
  { t: 'Constant',    c: FORGE.cyan,   active: true,  buff: '+5% XP quotidien' },
  { t: 'Lève-tôt',   c: FORGE.yellow, active: false, buff: '+10% si < 8h' },
  { t: 'Marathonien', c: FORGE.fire,  active: false, buff: '+15% XP sport' },
]

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula tl={`${FORGE.purple}33`} br={`${FORGE.cyan}22`} />
      <Status dark />

      {/* Hero */}
      <div style={{ padding: '8px 14px 14px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, ${FORGE.blueGlow}, ${FORGE.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontFamily: FORGE.sans, fontSize: 24, boxShadow: `0 0 20px ${FORGE.blueGlow}88, inset 0 0 0 1.5px rgba(255,255,255,0.18)` }}>R</div>
            <div style={{ position: 'absolute', bottom: -4, right: -4, padding: '2px 7px', borderRadius: 5, background: FORGE.bg, border: `1px solid ${FORGE.lineHot}`, fontFamily: FORGE.mono, fontSize: 10, fontWeight: 700, color: FORGE.cyan, letterSpacing: 0.5, boxShadow: `0 0 8px ${FORGE.cyan}33` }}>LV 12</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: FORGE.fg, letterSpacing: -0.4, lineHeight: 1.05 }}>Romain</div>
            <div style={{ marginTop: 4 }}><ForgeTag color={FORGE.cyan}>« Constant » · Sage</ForgeTag></div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {/* XP bar */}
        <ForgeBox accent={FORGE.purple} glow={FORGE.purple}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.purple}>LV 12 → 13</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10.5, color: FORGE.fgDim }}>1 840 / 2 500 XP</span>
          </div>
          <div style={{ marginTop: 10 }}><ForgeGauge value={0.74} color={FORGE.purple} segments height={10} /></div>
          <div style={{ marginTop: 6, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint }}>660 XP avant LV 13 · +5% XP grâce au titre « Constant »</div>
        </ForgeBox>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { k: 'Série',  v: '23', sub: 'j',   c: FORGE.fire,  glow: FORGE.fireGlow, prefix: '🔥' },
            { k: 'Record', v: '34', sub: 'j',   c: FORGE.fg },
            { k: 'Badges', v: '14', sub: '/32', c: FORGE.yellow, glow: FORGE.yellow },
          ].map((s) => (
            <ForgeBox key={s.k} pad={10} glow={s.glow} accent={s.c === FORGE.fg ? undefined : s.c}>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.k}</div>
              <div style={{ marginTop: 4, fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: s.c, letterSpacing: -0.6, lineHeight: 1, textShadow: s.glow ? `0 0 10px ${s.glow}aa` : 'none' }}>
                {s.prefix && <span style={{ fontSize: 13, marginRight: 2 }}>{s.prefix}</span>}{s.v}<span style={{ fontSize: 11, color: FORGE.fgDim, fontWeight: 500, marginLeft: 2 }}>{s.sub}</span>
              </div>
            </ForgeBox>
          ))}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 2px 0' }}>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1.5 }}>Hauts faits · 14/32</span>
          <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.cyan, cursor: 'pointer' }}>VOIR TOUT →</span>
        </div>
        <ForgeBox accent={FORGE.yellow} pad={12}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {BADGES.map((b) => {
              const rc = RARITY_COLOR[b.rare]
              return (
                <div key={b.name} style={{ textAlign: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 10, background: b.unlocked ? `radial-gradient(circle, ${b.c}28, ${b.c}08)` : 'rgba(255,255,255,0.03)', border: b.unlocked ? `1.5px solid ${b.c}aa` : `1.5px dashed ${FORGE.line}`, color: b.unlocked ? b.c : FORGE.fgFaint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative', boxShadow: b.unlocked ? `0 0 10px ${b.c}55` : 'none' }}>
                    {b.g}
                    {b.unlocked && <div style={{ position: 'absolute', top: 3, right: 4, width: 5, height: 5, borderRadius: '50%', background: rc, boxShadow: `0 0 4px ${rc}` }} />}
                    {!b.unlocked && b.pct !== undefined && (
                      <div style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                        <div style={{ width: `${b.pct * 100}%`, height: '100%', background: b.c, boxShadow: `0 0 4px ${b.c}` }} />
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 5, fontFamily: FORGE.mono, fontSize: 8.5, color: b.unlocked ? FORGE.fg : FORGE.fgFaint, lineHeight: 1.2, letterSpacing: 0.3 }}>{b.name}</div>
                </div>
              )
            })}
          </div>
          {/* Rarity legend */}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${FORGE.lineSoft}`, display: 'flex', gap: 10, justifyContent: 'center', fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint }}>
            {[['common', FORGE.cyan], ['rare', FORGE.blue], ['epic', FORGE.purple], ['legend', FORGE.yellow]].map(([n, c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 4px ${c}`, display: 'inline-block' }} />{n}
              </span>
            ))}
          </div>
        </ForgeBox>

        {/* Titles */}
        <ForgeBox accent={FORGE.cyan}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <ForgeTag color={FORGE.cyan}>Titres débloqués</ForgeTag>
            <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>3 actifs · 4 verrouillés</span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TITLES.map((t) => (
              <div key={t.t} style={{ padding: '6px 10px', borderRadius: 6, background: t.active ? `${t.c}22` : 'rgba(255,255,255,0.03)', border: `1px solid ${t.active ? t.c : FORGE.line}`, boxShadow: t.active ? `0 0 8px ${t.c}55` : 'none', cursor: 'pointer' }}>
                <div style={{ fontFamily: FORGE.mono, fontSize: 10, fontWeight: 700, color: t.active ? t.c : FORGE.fgDim, letterSpacing: 1, textTransform: 'uppercase' }}>« {t.t} »</div>
                <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, marginTop: 2 }}>{t.buff}</div>
              </div>
            ))}
          </div>
        </ForgeBox>

        {/* Weekly quest */}
        <ForgeBox accent={FORGE.yellow} glow={FORGE.yellow}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <ForgeTag color={FORGE.yellow}>★ Quête hebdo</ForgeTag>
              <div style={{ marginTop: 6, fontFamily: FORGE.sans, fontSize: 15, color: FORGE.fg, fontWeight: 700 }}>Semaine parfaite</div>
              <div style={{ marginTop: 2, fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgDim }}>4 / 7 jours · plus que 3</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FORGE.sans, fontSize: 22, fontWeight: 700, color: FORGE.yellow, lineHeight: 1, textShadow: `0 0 12px ${FORGE.yellow}aa` }}>+200</div>
              <div style={{ fontFamily: FORGE.mono, fontSize: 9, color: FORGE.fgFaint, letterSpacing: 1 }}>XP REWARD</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
            {[1, 1, 1, 1, 0, 0, 0].map((v, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: v ? FORGE.yellow : 'rgba(255,255,255,0.06)', boxShadow: v ? `0 0 6px ${FORGE.yellow}88` : 'none' }} />
            ))}
          </div>
        </ForgeBox>

        {/* Settings link */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div onClick={() => navigate('/notifications')} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: FORGE.surface, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, cursor: 'pointer', textAlign: 'center' }}>🔔 Notifications</div>
          <div onClick={() => navigate('/stats')} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: FORGE.surface, border: `1px solid ${FORGE.line}`, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, cursor: 'pointer', textAlign: 'center' }}>📊 Stats</div>
        </div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}
