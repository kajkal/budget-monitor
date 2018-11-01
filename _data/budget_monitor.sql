DROP DATABASE IF EXISTS budget_monitor;
CREATE DATABASE budget_monitor
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE budget_monitor;

DROP TABLE IF EXISTS users CASCADE;

-- USERS:
CREATE TABLE users(
  username         VARCHAR(30)   NOT NULL,
  password         VARCHAR(60)    NOT NULL,
  email            VARCHAR(50)    NOT NULL,
  role             VARCHAR(10)    NOT NULL,
  PRIMARY KEY (username)
) ENGINE = InnoDB;

-- USERS DATA:
-- pass: 'qwer'
INSERT INTO users (username, password, email, role) VALUES
  ('user', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user@gmail.com', 'USER'),
  ('user1', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user1@gmail.com', 'USER'),
  ('user3', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user3@gmail.com', 'USER'),
  ('user4', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user4@gmail.com', 'USER'),
  ('user5', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user5@gmail.com', 'USER'),
  ('user6', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user6@gmail.com', 'USER'),
  ('user7', '$2a$08$jWsna71MZtLWfk5CvXfjm.svxYQU6cW3Zq8CX9HwDB9MT.w.Dv0bK', 'user7@gmail.com', 'USER');
