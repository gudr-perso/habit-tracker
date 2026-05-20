export async function onRequestPost({ env, params }) {
  const task = await env.DB.prepare('SELECT * FROM todo_tasks WHERE id = ?').bind(params.id).first()
  if (!task) return Response.json({ error: 'not found' }, { status: 404 })
  if (task.done) return Response.json({ error: 'already done' }, { status: 400 })

  const today = new Date().toISOString().slice(0, 10)
  await env.DB.prepare(
    'UPDATE todo_tasks SET done = 1, xp_earned = 10, done_at = ? WHERE id = ?'
  ).bind(today, params.id).run()
  await env.DB.prepare('UPDATE profile SET xp = xp + 10 WHERE id = 1').run()
  await env.DB.prepare(`
    UPDATE profile
    SET level   = CASE WHEN xp >= xp_next THEN level + 1 ELSE level END,
        xp_next = CASE WHEN xp >= xp_next THEN xp_next + 500 ELSE xp_next END
    WHERE id = 1
  `).run()

  const updated = await env.DB.prepare('SELECT * FROM todo_tasks WHERE id = ?').bind(params.id).first()
  const profile = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first()
  return Response.json({ task: updated, profile })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
