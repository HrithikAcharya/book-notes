// routes/books.js  –  CRUD routes for book records
const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const pool    = require("../db");

// ── helper: fetch cover URL from Open Library ────────────────────────────────
async function getCoverUrl(isbn) {
  if (!isbn) return null;
  const clean = isbn.replace(/[-\s]/g, "");
  // Open Library Covers API – returns a redirect to the actual image
  const url = `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg?default=false`;
  try {
    await axios.head(url, { timeout: 3000 });
    return `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`;
  } catch {
    return null;
  }
}

// ── GET /  –  list all books with optional sort ───────────────────────────────
router.get("/", async (req, res) => {
  const sortOptions = {
    rating:  "rating DESC, title ASC",
    title:   "title ASC",
    recent:  "date_read DESC NULLS LAST",
    author:  "author ASC",
  };
  const sort = sortOptions[req.query.sort] || sortOptions.recent;

  try {
    const { rows } = await pool.query(`SELECT * FROM books ORDER BY ${sort}`);
    res.render("index", { books: rows, sort: req.query.sort || "recent" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to load books." });
  }
});

// ── GET /new  –  show add form ────────────────────────────────────────────────
router.get("/new", (req, res) => {
  res.render("form", { book: null, action: "/books", method: "POST" });
});

// ── POST /  –  create new book ────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { title, author, isbn, rating, notes, date_read } = req.body;
  try {
    await pool.query(
      `INSERT INTO books (title, author, isbn, rating, notes, date_read)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [title, author, isbn || null, rating || null, notes || null, date_read || null]
    );
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to add book." });
  }
});

// ── GET /:id  –  book detail page ─────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).render("error", { message: "Book not found." });
    const book = rows[0];
    book.coverUrl = await getCoverUrl(book.isbn);
    res.render("detail", { book });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to load book." });
  }
});

// ── GET /:id/edit  –  show edit form ──────────────────────────────────────────
router.get("/:id/edit", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).render("error", { message: "Book not found." });
    res.render("form", {
      book:   rows[0],
      action: `/books/${req.params.id}?_method=PUT`,
      method: "POST",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to load book for editing." });
  }
});

// ── POST /:id?_method=PUT  –  update book ────────────────────────────────────
router.post("/:id", async (req, res) => {
  if (req.query._method !== "PUT") return res.status(400).send("Bad request");
  const { title, author, isbn, rating, notes, date_read } = req.body;
  try {
    await pool.query(
      `UPDATE books
          SET title=$1, author=$2, isbn=$3, rating=$4, notes=$5, date_read=$6
        WHERE id=$7`,
      [title, author, isbn || null, rating || null, notes || null, date_read || null, req.params.id]
    );
    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to update book." });
  }
});

// ── POST /:id?_method=DELETE  –  delete book ──────────────────────────────────
router.post("/:id/delete", async (req, res) => {
  try {
    await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to delete book." });
  }
});

module.exports = router;
