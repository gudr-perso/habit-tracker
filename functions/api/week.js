function isoWeekDates(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  const mon = new Date(d)
  mon.setUTCDate(d.getUTCDate() - day + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(mon)
    dd.setUTCDate(mon.getUTCDate() + i)
    return dd.toISOString().slice(0, 10)
  })
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const days = isoWeekDates(date)
  const from = days[0], to = days[6]

  const [habitsResult, logsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM habits WHERE active = 1 ORDER BY id').all(),
    env.DB.prepare('SELECT * FROM habit_logs WHERE date >= ? AND date <= ?').bind(from, to).all(),
  ])

  const habits = habitsResult.results
  const logs = logsResult.results

  const grid = habits.map(h => ({
    ...h,
    days: days.map(d => logs.find(l => l.habit_id === h.id && l.date === d) ?? { date: d, done: 0 }),
  }))

  return Response.json({ days, habits: grid })
}
