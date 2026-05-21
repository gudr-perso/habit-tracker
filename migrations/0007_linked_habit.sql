ALTER TABLE habits ADD COLUMN parent_habit_id INTEGER REFERENCES habits(id);
