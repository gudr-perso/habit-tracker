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

function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

export async function onRequestPost({ env, params, request }) {
  const body = await request.json()
  const { date, done = 0, value = null, note = null, xp_earned = 0 } = body
  if (!date) return Response.json({ error: 'date required' }, { status: 400 })

  // Vérifier si c'est une habitude hebdo et si le bonus doit être déclenché
  let bonusXp = 0
  if (done && xp_earned > 0) {
    const habit = await env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(params.id).first()
    if (habit?.weekly_target) {
      const weekStart = getMonday(date)
      // Compter les séances faites cette semaine AVANT aujourd'hui
      const { results: prevLogs } = await env.DB.prepare(
        "SELECT id FROM habit_logs WHERE habit_id = ? AND date >= ? AND date < ? AND done = 1"
      ).bind(params.id, weekStart, date).all()
      // Si on passe de (cible - 1) à (cible), on déclenche le bonus
      if (prevLogs.length === habit.weekly_target - 1) {
        bonusXp = habit.xp_per_session
      }
    }
  }

  await env.DB.prepare(
    `INSERT INTO habit_logs (habit_id, date, done, value, note, xp_earned)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET done=excluded.done, value=excluded.value, note=excluded.note, xp_earned=excluded.xp_earned`
  ).bind(params.id, date, done, value, note, xp_earned).run()

  if (done && xp_earned > 0) {
    const totalXp = xp_earned + bonusXp
    await env.DB.prepare('UPDATE profile SET xp = xp + ? WHERE id = 1').bind(totalXp).run()
    await env.DB.prepare(`
      UPDATE profile SET xp_next = CASE WHEN xp >= xp_next THEN xp_next + 500 ELSE xp_next END,
      level = CASE WHEN xp >= xp_next THEN level + 1 ELSE level END
      WHERE id = 1`).run()
  }

  const row = await env.DB.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?').bind(params.id, date).first()
  return Response.json({ ...row, weekly_target_hit: bonusXp > 0, bonus_xp: bonusXp })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
