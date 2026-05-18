export async function onRequestGet({ env, params }) {
  const row = await env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(params.id).first()
  if (!row) return Response.json({ error: 'not found' }, { status: 404 })
  return Response.json(row)
}

export async function onRequestPut({ env, params, request }) {
  const body = await request.json()
  const allowed = ['name', 'icon', 'color', 'category', 'type', 'frequency', 'reminder_time', 'xp_per_session', 'active']
  const sets = []
  const values = []
  for (const key of allowed) {
    if (key in body) { sets.push(`${key} = ?`); values.push(body[key]) }
  }
  if (!sets.length) return Response.json({ error: 'nothing to update' }, { status: 400 })
  values.push(params.id)
  await env.DB.prepare(`UPDATE habits SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run()
  const row = await env.DB.prepare('SELECT * FROM habits WHERE id = ?').bind(params.id).first()
  return Response.json(row)
}

export async function onRequestDelete({ env, params }) {
  await env.DB.prepare('UPDATE habits SET active = 0 WHERE id = ?').bind(params.id).run()
  return Response.json({ ok: true })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
