export async function onRequestGet({ env, request }) {
  const url = new URL(request.url)
  const ref = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const [year, month] = ref.slice(0, 7).split('-').map(Number)
  const from = `${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-01`
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const to   = `${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`

  const [habitsResult, logsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY id').all(),
    env.DB.prepare('SELECT * FROM habit_logs WHERE date >= ? AND date <= ?').bind(from, to).all(),
  ])

  const habits = habitsResult.results
  const logs = logsResult.results

  const byDate = {}
  for (const log of logs) {
    if (!byDate[log.date]) byDate[log.date] = { total: 0, done: 0 }
    byDate[log.date].total++
    if (log.done) byDate[log.date].done++
  }

  const days = []
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const stat = byDate[dateStr]
    days.push({
      date: dateStr,
      completion: stat ? Math.round((stat.done / Math.max(stat.total, 1)) * 100) : null,
      done: stat?.done ?? 0,
      total: stat?.total ?? 0,
    })
  }

  const habitsWithLogs = habits.map(h => ({
    ...h,
    logs: logs.filter(l => l.habit_id === h.id),
  }))

  return Response.json({ year, month, from, to, days, habits: habitsWithLogs })
}
