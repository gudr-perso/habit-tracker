export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT key, unlocked_at FROM badges ORDER BY unlocked_at ASC'
  ).all()
  return Response.json(results)
}
