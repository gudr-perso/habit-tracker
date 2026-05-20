const BASE = '/api'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json()
}

export const api = {
  /* Profile */
  getProfile:   ()       => req('/profile'),
  updateProfile: (data)  => req('/profile', { method: 'PUT', body: data }),

  /* Habits */
  getHabits:    ()       => req('/habits'),
  createHabit:  (data)   => req('/habits', { method: 'POST', body: data }),
  getHabit:     (id)     => req(`/habits/${id}`),
  updateHabit:  (id, d)  => req(`/habits/${id}`, { method: 'PUT', body: d }),
  deleteHabit:  (id)     => req(`/habits/${id}`, { method: 'DELETE' }),

  /* Logs */
  getLogs:   (id, from, to) => req(`/habits/${id}/logs?from=${from}&to=${to}`),
  upsertLog: (id, data)     => req(`/habits/${id}/logs`, { method: 'POST', body: data }),

  /* Badges */
  getBadges: () => req('/badges'),

  /* Views */
  getDashboard: (date)        => req(`/dashboard?date=${date}`),
  getWeek:      (date)        => req(`/week?date=${date}`),
  getMonth:     (date)        => req(`/month?date=${date}`),
  getStats:     (days, to)    => req(`/stats?days=${days}&to=${to}`),

  /* Notion */
  syncNotion:     ()    => req('/notion/sync'),
  doneNotionTask: (id)  => req(`/notion/tasks/${id}/done`, { method: 'POST' }),

  /* Todos */
  getTodos:    ()       => req('/todos'),
  createTodo:  (data)   => req('/todos', { method: 'POST', body: data }),
  deleteTodo:  (id)     => req(`/todos/${id}`, { method: 'DELETE' }),
  doneTodo:    (id)     => req(`/todos/${id}/done`, { method: 'POST' }),
}
