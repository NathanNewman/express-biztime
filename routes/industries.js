const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query("SELECT id, name FROM industries");
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
      "SELECT id, name FROM industries WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can't find invoice ${result.id}`, 404);
    }
    return res.json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
