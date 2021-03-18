INSERT INTO sessions (scheduled_at, state, scheduled_duration, actual_duration, workout_type_id, owner_id)
VALUES ('2021-03-15 12:00:00', 'completed', 30, 29.1, 2, 1),
('2021-03-15 13:00:00', 'completed', 30, 58.25, 3, 2),
('2021-03-15 15:00:00', 'canceled', 30, null, 4, 3),
('2021-03-16 10:00:00', 'completed', 30, 30.2, 5, 4),
('2021-03-16 12:00:00', 'completed', 30, 27.1, 1, 5),
('2021-03-16 14:00:00', 'canceled', 30, null, null, 6),
('2021-03-16 15:00:00', 'canceled', 30, null, 6, 7),
('2021-03-17 9:00:00', 'pending', 30, null, 2, 1),
('2021-03-17 9:00:00', 'pending', 30, null, null, 8),
('2021-03-17 18:00:00', 'pending', 30, null, 3, 3),
('2021-03-18 15:00:00', 'pending', 30, null, 2, 9),
('2021-03-18 15:00:00', 'pending', 30, null, null, 4),
('2021-03-18 15:00:00', 'pending', 30, null, 1, 2),
('2021-03-18 15:00:00', 'pending', 30, null, 5, 5),
('2021-03-19 10:00:00', 'pending', 30, null, 3, 6),
('2021-03-19 12:00:00', 'canceled', 30, null, 5, 7),
('2021-03-20 13:00:00', 'pending', 30, null, null, 10),
('2021-03-21 14:00:00', 'pending', 30, null, 3, 11);