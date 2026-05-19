function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

function isScheduled(habit, todayNum) {
  if (!habit.days) return true
  try { return JSON.parse(habit.days).includes(todayNum) } catch { return true }
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

  const dateObj = new Date(date + 'T00:00:00Z')
  const todayNum = dateObj.getUTCDay() || 7  // 1=Lun..7=Dim

  const [profile, habitsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM profile WHERE id = 1').first(),
    env.DB.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY id').all(),
  ])

  const allHabits = habitsResult.results

  // Séparer quotidiennes et hebdomadaires, filtrer par jour planifié
  const dailyHabits  = allHabits.filter(h => !h.weekly_target && isScheduled(h, todayNum))
  const weeklyHabits = allHabits.filter(h =>  h.weekly_target && isScheduled(h, todayNum))

  // Logs du jour pour les habitudes quotidiennes
  const dailyIds = dailyHabits.map(h => h.id)
  let habitsWithLog = []
  let completion = 0

  if (dailyIds.length) {
    const placeholders = dailyIds.map(() => '?').join(',')
    const { results: logs } = await env.DB.prepare(
      `SELECT * FROM habit_logs WHERE date = ? AND habit_id IN (${placeholders})`
    ).bind(date, ...dailyIds).all()
    const logByHabit = Object.fromEntries(logs.map(l => [l.habit_id, l]))
    habitsWithLog = dailyHabits.map(h => ({ ...h, log: logByHabit[h.id] ?? null }))
    const done = habitsWithLog.filter(h => h.log?.done).length
    completion = Math.round((done / dailyHabits.length) * 100)
  }

  // Logs pour les habitudes hebdomadaires : aujourd'hui + toute la semaine
  let weeklyWithProgress = []
  if (weeklyHabits.length) {
    const weekStart = getMonday(date)
    const wIds = weeklyHabits.map(h => h.id)
    const wPlaceholders = wIds.map(() => '?').join(',')
    const [todayLogsRes, weekLogsRes] = await Promise.all([
      env.DB.prepare(`SELECT * FROM habit_logs WHERE date = ? AND habit_id IN (${wPlaceholders})`).bind(date, ...wIds).all(),
      env.DB.prepare(`SELECT habit_id FROM habit_logs WHERE date >= ? AND date <= ? AND habit_id IN (${wPlaceholders}) AND done = 1`).bind(weekStart, date, ...wIds).all(),
    ])
    const todayLogMap = Object.fromEntries(todayLogsRes.results.map(l => [l.habit_id, l]))
    const weekDoneMap = {}
    for (const l of weekLogsRes.results) weekDoneMap[l.habit_id] = (weekDoneMap[l.habit_id] || 0) + 1
    weeklyWithProgress = weeklyHabits.map(h => ({
      ...h,
      log: todayLogMap[h.id] ?? null,
      weekly_done: weekDoneMap[h.id] || 0,
    }))
  }

  return Response.json({ profile, habits: habitsWithLog, weeklyHabits: weeklyWithProgress, date, completion })
}
