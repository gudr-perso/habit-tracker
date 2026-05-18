export async function onRequestGet({ env, request }) {
  const url = new URL(request.url)
  const days = parseInt(url.searchParams.get('days') || '30', 10)
  const to   = url.searchParams.get('to') || new Date().toISOString().slice(0, 10)
  const fromDate = new Date(to + 'T00:00:00Z')
  fromDate.setUTCDate(fromDate.getUTCDate() - days + 1)
  const from = fromDate.toISOString().slice(0, 10)

  const [habitsResult, logsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY id').all(),
    env.DB.prepare('SELECT * FROM habit_logs WHERE date >= ? AND date <= ?').bind(from, to).all(),
  ])

  const habits = habitsResult.results
  const logs = logsResult.results

  const perHabit = habits.map(h => {
    const hLogs = logs.filter(l => l.habit_id === h.id)
    const done  = hLogs.filter(l => l.done).length
    return { id: h.id, name: h.name, icon: h.icon, color: h.color, total: days, done, pct: done / days }
  })

  const byDate = {}
  for (const log of logs) {
    if (!byDate[log.date]) byDate[log.date] = { total: 0, done: 0 }
    byDate[log.date].total++
    if (log.done) byDate[log.date].done++
  }

  const byDow = Array.from({ length: 7 }, () => ({ total: 0, done: 0 }))
  for (const [date, stat] of Object.entries(byDate)) {
    const dow = new Date(date + 'T00:00:00Z').getUTCDay()
    byDow[dow].total += stat.total
    byDow[dow].done  += stat.done
  }

  const totalDone  = logs.filter(l => l.done).length
  const totalSlots = habits.length * days
  const globalPct  = totalSlots ? Math.round((totalDone / totalSlots) * 100) : 0

  const dailyChart = []
  for (let i = 0; i < days; i++) {
    const d = new Date(fromDate)
    d.setUTCDate(fromDate.getUTCDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    const stat = byDate[dateStr]
    dailyChart.push({
      date: dateStr,
      pct: stat ? Math.round((stat.done / Math.max(stat.total, 1)) * 100) : 0,
    })
  }

  return Response.json({ from, to, days, globalPct, perHabit, byDow, dailyChart })
}
