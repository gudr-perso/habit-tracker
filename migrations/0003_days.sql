-- Ajoute le planning hebdomadaire sur les habitudes
-- NULL = tous les jours (quotidien)
-- JSON array ISO : 1=Lun, 2=Mar, 3=Mer, 4=Jeu, 5=Ven, 6=Sam, 7=Dim
-- ex : '[1,3,5]' = lundi, mercredi, vendredi
ALTER TABLE habits ADD COLUMN days TEXT;
