INSERT INTO users (owner, password, email, role, currency) VALUES
  ('user', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user@gmail.com', 'USER', '[PLN,EUR]'),
  ('user1', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user1@gmail.com', 'USER', '[PLN,EUR]'),
  ('user2', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user2@gmail.com', 'USER', '[PLN,EUR]');

INSERT INTO tags (idTag, owner, name, color) VALUES
  (1, 'user', 'food', 0),
  (2, 'user', 'communication', 1),
  (3, 'user', 'entertainment', 0),
  (4, 'user', 'taxes', 3),
  (5, 'user', 'salary', 6),
  (6, 'user', 'learning', 2),
  (7, 'user1', 'food', 0),
  (8, 'user1', 'communication', 1),
  (9, 'user1', 'entertainment', 2),
  (10, 'user1', 'taxes', 0),
  (11, 'user1', 'salary', 1),
  (12, 'user1', 'tech', 2),
  (13, 'user2', 'food', 3),
  (14, 'user2', 'communication', 4),
  (15, 'user2', 'entertainment', 5),
  (16, 'user2', 'taxes', 8),
  (17, 'user2', 'salary', 9),
  (18, 'user2', 'animals', 1);

INSERT INTO entries (idEntry, owner, date, added, value, currency, description) VALUES
  (1, 'user', '2018-10-20 12:10:00', '2018-11-01 15:00:00', -1039, 'PLN', 'Zakupy w Biedronce'),
  (2, 'user', '2018-10-20 12:15:00', '2018-11-01 15:01:00', -400, 'PLN', 'Pączki'),
  (3, 'user', '2018-10-20 12:20:00', '2018-11-01 15:02:00', -190, 'PLN', 'Bilet w tramwaju'),
  (4, 'user', '2018-10-22 00:00:00', '2018-11-01 15:03:00', 2200, 'PLN', 'Wynagrodzenie za październik'),
  (5, 'user1', '2018-10-14 18:20:00', '2018-11-01 15:00:00', -1200, 'PLN', 'Piwo');

INSERT INTO entryTags (idEntry, idTag) VALUES
  (1, 1),
  (2, 1),
  (2, 3),
  (3, 2),
  (4, 5),
  (5, 7),
  (5, 9);
