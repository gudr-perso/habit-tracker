import { evaluateBadges } from '../../_badgeEval.js'

async function cancelChildLogs(env, habitId, date) {
  const { results } = await env.DB.prepare(
    'SELECT id FROM habits WHERE parent_habit_id = ? AND active = 1'
  ).bind(habitId).all()
  for (const child of results) {
    const childLog = await env.DB.prepare(
      'SELECT id, xp_earned FROM habit_logs WHERE habit_id = ? AND date = ? AND done = 1'
    ).bind(child.id, date).first()
    if (childLog) {
      await env.DB.prepare('UPDATE habit_logs SET done = 0, xp_earned = 0 WHERE id = ?').bind(childLog.id).run()
      if (childLog.xp_earned > 0) {
        await env.DB.prepare('UPDATE profile SET xp = MAX(0, xp - ?) WHERE id = 1').bind(childLog.xp_earned).run()
      }
      await cancelChildLogs(env, child.id, date)
    }
  }
}

function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

function isScheduled(days, dayNum) {
  if (!days) return true
  try { return JSON.parse(days).includes(dayNum) } catch { return true }
}

export async function onRequestGet({ env, params, request }) {
  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to   = url.searchParams.get('to')
  let query = 'SELECT * FROM habit_logs WHERE habit_id = ?'
  const args = [params.id]
  if (from) { query += ' AND date >= ?'; args.push(from) }
  if (to)   { query += ' AND date <= ?'; args.push(to) }
  query += ' ORDER BY date DESC'
  const { results } = await env.DB.prepare(query).bind(...args).all()
  return Response.json(results)
}

export async function onRequestPost({ env, params, request }) {
  const body = await request.json()
  const { date, done = 0, value = null, note = null, xp_earned = 0 } = body
  if (!date) return Response.json({ error: 'date required' }, { status: 400 })

  const habit = await env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(params.id).first()

  // Bonus XP hebdo : déclenché quand on passe de (cible-1) à (cible) dans la semaine
  let bonusXp = 0
  if (done && xp_earned > 0 && habit?.weekly_target) {
    const weekStart = getMonday(date)
    const { results: prevLogs } = await env.DB.prepare(
      'SELECT id FROM habit_logs WHERE habit_id = ? AND date >= ? AND date < ? AND done = 1'
    ).bind(params.id, weekStart, date).all()
    if (prevLogs.length === habit.weekly_target - 1) {
      bonusXp = habit.xp_per_session
    }
  }

  // Upsert du log
  await env.DB.prepare(
    `INSERT INTO habit_logs (habit_id, date, done, value, note, xp_earned)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET done=excluded.done, value=excluded.value, note=excluded.note, xp_earned=excluded.xp_earned`
  ).bind(params.id, date, done, value, note, xp_earned).run()

  // Si parent décoché, annuler récursivement les logs des enfants
  if (!done) await cancelChildLogs(env, params.id, date)

  // XP + level-up (courbe exponentielle : xp_next = 500 × 1.3^level)
  if (done && xp_earned > 0) {
    const totalXp = xp_earned + bonusXp
    const prof = await env.DB.prepare('SELECT level, xp, xp_next FROM profile WHERE id = 1').first()
    let { level, xp } = prof
    xp += totalXp
    let xp_next = Math.round(500 * Math.pow(1.3, level))
    while (xp >= xp_next) {
      level++
      xp_next = Math.round(500 * Math.pow(1.3, level))
    }
    await env.DB.prepare('UPDATE profile SET xp = ?, level = ?, xp_next = ? WHERE id = 1').bind(xp, level, xp_next).run()
  }

  // Streak : uniquement pour les habitudes quotidiennes et la date du jour
  const today = new Date().toISOString().slice(0, 10)
  if (date === today && done && !habit?.weekly_target) {
    const todayDayNum = new Date(today + 'T00:00:00Z').getUTCDay() || 7
    const { results: allDailyHabits } = await env.DB.prepare(
      'SELECT id, days FROM habits WHERE active = 1 AND (weekly_target IS NULL OR weekly_target = 0)'
    ).all()
    const scheduledToday = allDailyHabits.filter(h => isScheduled(h.days, todayDayNum))

    if (scheduledToday.length > 0) {
      const ids = scheduledToday.map(h => h.id)
      const placeholders = ids.map(() => '?').join(',')
      const { results: doneLogs } = await env.DB.prepare(
        `SELECT habit_id FROM habit_logs WHERE date = ? AND habit_id IN (${placeholders}) AND done = 1`
      ).bind(today, ...ids).all()

      if (doneLogs.length === scheduledToday.length) {
        const prof = await env.DB.prepare('SELECT streak, record_streak, last_streak_date FROM profile WHERE id = 1').first()
        if (prof.last_streak_date !== today) {
          const yest = new Date(today + 'T00:00:00Z')
          yest.setUTCDate(yest.getUTCDate() - 1)
          const yesterdayStr = yest.toISOString().slice(0, 10)
          const newStreak = prof.last_streak_date === yesterdayStr ? (prof.streak || 0) + 1 : 1
          const newRecord = Math.max(newStreak, prof.record_streak || 0)
          await env.DB.prepare(
            'UPDATE profile SET streak = ?, record_streak = ?, last_streak_date = ? WHERE id = 1'
          ).bind(newStreak, newRecord, today).run()
        }
      }
    }
  }

  // Évaluation des badges
  const newBadges = await evaluateBadges(env, {
    habitId: params.id,
    date,
    done,
    habit,
    weeklyTargetHit: bonusXp > 0,
  })

  const row = await env.DB.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?').bind(params.id, date).first()
  return Response.json({ ...row, weekly_target_hit: bonusXp > 0, bonus_xp: bonusXp, new_badges: newBadges })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
