# data for created schema in schema-test.sql

USE budget_monitor_test;

INSERT INTO users (username, password, email, role, currency) VALUES
  ('user', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user@gmail.com', 'USER', 'PLN'),
  ('user1', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user1@gmail.com', 'USER', 'PLN'),
  ('user2', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user2@gmail.com', 'USER', 'PLN');

INSERT INTO categories (idCategory, idSuperCategory, owner, name, color) VALUES
  (1, NULL, 'user', 'Maintenance', 1),
    (2, 1, 'user', 'Home', 0),
      (3, 2, 'user', 'Cleaning', 0),
      (4, 2, 'user', 'Rent', 0),
    (5, 1, 'user', 'Insurance', 0),
    (42, 1, 'user', 'Food', 0),
  (6, NULL, 'user', 'Communication', 2),
    (7, 6, 'user', 'Car maintenance', 0),
    (8, 6, 'user', 'Public transport', 0),
  (9, NULL, 'user', 'Entertainment', 3),
    (10, 9, 'user', 'Alcohol', 0),
    (11, 9, 'user', 'Cinema', 0),
  (12, NULL, 'user', 'Salary', 4),
  (13, NULL, 'user', 'Sport', 5),
  (14, NULL, 'user', 'Equipment', 5),
    (15, 14, 'user', 'Clothes', 5),
    (16, 14, 'user', 'Footwear', 5),
    (17, 14, 'user', 'Accessories', 5),

  (18, NULL, 'user1', 'Salary', 1),
  (19, NULL, 'user1', 'Entertainment', 2),
    (20, 19, 'user1', 'Alcohol', 0),

  (21, NULL, 'user2', 'Communication', 2),
    (22, 21, 'user2', 'Car maintenance', 0),
    (23, 21, 'user2', 'Public transport', 0),
  (24, NULL, 'user2', 'Salary', 1);

INSERT INTO entries (idEntry, owner, idCategory, description, value, date, dateOfAddition) VALUES
  (1, 'user', 42, 'Zakupy w Biedronce', -10039, '2018-10-20 12:10:00', '2018-11-01 15:00:00'),
  (2, 'user', 42, 'Pączki', -400, '2018-10-20 12:15:00', '2018-11-01 15:01:00'),
  (3, 'user', 8, 'Bilet w tramwaju', -190, '2018-10-20 12:20:00', '2018-11-01 15:02:00'),
  (4, 'user', 12, 'Wynagrodzenie za październik', 220000, '2018-10-22 00:00:00', '2018-11-01 15:03:00'),
  (5, 'user1', 19, 'Piwo', -1200, '2018-11-01 15:00:00', '2018-10-14 18:20:00');


INSERT INTO subEntries (idEntry, idSubEntry, idCategory, description, value) VALUES
  (1, 1, 1, 'Pieczywo', 39),
  (1, 2, 2, 'Owoce', 200),
  (1, 3, 3, 'Szynka', 400),
  (1, 4, 4, 'Woda', 200),
  (1, 5, 5, 'Ser', 200);
