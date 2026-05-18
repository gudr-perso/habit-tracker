-- ── Profile (utilisateur unique) ──────────────────────────────
CREATE TABLE IF NOT EXISTS profile (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  name         TEXT    NOT NULL DEFAULT 'Romain',
  class        TEXT    NOT NULL DEFAULT 'sage',   -- sage | athlete | builder
  level        INTEGER NOT NULL DEFAULT 1,
  xp           INTEGER NOT NULL DEFAULT 0,
  xp_next      INTEGER NOT NULL DEFAULT 500,
  streak       INTEGER NOT NULL DEFAULT 0,
  record_streak INTEGER NOT NULL DEFAULT 0,
  active_title TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Ligne initiale
INSERT OR IGNORE INTO profile (id) VALUES (1);

-- ── Habitudes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT    NOT NULL,
  icon           TEXT    NOT NULL DEFAULT '☾',
  color          TEXT    NOT NULL DEFAULT '#5dd7ff',
  category       TEXT    NOT NULL DEFAULT 'mental', -- mental | forme | pro | autre
  type           TEXT    NOT NULL DEFAULT 'boolean', -- boolean | duration | count
  frequency      TEXT    NOT NULL DEFAULT 'daily',
  reminder_time  TEXT,                               -- HH:MM ou NULL
  xp_per_session INTEGER NOT NULL DEFAULT 20,
  active         INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── Logs quotidiens ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id   INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date       TEXT    NOT NULL,  -- YYYY-MM-DD
  done       INTEGER NOT NULL DEFAULT 0,
  value      REAL,              -- minutes ou répétitions
  note       TEXT,
  xp_earned  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(habit_id, date)
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_logs_habit_date ON habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_logs_date       ON habit_logs(date);
CREATE INDEX IF NOT EXISTS idx_habits_active   ON habits(active);

-- ── Données de démo ───────────────────────────────────────────
INSERT OR IGNORE INTO habits (id, name, icon, color, category, type, frequency, reminder_time, xp_per_session) VALUES
  (1, 'Méditation',  '☾', '#5dd7ff', 'mental', 'duration', 'daily', '08:00', 30),
  (2, 'Hydratation', '◯', '#3aa8ff', 'forme',  'count',    'daily', NULL,    20),
  (3, 'Run 5 km',    '➤', '#ff7a1a', 'forme',  'boolean',  'daily', NULL,    50),
  (4, 'Lecture',     '▤', '#a47cff', 'mental', 'duration', 'daily', '21:00', 25);
