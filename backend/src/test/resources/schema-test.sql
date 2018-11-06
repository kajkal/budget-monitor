DROP DATABASE IF EXISTS budget_monitor_test;
CREATE DATABASE budget_monitor_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor_test;

DROP TABLE IF EXISTS entryTags CASCADE;
DROP TABLE IF EXISTS entries, tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS:
CREATE TABLE users (
  owner         VARCHAR(30)    NOT NULL,
  password         VARCHAR(60)    NOT NULL,
  email            VARCHAR(50)    NOT NULL,
  role             VARCHAR(10)    NOT NULL,
  currency       VARCHAR(255)   NOT NULL,
  PRIMARY KEY (owner)
) ENGINE = InnoDB;


-- APPLICATION MODEL
CREATE TABLE entries (
  idEntry          INTEGER(30)    NOT NULL AUTO_INCREMENT,
  owner         VARCHAR(30)    NOT NULL,
  date             DATETIME       NOT NULL,
  added            DATETIME       NOT NULL,
  value            INTEGER(9)     NOT NULL,
  currency         VARCHAR(3)     NOT NULL,
  description      VARCHAR(255),
  photo            MEDIUMBLOB     DEFAULT NULL,
  PRIMARY KEY (idEntry),
  FOREIGN KEY (owner) REFERENCES users(owner) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE tags (
  idTag            INTEGER(30)    NOT NULL AUTO_INCREMENT,
  owner            VARCHAR(30)    NOT NULL,
  name             VARCHAR(60)    NOT NULL,
  color            INTEGER(2)     NOT NULL,
  PRIMARY KEY (idTag),
  FOREIGN KEY (owner) REFERENCES users(owner) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE entrytags (
  idEntry          INTEGER(30)    NOT NULL,
  idTag            INTEGER(30)    NOT NULL,
  PRIMARY KEY (idEntry, idTag),
  FOREIGN KEY (idEntry) REFERENCES entries(idEntry) ON DELETE CASCADE,
  FOREIGN KEY (idTag) REFERENCES tags(idTag) ON DELETE CASCADE
) ENGINE = InnoDB;
