export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first()
  return Response.json(row)
}

export async function onRequestPut({ env, request }) {
  const body = await request.json()
  const allowed = ['name', 'class', 'level', 'xp', 'xp_next', 'streak', 'record_streak', 'active_title', 'onboarded',
                   'notion_database_id', 'notion_api_key', 'notion_checkbox_field',
                   'notion_date_start_field', 'notion_date_end_field']
  const sets = []
  const values = []
  for (const key of allowed) {
    if (key in body) { sets.push(`${key} = ?`); values.push(body[key]) }
  }
  if (!sets.length) return Response.json({ error: 'nothing to update' }, { status: 400 })
  values.push(1)
  await env.DB.prepare(`UPDATE profile SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run()
  const row = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first()
  return Response.json(row)
}
