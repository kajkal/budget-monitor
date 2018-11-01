DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS users CASCADE;

-- USERS:
CREATE TABLE users(
  idUser           INTEGER(30)    NOT NULL AUTO_INCREMENT,
  username         VARCHAR(191)   NOT NULL UNIQUE,
  password         VARCHAR(255)   NOT NULL,
  PRIMARY KEY (idUser)
) ENGINE = InnoDB;


-- 'admin' -> 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg='
-- 'qwer' -> '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='
INSERT INTO users (idUser, username, password) VALUES
  (1, 'admin', 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg='),
  (2, 'mage1', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='),
  (3, 'dragon1', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='),
  (4, 'mage2', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='),
  (5, 'elf2', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='),
  (6, 'dragon2', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM='),
  (7, 'soap_user', '9vLqj0XYoFfJVmoz+ZR02i5camYE1zYSFlDicwxvsKM=');