export const BADGE_CATEGORIES = [
  { key: 'streak',  label: 'Série & Régularité' },
  { key: 'volume',  label: 'Volume de séances'  },
  { key: 'weekly',  label: 'Objectifs hebdo'    },
  { key: 'pro',     label: 'Pro & Diversité'    },
  { key: 'special', label: 'Jours spéciaux'     },
]

export const BADGES = [
  // Streak
  { key: 'streak_3',   cat: 'streak', name: 'Première flamme',    desc: 'Streak de 3 jours',                          icon: '🔥', rarity: 'common' },
  { key: 'streak_7',   cat: 'streak', name: 'Semaine de feu',     desc: 'Streak de 7 jours',                          icon: '🔥', rarity: 'common' },
  { key: 'streak_30',  cat: 'streak', name: 'Mois de fer',        desc: 'Streak de 30 jours',                         icon: '⚡', rarity: 'rare'   },
  { key: 'streak_100', cat: 'streak', name: 'Centurion',          desc: 'Streak de 100 jours',                        icon: '◆', rarity: 'epic'   },
  { key: 'streak_365', cat: 'streak', name: 'Indestructible',     desc: 'Streak de 365 jours',                        icon: '★', rarity: 'legend' },
  // Volume
  { key: 'sessions_10',   cat: 'volume', name: 'Lancé',        desc: '10 séances au total',    icon: '▲', rarity: 'common' },
  { key: 'sessions_100',  cat: 'volume', name: 'Habitué',      desc: '100 séances au total',   icon: '▲', rarity: 'rare'   },
  { key: 'sessions_500',  cat: 'volume', name: 'Vétéran',      desc: '500 séances au total',   icon: '◆', rarity: 'epic'   },
  { key: 'sessions_1000', cat: 'volume', name: 'Mille séances',desc: '1 000 séances au total', icon: '★', rarity: 'legend' },
  // Hebdo
  { key: 'weekly_first', cat: 'weekly', name: 'Premier objectif',  desc: 'Premier objectif hebdo atteint',               icon: '◎', rarity: 'common' },
  { key: 'weekly_4w',    cat: 'weekly', name: 'Régulier hebdo',    desc: 'Objectif hebdo atteint 4 semaines de suite',   icon: '◎', rarity: 'rare'   },
  { key: 'weekly_12w',   cat: 'weekly', name: 'Machine de guerre', desc: 'Objectif hebdo atteint 12 semaines de suite',  icon: '◎', rarity: 'epic'   },
  // Pro & Diversité
  { key: 'pro_20',  cat: 'pro', name: 'Mode entreprise', desc: '20 séances d\'habitudes pro',                  icon: '◧', rarity: 'common' },
  { key: 'balance', cat: 'pro', name: 'Équilibré',       desc: '3 catégories différentes cochées le même jour',icon: '◯', rarity: 'rare'   },
  // Jours spéciaux
  { key: 'day_jan1',  cat: 'special', name: 'Premier de l\'an',       desc: 'Habitude cochée le 1er janvier',         icon: '✨', rarity: 'special' },
  { key: 'day_feb14', cat: 'special', name: 'St-Valentin en forme',   desc: 'Habitude "mental" le 14 février',         icon: '♥', rarity: 'special' },
  { key: 'day_apr1',  cat: 'special', name: 'Poisson d\'avril',       desc: 'Actif le 1er avril',                      icon: '✦', rarity: 'special' },
  { key: 'day_may1',  cat: 'special', name: 'Travailleur du 1er mai', desc: 'Habitude pro le 1er mai',                 icon: '◆', rarity: 'special' },
  { key: 'day_jun21', cat: 'special', name: 'Solstice d\'été',        desc: 'Actif le 21 juin',                        icon: '☾', rarity: 'special' },
  { key: 'day_jul14', cat: 'special', name: 'Fête nationale',         desc: 'Actif le 14 juillet',                     icon: '✦', rarity: 'special' },
  { key: 'day_sep1',  cat: 'special', name: 'Rentrée dynamo',         desc: 'Actif le 1er lundi de septembre',         icon: '▲', rarity: 'special' },
  { key: 'day_oct31', cat: 'special', name: 'Halloween actif',        desc: 'Actif le 31 octobre',                     icon: '◈', rarity: 'special' },
  { key: 'day_dec25', cat: 'special', name: 'Noël actif',             desc: 'Habitudes perso le 25 décembre',          icon: '★', rarity: 'special' },
  { key: 'day_dec31', cat: 'special', name: 'Réveillon de l\'effort', desc: 'Actif le 31 décembre',                    icon: '◆', rarity: 'special' },
]
