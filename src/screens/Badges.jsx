import { useState, useEffect } from 'react'
import { FORGE } from '../theme'
import { api } from '../api'
import { BADGES, BADGE_CATEGORIES } from '../lib/badges'
import Status from '../components/Status'
import ForgeBar from '../components/ForgeBar'
import ForgeNebula from '../components/ForgeNebula'
import ForgeNav from '../components/ForgeNav'
import Gesture from '../components/Gesture'

const RARITY = {
  common:  { color: FORGE.cyan,   label: 'Commun'    },
  rare:    { color: FORGE.blue,   label: 'Rare'      },
  epic:    { color: FORGE.purple, label: 'Épique'    },
  legend:  { color: FORGE.yellow, label: 'Légendaire'},
  special: { color: FORGE.fire,   label: 'Spécial'   },
}

function fmtDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Badges() {
  const [unlockedMap, setUnlockedMap] = useState({})
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    api.getBadges().then(rows => {
      const map = {}
      for (const r of rows) map[r.key] = r.unlocked_at
      setUnlockedMap(map)
      setLoading(false)
    })
  }, [])

  const totalUnlocked = Object.keys(unlockedMap).length

  return (
    <div style={{ flex: 1, background: FORGE.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ForgeNebula />
      <Status dark />
      <ForgeBar title="Hauts faits" sub={loading ? '…' : `${totalUnlocked} / ${BADGES.length} débloqués`} right={null} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {BADGE_CATEGORIES.map(cat => {
            const catBadges = BADGES.filter(b => b.cat === cat.key)
            const catUnlocked = catBadges.filter(b => unlockedMap[b.key]).length
            return (
              <div key={cat.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, padding: '0 2px' }}>
                  <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, textTransform: 'uppercase', letterSpacing: 1.5 }}>{cat.label}</span>
                  <span style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint }}>{catUnlocked}/{catBadges.length}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {catBadges.map(badge => {
                    const unlockedAt = unlockedMap[badge.key]
                    const r = RARITY[badge.rarity] || RARITY.common
                    return (
                      <BadgeCard key={badge.key} badge={badge} unlockedAt={unlockedAt} rarityColor={r.color} />
                    )
                  })}
                </div>
              </div>
            )
          })}

        </div>
      </div>

      <ForgeNav />
      <Gesture />
    </div>
  )
}

function BadgeCard({ badge, unlockedAt, rarityColor }) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        style={{
          borderRadius: 12,
          border: `1px solid ${unlockedAt ? rarityColor + '88' : FORGE.line}`,
          background: unlockedAt ? `${rarityColor}12` : FORGE.surface,
          boxShadow: unlockedAt ? `0 0 10px ${rarityColor}33` : 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '10px 6px', gap: 6, cursor: 'pointer',
          opacity: unlockedAt ? 1 : 0.4,
          transition: 'all 0.15s',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {unlockedAt && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)` }} />
        )}
        <div style={{ fontSize: 26, lineHeight: 1, filter: unlockedAt ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
        <div style={{ fontFamily: FORGE.mono, fontSize: 8.5, fontWeight: 700, color: unlockedAt ? rarityColor : FORGE.fgFaint, textAlign: 'center', lineHeight: 1.3, letterSpacing: 0.2 }}>
          {badge.name}
        </div>
        {!unlockedAt && (
          <div style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 9, color: FORGE.fgFaint, opacity: 0.5 }}>🔒</div>
        )}
      </div>

      {showDetail && (
        <BadgeDetail badge={badge} unlockedAt={unlockedAt} rarityColor={rarityColor} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}

function BadgeDetail({ badge, unlockedAt, rarityColor, onClose }) {
  const r = RARITY[badge.rarity] || RARITY.common
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '0 24px' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 340, background: FORGE.surface, borderRadius: 20, border: `1px solid ${unlockedAt ? rarityColor + '88' : FORGE.line}`, boxShadow: unlockedAt ? `0 0 30px ${rarityColor}44` : 'none', padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
      >
        <div style={{ width: 72, height: 72, borderRadius: 18, background: unlockedAt ? `${rarityColor}22` : FORGE.bg, border: `2px solid ${unlockedAt ? rarityColor + '88' : FORGE.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, filter: unlockedAt ? 'none' : 'grayscale(1)', boxShadow: unlockedAt ? `0 0 20px ${rarityColor}55` : 'none' }}>
          {badge.icon}
        </div>

        <div style={{ fontFamily: FORGE.sans, fontWeight: 700, fontSize: 18, color: unlockedAt ? FORGE.fg : FORGE.fgDim, textAlign: 'center' }}>{badge.name}</div>

        <div style={{ padding: '3px 10px', borderRadius: 6, background: `${rarityColor}22`, border: `1px solid ${rarityColor}44`, fontFamily: FORGE.mono, fontSize: 9.5, color: rarityColor, textTransform: 'uppercase', letterSpacing: 1 }}>
          {r.label}
        </div>

        <div style={{ fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgDim, textAlign: 'center', lineHeight: 1.5 }}>{badge.desc}</div>

        {unlockedAt ? (
          <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.green, marginTop: 4 }}>
            ✓ Débloqué le {fmtDate(unlockedAt)}
          </div>
        ) : (
          <div style={{ fontFamily: FORGE.mono, fontSize: 10, color: FORGE.fgFaint, marginTop: 4 }}>Non débloqué</div>
        )}

        <div onClick={onClose} style={{ marginTop: 8, fontFamily: FORGE.mono, fontSize: 11, color: FORGE.fgFaint, cursor: 'pointer', padding: '8px 20px', border: `1px solid ${FORGE.line}`, borderRadius: 8 }}>FERMER</div>
      </div>
    </div>
  )
}
