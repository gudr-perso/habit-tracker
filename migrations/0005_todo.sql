-- Tâches ponctuelles saisies dans l'application
CREATE TABLE IF NOT EXISTS todo_tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  due_date    TEXT,
  done        INTEGER DEFAULT 0,
  xp_earned   INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  done_at     TEXT
);
