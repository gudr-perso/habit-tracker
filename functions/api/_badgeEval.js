function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

export async function evaluateBadges(env, { habitId, date, done, habit, weeklyTargetHit }) {
  if (!done) return []

  const { results: existingRows } = await env.DB.prepare('SELECT key FROM badges').all()
  const unlocked = new Set(existingRows.map(r => r.key))
  const toUnlock = []
  const candidate = (key, cond) => { if (!unlocked.has(key) && cond) toUnlock.push(key) }

  // Profil mis à jour (streak + level après le log courant)
  const prof = await env.DB.prepare('SELECT streak FROM profile WHERE id = 1').first()
  const streak = prof?.streak || 0

  // === Streak ===
  candidate('streak_3',   streak >= 3)
  candidate('streak_7',   streak >= 7)
  candidate('streak_30',  streak >= 30)
  candidate('streak_100', streak >= 100)
  candidate('streak_365', streak >= 365)

  // === Volume total ===
  if (!unlocked.has('sessions_1000')) {
    const r = await env.DB.prepare('SELECT COUNT(*) as cnt FROM habit_logs WHERE done = 1').first()
    candidate('sessions_10',   r.cnt >= 10)
    candidate('sessions_100',  r.cnt >= 100)
    candidate('sessions_500',  r.cnt >= 500)
    candidate('sessions_1000', r.cnt >= 1000)
  }

  // === Objectifs hebdo ===
  if (weeklyTargetHit) {
    candidate('weekly_first', true)

    if (!unlocked.has('weekly_4w') || !unlocked.has('weekly_12w')) {
      const currentMonday = getMonday(date)
      const start12w = new Date(currentMonday + 'T00:00:00Z')
      start12w.setUTCDate(start12w.getUTCDate() - 12 * 7)
      const { results: pastLogs } = await env.DB.prepare(
        'SELECT date FROM habit_logs WHERE habit_id = ? AND date >= ? AND date < ? AND done = 1'
      ).bind(habitId, start12w.toISOString().slice(0, 10), currentMonday).all()

      const weekCounts = {}
      for (const l of pastLogs) {
        const ws = getMonday(l.date)
        weekCounts[ws] = (weekCounts[ws] || 0) + 1
      }

      function checkPrevWeeks(n) {
        for (let i = 1; i <= n; i++) {
          const d = new Date(currentMonday + 'T00:00:00Z')
          d.setUTCDate(d.getUTCDate() - i * 7)
          const ws = d.toISOString().slice(0, 10)
          if ((weekCounts[ws] || 0) < (habit?.weekly_target || 1)) return false
        }
        return true
      }
      candidate('weekly_4w',  checkPrevWeeks(3))
      candidate('weekly_12w', checkPrevWeeks(11))
    }
  }

  // === Pro ===
  if (!unlocked.has('pro_20') && habit?.category === 'pro') {
    const r = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE hl.done = 1 AND h.category = 'pro'`
    ).first()
    candidate('pro_20', r.cnt >= 20)
  }

  // === Diversité : balance (3 catégories différentes aujourd'hui) ===
  if (!unlocked.has('balance')) {
    const { results: cats } = await env.DB.prepare(
      `SELECT DISTINCT h.category FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE hl.date = ? AND hl.done = 1`
    ).bind(date).all()
    candidate('balance', cats.length >= 3)
  }

  // === Jours spéciaux ===
  const mm   = date.slice(5, 7)
  const dd   = date.slice(8, 10)
  const yyyy = date.slice(0, 4)

  candidate('day_jan1',  mm === '01' && dd === '01')
  candidate('day_apr1',  mm === '04' && dd === '01')
  candidate('day_jun21', mm === '06' && dd === '21')
  candidate('day_jul14', mm === '07' && dd === '14')
  candidate('day_oct31', mm === '10' && dd === '31')
  candidate('day_dec31', mm === '12' && dd === '31')

  if (mm === '02' && dd === '14' && !unlocked.has('day_feb14')) {
    const r = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE hl.date = ? AND hl.done = 1 AND h.category = 'mental'`
    ).bind(date).first()
    candidate('day_feb14', r.cnt >= 1)
  }

  if (mm === '05' && dd === '01' && !unlocked.has('day_may1')) {
    const r = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE hl.date = ? AND hl.done = 1 AND h.category = 'pro'`
    ).bind(date).first()
    candidate('day_may1', r.cnt >= 1)
  }

  if (mm === '12' && dd === '25' && !unlocked.has('day_dec25')) {
    const r = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE hl.date = ? AND hl.done = 1 AND h.category != 'pro'`
    ).bind(date).first()
    candidate('day_dec25', r.cnt >= 1)
  }

  // Premier lundi de septembre
  if (mm === '09' && !unlocked.has('day_sep1')) {
    const dow = new Date(date + 'T00:00:00Z').getUTCDay()
    if (dow === 1) {
      const d1dow = new Date(`${yyyy}-09-01T00:00:00Z`).getUTCDay()
      const offset = d1dow === 1 ? 0 : d1dow === 0 ? 1 : 8 - d1dow
      const firstMonday = `${yyyy}-09-${String(1 + offset).padStart(2, '0')}`
      candidate('day_sep1', date === firstMonday)
    }
  }

  // Batch unlock
  for (const key of toUnlock) {
    await env.DB.prepare('INSERT OR IGNORE INTO badges (key, unlocked_at) VALUES (?, ?)').bind(key, date).run()
  }

  return toUnlock
}
