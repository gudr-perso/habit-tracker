-- Objectif hebdomadaire par habitude
-- NULL = quotidien (comportement existant)
-- INTEGER = nombre de séances visées par semaine (ex: 3 = "3 fois/semaine")
ALTER TABLE habits ADD COLUMN weekly_target INTEGER;
