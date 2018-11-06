DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS subEntries CASCADE;
DROP TABLE IF EXISTS entries, categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS:
CREATE TABLE users (
  owner                   VARCHAR(30)    NOT NULL,
  password                   VARCHAR(60)    NOT NULL,
  email                      VARCHAR(50)    NOT NULL,
  role                       VARCHAR(10)    NOT NULL,
  currency                   VARCHAR(3)     DEFAULT 'PLN',
  PRIMARY KEY (owner)
) ENGINE = InnoDB;


-- APPLICATION MODEL
CREATE TABLE categories (
  idCategory                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
  idSuperCategory            INTEGER(30)    DEFAULT NULL,
  owner                      VARCHAR(30)    NOT NULL,
  name                       VARCHAR(60)    NOT NULL,
  color                      INTEGER(2)     DEFAULT 0,
  PRIMARY KEY (idCategory),
  FOREIGN KEY (idSuperCategory) REFERENCES categories(idCategory) ON DELETE CASCADE,
  FOREIGN KEY (owner) REFERENCES users(owner) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE entries (
  idEntry                    INTEGER(30)    NOT NULL AUTO_INCREMENT,
  owner                      VARCHAR(30)    NOT NULL,
  idCategory                 INTEGER(30)    DEFAULT NULL,
  description                VARCHAR(255),
  value                      INTEGER(9)     NOT NULL,
  date                       DATETIME       NOT NULL,
  dateOfAddition             DATETIME       DEFAULT CURRENT_TIMESTAMP,
  dateOfLastModification     DATETIME       DEFAULT NULL,
  photo                      MEDIUMBLOB     DEFAULT NULL,
  PRIMARY KEY (idEntry),
  FOREIGN KEY (owner) REFERENCES users(owner) ON DELETE CASCADE,
  FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE subEntries (
  idEntry                    INTEGER(30)    NOT NULL,
  idSubEntry                 INTEGER(30)    NOT NULL,
  idCategory                 INTEGER(30)    DEFAULT NULL,
  description                VARCHAR(255),
  value                      INTEGER(9)     NOT NULL,
  PRIMARY KEY (idEntry, idSubEntry),
  FOREIGN KEY (idEntry) REFERENCES entries(idEntry) ON DELETE CASCADE,
  FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
) ENGINE = InnoDB;




-- DATA:
-- pass: 'qwer'
INSERT INTO users (owner, password, email, role, currency) VALUES
  ('user', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user@gmail.com', 'USER', 'PLN'),
  ('user1', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user1@gmail.com', 'USER', 'PLN'),
  ('user2', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user3@gmail.com', 'USER', 'PLN');

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
