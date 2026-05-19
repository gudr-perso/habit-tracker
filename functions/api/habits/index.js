export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM habits WHERE active = 1 ORDER BY id'
  ).all()
  return Response.json(results)
}

export async function onRequestPost({ env, request }) {
  const body = await request.json()
  const { name, icon = '☾', color = '#5dd7ff', category = 'mental', type = 'boolean',
          frequency = 'daily', reminder_time = null, xp_per_session = 20, days = null,
          weekly_target = null } = body
  if (!name) return Response.json({ error: 'name required' }, { status: 400 })
  const result = await env.DB.prepare(
    `INSERT INTO habits (name, icon, color, category, type, frequency, reminder_time, xp_per_session, days, weekly_target)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(name, icon, color, category, type, frequency, reminder_time, xp_per_session, days, weekly_target).run()
  const row = await env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(result.meta.last_row_id).first()
  return Response.json(row, { status: 201 })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
