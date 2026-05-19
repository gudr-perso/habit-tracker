export async function onRequestGet({ env, request }) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

  const dateObj = new Date(date + 'T00:00:00Z')
  const todayNum = dateObj.getUTCDay() || 7  // 1=Lun..7=Dim

  const [profile, habitsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM profile WHERE id = 1').first(),
    env.DB.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY id').all(),
  ])

  const habits = habitsResult.results.filter(h => {
    if (!h.days) return true
    try { return JSON.parse(h.days).includes(todayNum) } catch { return true }
  })
  if (!habits.length) return Response.json({ profile, habits: [], date, completion: 0 })

  const ids = habits.map(h => h.id)
  const placeholders = ids.map(() => '?').join(',')
  const { results: logs } = await env.DB.prepare(
    `SELECT * FROM habit_logs WHERE date = ? AND habit_id IN (${placeholders})`
  ).bind(date, ...ids).all()

  const logByHabit = Object.fromEntries(logs.map(l => [l.habit_id, l]))
  const habitsWithLog = habits.map(h => ({ ...h, log: logByHabit[h.id] ?? null }))

  const done = habitsWithLog.filter(h => h.log?.done).length
  const completion = habits.length ? Math.round((done / habits.length) * 100) : 0

  return Response.json({ profile, habits: habitsWithLog, date, completion })
}
