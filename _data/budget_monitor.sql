DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS subEntries, userRoles CASCADE;
DROP TABLE IF EXISTS roles, entries, categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS entriesWithSubEntriesView CASCADE;

-- USERS:
CREATE TABLE users (
  username                   VARCHAR(30)    NOT NULL,
  password                   VARCHAR(60)    NOT NULL,
  email                      VARCHAR(50)    NOT NULL UNIQUE,
  currency                   VARCHAR(3)     DEFAULT '---',
  PRIMARY KEY (username)
) ENGINE = InnoDB;

CREATE TABLE roles (
  rolename                   VARCHAR(30)   NOT NULL,
  PRIMARY KEY (rolename)
) ENGINE = InnoDB;

CREATE TABLE userRoles (
  username                   VARCHAR(30)    NOT NULL,
  rolename                   VARCHAR(30)    NOT NULL,
  PRIMARY KEY (username, rolename),
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (rolename) REFERENCES roles(rolename) ON DELETE CASCADE
) ENGINE = InnoDB;


-- APPLICATION MODEL
CREATE TABLE categories (
  idCategory                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
  idSuperCategory            INTEGER(30)    DEFAULT NULL,
  owner                      VARCHAR(30)    DEFAULT NULL,
  name                       VARCHAR(60)    NOT NULL,
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

CREATE VIEW usersWithRoles AS
  SELECT
         username,
         password,
         email,
         currency,
         rolename
  FROM users NATURAL JOIN userroles;

-- ----------------------------------------------------------------------------------------------------

CREATE TRIGGER entriesOnUpdate
  BEFORE UPDATE ON entries
  FOR EACH ROW
  BEGIN
    DELETE FROM subEntries WHERE idEntry = NEW.idEntry;
  END;

CREATE TRIGGER newUserSetup
  AFTER INSERT ON users
  FOR EACH ROW
  BEGIN
    DECLARE id INTEGER(30);

    # create role:
    INSERT INTO userRoles (username, rolename) VALUE (NEW.username, 'USER');
    # create default category structure:
    INSERT INTO categories (idSuperCategory, owner, name)
    VALUES (2, NEW.username, 'Salary'),
           (2, NEW.username, 'Presents');

    INSERT INTO categories (idSuperCategory, owner, name)
    VALUES (3, NEW.username, 'Maintenance'),
           (3, NEW.username, 'Communication'),
           (3, NEW.username, 'Entertainment');
    SET id = LAST_INSERT_ID();

    INSERT INTO categories (idSuperCategory, owner, name)
    VALUES (id, NEW.username, 'Home'),
           (id, NEW.username, 'Food');
    SET id = LAST_INSERT_ID();

    INSERT INTO categories (idSuperCategory, owner, name)
    VALUES (id, NEW.username, 'Rent'),
           (id, NEW.username, 'Cleaning');
  END;

-- ----------------------------------------------------------------------------------------------------


-- DATA:
INSERT INTO roles (rolename)
VALUES ('USER'),
       ('ADMIN');

INSERT INTO categories (idCategory, idSuperCategory, owner, name)
VALUES (1, NULL, NULL, 'ROOT_CATEGORY'),
       (2, 1, NULL, 'INCOME_CATEGORY'),
       (3, 1, NULL, 'EXPENSE_CATEGORY');

-- pass: 'Qwer1234'
# INSERT INTO users (username, password, email, currency)
# VALUES ('budget_monitor', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'budget_monitor@domain.com', 'EUR'),
#        ('user', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user@domain.com', 'PLN'),
#        ('user1', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user1@domain.com', 'PLN'),
#        ('user2', '$2a$08$FxcmICkQlv76d..24pGsu.ojwTrOYk4tmcRu4OFwK63lnYBvhprWm', 'user2@domain.com', 'PLN');
#
# INSERT INTO userRoles (username, rolename)
# VALUES ('budget_monitor', 'ADMIN');
#
#
# INSERT INTO categories (idCategory, idSuperCategory, owner, name)
# VALUES (100, 17, 'user', 'Insurance'),
#        (101, 15, 'user', 'Car maintenance'),
#        (102, 15, 'user', 'Public transport'),
#        (103, 16, 'user', 'Alcohol'),
#        (104, 16, 'user', 'Cinema'),
#        (105, 3, 'user', 'Sport'),
#        (106, 3, 'user', 'Equipment'),
#           (107, 106, 'user', 'Clothes'),
#           (108, 106, 'user', 'Footwear'),
#           (109, 106, 'user', 'Accessories');
#
#
# INSERT INTO entries (idEntry, owner, idCategory, description, value, date, dateOfAddition, dateOfLastModification)
# VALUES (1, 'user', 18, 'Zakupy w Biedronce', -10039, '2018-10-20 12:10:00', '2018-11-01 15:00:00', '2018-12-01 15:00:00'),
#        (2, 'user', 18, 'Pączki', -400, '2018-10-20 12:15:00', '2018-11-01 15:01:00', '2018-11-01 15:01:00'),
#        (3, 'user', 15, 'Bilet w tramwaju', -190, '2018-10-20 12:20:00', '2018-11-01 15:02:00', '2018-12-01 15:02:00'),
#        (4, 'user', 13, 'Wynagrodzenie za październik', 220000, '2018-10-22 00:00:00', '2018-11-01 15:03:00', '2018-11-01 15:03:00'),
#        (5, 'user1', 103, 'Piwo', -1200, '2018-11-01 15:00:00', '2018-10-14 18:20:00', '2018-10-14 18:20:00');
#
#
# INSERT INTO subEntries (idEntry, idSubEntry, idCategory, description, value)
# VALUES (1, 1, 18, 'Pieczywo', -39),
#        (1, 2, 18, 'Owoce', -200),
#        (1, 3, 18, 'Szynka', -400),
#        (1, 4, 18, 'Woda', -200),
#        (1, 5, 18, 'Ser', -200);
