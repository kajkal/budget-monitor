# data for created schema in schema-test.sql

USE budget_monitor_test;

INSERT INTO roles (rolename)
VALUES ('USER'),
       ('ADMIN');

INSERT INTO categories (idCategory, idSuperCategory, owner, name, color)
VALUES (1, NULL, NULL, 'ROOT_CATEGORY', NULL),
       (2, 1, NULL, 'INCOME_CATEGORY', NULL),
       (3, 1, NULL, 'EXPENSE_CATEGORY', NULL);

-- pass: 'Qwer1234'
INSERT INTO users (username, password, email, currency)
VALUES ('budget_monitor', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'budget_monitor@domain.com', 'EUR'),
       ('user', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user@gmail.com', 'PLN'),
       ('user1', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user1@gmail.com', 'PLN'),
       ('user2', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user2@gmail.com', 'PLN');

INSERT INTO userRoles (username, rolename)
VALUES ('budget_monitor', 'ADMIN');


INSERT INTO categories (idCategory, idSuperCategory, owner, name, color)
VALUES (100, 17, 'user', 'Insurance', 0),
       (101, 15, 'user', 'Car maintenance', 0),
       (102, 15, 'user', 'Public transport', 0),
       (103, 16, 'user', 'Alcohol', 0),
       (104, 16, 'user', 'Cinema', 0),
       (105, 3, 'user', 'Sport', 5),
       (106, 3, 'user', 'Equipment', 5),
       (107, 106, 'user', 'Clothes', 5),
       (108, 106, 'user', 'Footwear', 5),
       (109, 106, 'user', 'Accessories', 5);


INSERT INTO entries (idEntry, owner, idCategory, description, value, date, dateOfAddition, dateOfLastModification)
VALUES (1, 'user', 18, 'Zakupy w Biedronce', -10039, '2018-10-20 12:10:00', '2018-11-01 15:00:00', '2018-11-01 15:00:00'),
       (2, 'user', 18, 'Pączki', -400, '2018-10-20 12:15:00', '2018-11-01 15:01:00', '2018-11-01 15:01:00'),
       (3, 'user', 15, 'Bilet w tramwaju', -190, '2018-10-20 12:20:00', '2018-11-01 15:01:00', '2018-11-01 15:01:00'),
       (4, 'user', 13, 'Wynagrodzenie za październik', 220000, '2018-10-22 00:00:00', '2018-11-01 15:03:00', '2018-11-01 15:03:00'),
       (5, 'user1', 103, 'Piwo', -1200, '2018-11-01 15:00:00', '2018-10-14 18:20:00', '2018-10-14 18:20:00');


INSERT INTO subEntries (idEntry, idSubEntry, idCategory, description, value)
VALUES (1, 1, 18, 'Pieczywo', 39),
       (1, 2, 18, 'Owoce', 200),
       (1, 3, 18, 'Szynka', 400),
       (1, 4, 18, 'Woda', 200),
       (1, 5, 18, 'Ser', 200);
