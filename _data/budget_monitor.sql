DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS entryTags CASCADE;
DROP TABLE IF EXISTS entries, tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS:
CREATE TABLE users (
  username         VARCHAR(30)    NOT NULL,
  password         VARCHAR(60)    NOT NULL,
  email            VARCHAR(50)    NOT NULL,
  role             VARCHAR(10)    NOT NULL,
  currencies       VARCHAR(255)   NOT NULL,
  PRIMARY KEY (username)
) ENGINE = InnoDB;


-- APPLICATION MODEL
CREATE TABLE entries (
  idEntry          INTEGER(30)    NOT NULL AUTO_INCREMENT,
  username         VARCHAR(30)    NOT NULL,
  date             DATETIME       NOT NULL,
  added            DATETIME       NOT NULL,
  value            INTEGER(9)     NOT NULL,
  currency         VARCHAR(3)     NOT NULL,
  description      VARCHAR(255),
  photo            MEDIUMBLOB     DEFAULT NULL,
  PRIMARY KEY (idEntry),
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE tags (
  idTag            INTEGER(30)    NOT NULL AUTO_INCREMENT,
  owner            VARCHAR(30)    NOT NULL,
  name             VARCHAR(60)    NOT NULL,
  PRIMARY KEY (idTag),
  FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE entrytags (
  idEntry          INTEGER(30)    NOT NULL,
  idTag            INTEGER(30)    NOT NULL,
  PRIMARY KEY (idEntry, idTag),
  FOREIGN KEY (idEntry) REFERENCES entries(idEntry) ON DELETE CASCADE,
  FOREIGN KEY (idTag) REFERENCES tags(idTag) ON DELETE CASCADE
) ENGINE = InnoDB;




-- USERS DATA:
-- pass: 'qwer'
INSERT INTO users (username, password, email, role, currencies) VALUES
  ('user', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user@gmail.com', 'USER', '[PLN,EUR]'),
  ('user1', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user1@gmail.com', 'USER', '[PLN,EUR]'),
  ('user2', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user3@gmail.com', 'USER', '[PLN,EUR]');

INSERT INTO tags (idTag, owner, name) VALUES
 (1, 'user', 'food'),
 (2, 'user', 'communication'),
 (3, 'user', 'entertainment'),
 (4, 'user', 'taxes'),
 (5, 'user', 'salary'),
 (6, 'user', 'learning'),
 (7, 'user1', 'food'),
 (8, 'user1', 'communication'),
 (9, 'user1', 'entertainment'),
 (10, 'user1', 'taxes'),
 (11, 'user1', 'salary'),
 (12, 'user1', 'tech'),
 (13, 'user2', 'food'),
 (14, 'user2', 'communication'),
 (15, 'user2', 'entertainment'),
 (16, 'user2', 'taxes'),
 (17, 'user2', 'salary'),
 (18, 'user2', 'animals');

INSERT INTO entries (idEntry, username, date, added, value, currency, description) VALUES
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
