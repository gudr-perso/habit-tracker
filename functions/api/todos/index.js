export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT * FROM todo_tasks WHERE done = 0
     ORDER BY due_date ASC NULLS LAST, created_at ASC`
  ).all()
  return Response.json(results)
}

export async function onRequestPost({ env, request }) {
  const body = await request.json()
  const { name, due_date = null } = body
  if (!name?.trim()) return Response.json({ error: 'name required' }, { status: 400 })
  const result = await env.DB.prepare(
    `INSERT INTO todo_tasks (name, due_date) VALUES (?, ?)`
  ).bind(name.trim(), due_date).run()
  const row = await env.DB.prepare('SELECT * FROM todo_tasks WHERE id = ?').bind(result.meta.last_row_id).first()
  return Response.json(row, { status: 201 })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
