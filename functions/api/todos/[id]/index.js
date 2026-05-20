export async function onRequestDelete({ env, params }) {
  const task = await env.DB.prepare('SELECT id FROM todo_tasks WHERE id = ?').bind(params.id).first()
  if (!task) return Response.json({ error: 'not found' }, { status: 404 })
  await env.DB.prepare('DELETE FROM todo_tasks WHERE id = ?').bind(params.id).run()
  return Response.json({ deleted: true })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
