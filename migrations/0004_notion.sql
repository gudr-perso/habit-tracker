-- Config Notion sur le profil utilisateur
ALTER TABLE profile ADD COLUMN notion_database_id TEXT;
ALTER TABLE profile ADD COLUMN notion_api_key TEXT;
ALTER TABLE profile ADD COLUMN notion_checkbox_field TEXT DEFAULT 'Done';
ALTER TABLE profile ADD COLUMN notion_date_start_field TEXT;
ALTER TABLE profile ADD COLUMN notion_date_end_field TEXT;

-- Tâches importées depuis Notion
CREATE TABLE IF NOT EXISTS notion_tasks (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  notion_page_id  TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  sync_date       TEXT NOT NULL,
  date_start      TEXT,
  date_end        TEXT,
  done            INTEGER DEFAULT 0,
  xp_earned       INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
