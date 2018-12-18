DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS subEntries CASCADE;
DROP TABLE IF EXISTS entries, categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS entriesWithSubEntriesView CASCADE;

-- USERS:
CREATE TABLE users (
  username                   VARCHAR(30)    NOT NULL,
  password                   VARCHAR(60)    NOT NULL,
  email                      VARCHAR(50)    NOT NULL UNIQUE,
  role                       VARCHAR(10)    NOT NULL,
  currency                   VARCHAR(3)     DEFAULT '---',
  PRIMARY KEY (username)
) ENGINE = InnoDB;


-- APPLICATION MODEL
CREATE TABLE categories (
  idCategory                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
  idSuperCategory            INTEGER(30)    DEFAULT NULL,
  owner                      VARCHAR(30)    NOT NULL,
  name                       VARCHAR(60)    NOT NULL,
  color                      INTEGER(2)     DEFAULT NULL,
  PRIMARY KEY (idCategory),
  FOREIGN KEY (idSuperCategory) REFERENCES categories(idCategory) ON DELETE CASCADE,
  FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE entries (
  idEntry                    INTEGER(30)    NOT NULL AUTO_INCREMENT,
  owner                      VARCHAR(30)    NOT NULL,
  idCategory                 INTEGER(30)    DEFAULT NULL,
  description                VARCHAR(255)   NOT NULL,
  value                      INTEGER(9)     NOT NULL,
  date                       DATETIME       NOT NULL,
  dateOfAddition             DATETIME       DEFAULT NULL,
  dateOfLastModification     DATETIME       DEFAULT NULL,
  photo                      MEDIUMBLOB     DEFAULT NULL,
  PRIMARY KEY (idEntry),
  FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE subEntries (
  idSubEntry                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
  idEntry                    INTEGER(30)    NOT NULL,
  idCategory                 INTEGER(30)    DEFAULT NULL,
  description                VARCHAR(255)   NOT NULL,
  value                      INTEGER(9)     NOT NULL,
  PRIMARY KEY (idSubEntry),
  FOREIGN KEY (idEntry) REFERENCES entries(idEntry) ON DELETE CASCADE,
  FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
) ENGINE = InnoDB;

-- ----------------------------------------------------------------------------------------------------

# VIEWS
CREATE VIEW entriesWithSubEntriesView AS
  SELECT
         idEntry,
         e.owner,
         e.idCategory,
         e.description,
         e.value,
         e.date,
         e.dateOfAddition,
         e.dateOfLastModification,
         e.photo,
         se.idSubEntry,
         se.idCategory AS subEntryIdCategory,
         se.description AS subEntryDescription,
         se.value AS subEntryValue
  FROM entries e LEFT JOIN subEntries se USING (idEntry);

-- ----------------------------------------------------------------------------------------------------

CREATE TRIGGER entriesOnUpdate
  BEFORE UPDATE ON entries
  FOR EACH ROW
  BEGIN
    DELETE FROM subEntries WHERE idEntry = NEW.idEntry;
  END;
-- ----------------------------------------------------------------------------------------------------

# function checkIfUserWithUsernameOrEmailExists returns:
#   0: when username and email are available
#   1: user with username exists
#   2: user with email exists
CREATE FUNCTION checkIfUserWithUsernameOrEmailExists(
  _username VARCHAR(30),
  _email VARCHAR(50)
) RETURNS INTEGER(1) READS SQL DATA
  BEGIN
    # check if user with username exists, if so return 1
    IF (SELECT count(*) FROM users WHERE username LIKE _username) > 0 THEN
      RETURN 1;
    # check if user with email exists, if so return 2
    ELSEIF (SELECT count(*) FROM users WHERE email LIKE _email) > 0 THEN
      RETURN 2;
    ELSE
      RETURN 0;
    END IF;
  END;

# function create basic category tree for new user:
#   ALL_CATEGORIES:
#       > INCOME_CATEGORIES
#       > EXPENSE_CATEGORIES
CREATE PROCEDURE createBasicCategoryTree(
  _username VARCHAR(30)
) MODIFIES SQL DATA
  BEGIN
    DECLARE id INTEGER(30);
    INSERT INTO categories (idSuperCategory, owner, name, color) VALUE (NULL, _username, 'ALL_CATEGORIES', NULL);
    SET id = LAST_INSERT_ID();
    INSERT INTO categories (idSuperCategory, owner, name, color)
    VALUES (id, _username, 'INCOME_CATEGORIES', NULL),
           (id, _username, 'EXPENSE_CATEGORIES', NULL);
  END;
-- ----------------------------------------------------------------------------------------------------


-- DATA:
-- pass: 'Qwer1234'
INSERT INTO users (username, password, email, role, currency)
VALUES ('user', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user@gmail.com', 'USER', 'PLN'),
       ('user1', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user1@gmail.com', 'USER', 'PLN'),
       ('user2', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user2@gmail.com', 'USER', 'PLN');

INSERT INTO categories (idCategory, idSuperCategory, owner, name, color)
VALUES (1, NULL, 'user', 'ALL_CATEGORIES', NULL),
       (2, 1, 'user', 'INCOME_CATEGORIES', NULL),
          (3, 2, 'user', 'Salary', 4),
       (4, 1, 'user', 'EXPENSE_CATEGORIES', NULL),
          (5, 4, 'user', 'Maintenance', 1),
            (6, 5, 'user', 'Home', 0),
              (7, 6, 'user', 'Cleaning', 0),
              (8, 6, 'user', 'Rent', 0),
            (9, 5, 'user', 'Insurance', 0),
            (10, 5, 'user', 'Food', 0),
          (11, 4, 'user', 'Communication', 2),
            (12, 11, 'user', 'Car maintenance', 0),
            (13, 11, 'user', 'Public transport', 0),
          (14, 4, 'user', 'Entertainment', 3),
            (15, 14, 'user', 'Alcohol', 0),
            (16, 14, 'user', 'Cinema', 0),
          (17, 4, 'user', 'Sport', 5),
          (18, 4, 'user', 'Equipment', 5),
            (19, 18, 'user', 'Clothes', 5),
            (20, 18, 'user', 'Footwear', 5),
            (21, 18, 'user', 'Accessories', 5);

INSERT INTO categories (idCategory, idSuperCategory, owner, name, color)
VALUES (30, NULL, 'user1', 'ALL_CATEGORIES', NULL),
       (31, 30, 'user1', 'INCOME_CATEGORIES', NULL),
          (32, 31, 'user1', 'Salary', 1),
       (33, 30, 'user1', 'EXPENSE_CATEGORIES', NULL),
          (34, 33, 'user1', 'Entertainment', 2),
          (35, 33, 'user1', 'Alcohol', 0);

INSERT INTO categories (idCategory, idSuperCategory, owner, name, color)
VALUES (40, NULL, 'user2', 'ALL_CATEGORIES', NULL),
       (41, 40, 'user2', 'INCOME_CATEGORIES', NULL),
          (42, 41, 'user2', 'Salary', 1),
       (43, 40, 'user2', 'EXPENSE_CATEGORIES', NULL),
          (44, 43, 'user2', 'Communication', 2),
            (45, 44, 'user2', 'Car maintenance', 0),
            (46, 44, 'user2', 'Public transport', 0);

INSERT INTO entries (idEntry, owner, idCategory, description, value, date, dateOfAddition)
VALUES (1, 'user', 10, 'Zakupy w Biedronce', -10039, '2018-10-20 12:10:00', '2018-11-01 15:00:00'),
       (2, 'user', 10, 'Pączki', -400, '2018-10-20 12:15:00', '2018-11-01 15:01:00'),
       (3, 'user', 13, 'Bilet w tramwaju', -190, '2018-10-20 12:20:00', '2018-11-01 15:02:00'),
       (4, 'user', 3, 'Wynagrodzenie za październik', 220000, '2018-10-22 00:00:00', '2018-11-01 15:03:00'),
       (5, 'user1', 15, 'Piwo', -1200, '2018-11-01 15:00:00', '2018-10-14 18:20:00');


INSERT INTO subEntries (idEntry, idSubEntry, idCategory, description, value)
VALUES (1, 1, 10, 'Pieczywo', 39),
       (1, 2, 10, 'Owoce', 200),
       (1, 3, 10, 'Szynka', 400),
       (1, 4, 10, 'Woda', 200),
       (1, 5, 10, 'Ser', 200);
