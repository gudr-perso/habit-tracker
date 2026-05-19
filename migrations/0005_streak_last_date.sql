ALTER TABLE profile ADD COLUMN last_streak_date TEXT;

-- Recalibrer xp_next sur la courbe exponentielle 500 × 1.3^level
UPDATE profile SET xp_next =
  CASE
    WHEN level <= 1 THEN 650
    WHEN level = 2  THEN 845
    WHEN level = 3  THEN 1098
    WHEN level = 4  THEN 1428
    WHEN level = 5  THEN 1857
    WHEN level = 6  THEN 2414
    WHEN level = 7  THEN 3138
    WHEN level = 8  THEN 4079
    WHEN level = 9  THEN 5303
    WHEN level = 10 THEN 6894
    ELSE xp_next
  END
WHERE id = 1;
