-- ============================================================
-- Book Notes Application - Database Schema
-- Run this in psql:  \i db/schema.sql
-- ============================================================

DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  author      VARCHAR(255)  NOT NULL,
  isbn        VARCHAR(20),
  rating      INTEGER       CHECK (rating >= 1 AND rating <= 10),
  notes       TEXT,
  date_read   DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample seed data
INSERT INTO books (title, author, isbn, rating, notes, date_read) VALUES
  ('The Pragmatic Programmer', 'David Thomas', '9780135957059', 9,
   'Essential reading for any developer. Tips on DRY principle and orthogonality were eye-opening.',
   '2024-01-15'),
  ('Deep Work', 'Cal Newport', '9781455586691', 8,
   'Convincing argument for focused, distraction-free work. Immediately changed how I schedule my day.',
   '2024-03-02'),
  ('Sapiens', 'Yuval Noah Harari', '9780062316097', 7,
   'Broad sweep of human history. Some parts felt speculative but overall fascinating perspective.',
   '2024-05-20'),
  ('The Linux Command Line', 'William Shotts', '9781593279523', 9,
   'Best intro to the Linux shell I have read. Practical examples throughout.',
   '2024-07-10'),
  ('Show Your Work', 'Austin Kleon', '9780761178972', 8,
   'Short and punchy. Great motivation to share work-in-progress publicly.',
   '2024-09-01');
