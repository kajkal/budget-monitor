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

CREATE TABLE categories (
  idCategory                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
  idSuperCategory            INTEGER(30)    DEFAULT NULL,
  owner                      VARCHAR(30)    DEFAULT NULL,
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

CREATE VIEW usersWithRoles AS
  SELECT
         username,
         password,
         email,
         currency,
         rolename
  FROM users NATURAL JOIN userroles;

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
    INSERT INTO categories (idSuperCategory, owner, name, color)
    VALUES (2, NEW.username, 'Salary', 0),
           (2, NEW.username, 'Presents', 0);

    INSERT INTO categories (idSuperCategory, owner, name, color)
    VALUES (3, NEW.username, 'Communication', 0),
           (3, NEW.username, 'Entertainment', 0),
           (3, NEW.username, 'Maintenance', 0);
    SET id = LAST_INSERT_ID();

    INSERT INTO categories (idSuperCategory, owner, name, color)
    VALUES (id, NEW.username, 'Food', 0),
           (id, NEW.username, 'Home', 0);
    SET id = LAST_INSERT_ID();

    INSERT INTO categories (idSuperCategory, owner, name, color)
    VALUES (id, NEW.username, 'Rent', 0),
           (id, NEW.username, 'Cleaning', 0);
  END;
