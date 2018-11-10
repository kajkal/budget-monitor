# schema to be executed by the Hibernate every time when tests are started

USE budget_monitor_test;

DROP TABLE IF EXISTS subEntries CASCADE;
DROP TABLE IF EXISTS entries, categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
