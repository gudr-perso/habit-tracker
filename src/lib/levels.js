export const CLASS_TITLES = {
  sage: [
    [1,  'Initié'],
    [5,  'Apprenti'],
    [10, 'Disciple'],
    [15, 'Maître'],
    [20, 'Grand Sage'],
    [30, 'Éveillé'],
  ],
  athlete: [
    [1,  'Recrue'],
    [5,  'Sparring'],
    [10, 'Challenger'],
    [15, 'Champion'],
    [20, 'Élite'],
    [30, 'Légende'],
  ],
  builder: [
    [1,  'Stagiaire'],
    [5,  'Artisan'],
    [10, 'Expert'],
    [15, 'Architecte'],
    [20, 'Maître Artisan'],
    [30, 'Visionnaire'],
  ],
}

export function getLevelTitle(cls, level) {
  const tiers = CLASS_TITLES[cls] || CLASS_TITLES.sage
  let current = tiers[0][1]
  for (const [minLv, name] of tiers) {
    if (level >= minLv) current = name
    else break
  }
  return current
}

export function getNextTitle(cls, level) {
  const tiers = CLASS_TITLES[cls] || CLASS_TITLES.sage
  for (const [minLv, name] of tiers) {
    if (minLv > level) return { title: name, level: minLv }
  }
  return null
}

export function xpForLevel(level) {
  return Math.round(500 * Math.pow(1.3, level))
}
