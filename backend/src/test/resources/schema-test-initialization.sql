# Initialize test database - must be executed manually before run tests

DROP DATABASE IF EXISTS budget_monitor_test;
CREATE DATABASE budget_monitor_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor_test;

CREATE TABLE users (
  username                   VARCHAR(30)    NOT NULL,
  password                   VARCHAR(60)    NOT NULL,
  email                      VARCHAR(50)    NOT NULL UNIQUE,
  role                       VARCHAR(10)    NOT NULL,
  currency                   VARCHAR(3)     DEFAULT '---',
  PRIMARY KEY (username)
) ENGINE = InnoDB;

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

CREATE TRIGGER entriesOnUpdate
  BEFORE UPDATE ON entries
  FOR EACH ROW
  BEGIN
    DELETE FROM subEntries WHERE idEntry = NEW.idEntry;
  END;

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
