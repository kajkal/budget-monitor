# schema to be executed by the Hibernate every time when tests are started

USE budget_monitor_test;

# DROP TABLE IF EXISTS subEntries, userRoles CASCADE;
# DROP TABLE IF EXISTS roles, entries, categories CASCADE;
# DROP TABLE IF EXISTS users CASCADE;

DELETE FROM users WHERE true;
DELETE FROM roles WHERE true;
DELETE FROM userRoles WHERE true;
DELETE FROM categories WHERE true;
ALTER TABLE categories AUTO_INCREMENT = 1;
DELETE FROM entries WHERE true;
ALTER TABLE entries AUTO_INCREMENT = 1;
DELETE FROM subEntries WHERE true;
ALTER TABLE subEntries AUTO_INCREMENT = 1;


# CREATE TABLE users (
#   username                   VARCHAR(30)    NOT NULL,
#   password                   VARCHAR(60)    NOT NULL,
#   email                      VARCHAR(50)    NOT NULL UNIQUE,
#   currency                   VARCHAR(3)     DEFAULT '---',
#   PRIMARY KEY (username)
# ) ENGINE = InnoDB;
#
# CREATE TABLE roles (
#   rolename                   VARCHAR(30)   NOT NULL,
#   PRIMARY KEY (rolename)
# ) ENGINE = InnoDB;
#
# CREATE TABLE userRoles (
#   username                   VARCHAR(30)    NOT NULL,
#   rolename                   VARCHAR(30)    NOT NULL,
#   PRIMARY KEY (username, rolename),
#   FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
#   FOREIGN KEY (rolename) REFERENCES roles(rolename) ON DELETE CASCADE
# ) ENGINE = InnoDB;
#
# CREATE TABLE categories (
#   idCategory                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
#   idSuperCategory            INTEGER(30)    DEFAULT NULL,
#   owner                      VARCHAR(30)    DEFAULT NULL,
#   name                       VARCHAR(60)    NOT NULL,
#   color                      INTEGER(2)     DEFAULT NULL,
#   PRIMARY KEY (idCategory),
#   FOREIGN KEY (idSuperCategory) REFERENCES categories(idCategory) ON DELETE CASCADE,
#   FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
# ) ENGINE = InnoDB;
#
# CREATE TABLE entries (
#   idEntry                    INTEGER(30)    NOT NULL AUTO_INCREMENT,
#   owner                      VARCHAR(30)    NOT NULL,
#   idCategory                 INTEGER(30)    DEFAULT NULL,
#   description                VARCHAR(255)   NOT NULL,
#   value                      INTEGER(9)     NOT NULL,
#   date                       DATETIME       NOT NULL,
#   dateOfAddition             DATETIME       DEFAULT NULL,
#   dateOfLastModification     DATETIME       DEFAULT NULL,
#   photo                      MEDIUMBLOB     DEFAULT NULL,
#   PRIMARY KEY (idEntry),
#   FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE,
#   FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
# ) ENGINE = InnoDB;
#
# CREATE TABLE subEntries (
#   idSubEntry                 INTEGER(30)    NOT NULL AUTO_INCREMENT,
#   idEntry                    INTEGER(30)    NOT NULL,
#   idCategory                 INTEGER(30)    DEFAULT NULL,
#   description                VARCHAR(255)   NOT NULL,
#   value                      INTEGER(9)     NOT NULL,
#   PRIMARY KEY (idSubEntry),
#   FOREIGN KEY (idEntry) REFERENCES entries(idEntry) ON DELETE CASCADE,
#   FOREIGN KEY (idCategory) REFERENCES categories(idCategory) ON DELETE SET NULL
# ) ENGINE = InnoDB;
