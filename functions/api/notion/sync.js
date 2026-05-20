export async function onRequestGet({ env, request }) {
  const profile = await env.DB.prepare('SELECT * FROM profile WHERE id = 1').first()
  if (!profile?.notion_database_id || !profile?.notion_api_key) {
    return Response.json({ skipped: true, reason: 'notion not configured' })
  }

  const { notion_database_id, notion_api_key, notion_checkbox_field, notion_date_start_field, notion_date_end_field } = profile
  const checkboxField = notion_checkbox_field || 'Done'
  const today = new Date().toISOString().slice(0, 10)

  let pages = []
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${notion_database_id}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notion_api_key}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: checkboxField, checkbox: { equals: false } },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      return Response.json({ error: `Notion API error: ${res.status}`, detail: err }, { status: 502 })
    }
    const data = await res.json()
    pages = data.results || []
  } catch (e) {
    return Response.json({ error: 'fetch failed', detail: String(e) }, { status: 502 })
  }

  let created = 0
  for (const page of pages) {
    const pageId = page.id
    const props = page.properties || {}

    // Titre : première propriété de type title
    let name = ''
    for (const val of Object.values(props)) {
      if (val.type === 'title' && val.title?.length) {
        name = val.title.map(t => t.plain_text).join('')
        break
      }
    }
    if (!name) name = 'Sans titre'

    // Dates
    const dateStartProp = notion_date_start_field ? props[notion_date_start_field] : null
    const dateEndProp   = notion_date_end_field   ? props[notion_date_end_field]   : null
    const date_start = dateStartProp?.date?.start ?? null
    const date_end   = dateEndProp?.date?.end ?? dateEndProp?.date?.start ?? null

    const result = await env.DB.prepare(
      `INSERT OR IGNORE INTO notion_tasks (notion_page_id, name, sync_date, date_start, date_end)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(pageId, name, today, date_start, date_end).run()

    if (result.meta.changes > 0) {
      created++
      // Cocher dans Notion
      const patchBody = { properties: { [checkboxField]: { checkbox: true } } }
      await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${notion_api_key}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchBody),
      })
    }
  }

  return Response.json({ created, synced_at: today })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 })
}
