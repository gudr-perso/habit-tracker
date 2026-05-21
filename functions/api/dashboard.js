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

function offsetDate(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
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

  if (dailyIds.length) {
    const placeholders = dailyIds.map(() => '?').join(',')
    const { results: logs } = await env.DB.prepare(
      `SELECT * FROM habit_logs WHERE date = ? AND habit_id IN (${placeholders})`
    ).bind(date, ...dailyIds).all()
    const logByHabit = Object.fromEntries(logs.map(l => [l.habit_id, l]))
    habitsWithLog = dailyHabits.map(h => ({ ...h, log: logByHabit[h.id] ?? null }))
  }

  // Logs pour les habitudes hebdomadaires
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

  // Filtrage par parent : masquer si le parent n'est pas complété aujourd'hui
  const doneIds = new Set(
    [...habitsWithLog, ...weeklyWithProgress].filter(h => h.log?.done).map(h => h.id)
  )
  habitsWithLog      = habitsWithLog.filter(h => !h.parent_habit_id || doneIds.has(h.parent_habit_id))
  weeklyWithProgress = weeklyWithProgress.filter(h => !h.parent_habit_id || doneIds.has(h.parent_habit_id))

  // Notion tasks du jour
  const { results: notionTasks } = await env.DB.prepare(
    `SELECT * FROM notion_tasks WHERE sync_date = ? AND done = 0`
  ).bind(date).all()

  // TODO tasks dans la fenêtre J-7 à J+7
  const dMinus7 = offsetDate(date, -7)
  const dPlus7  = offsetDate(date, +7)
  const { results: todoTasks } = await env.DB.prepare(
    `SELECT * FROM todo_tasks WHERE done = 0 AND due_date IS NOT NULL
     AND due_date >= ? AND due_date <= ?`
  ).bind(dMinus7, dPlus7).all()

  const notionRows = notionTasks.map(t => ({
    id: t.id, name: t.name, icon: 'N', color: '#9BA3AF',
    category: 'notion', type: 'boolean', xp_per_session: 5,
    _source: 'notion', date_start: t.date_start, date_end: t.date_end, log: null,
  }))
  const todoRows = todoTasks.map(t => ({
    id: t.id, name: t.name, icon: '◆', color: '#F59E0B',
    category: 'todo', type: 'boolean', xp_per_session: 10,
    _source: 'todo', due_date: t.due_date, log: null,
  }))

  const allRows = [...habitsWithLog, ...notionRows, ...todoRows]

  // Complétion sur tout ce qui est affiché : daily + notion + todo + weekly
  const allVisible = [...allRows, ...weeklyWithProgress]
  const doneCount = allVisible.filter(h => h.log?.done).length
  const completion = allVisible.length ? Math.round((doneCount / allVisible.length) * 100) : 0

  return Response.json({ profile, habits: allRows, weeklyHabits: weeklyWithProgress, date, completion })
}
