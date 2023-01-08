const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query("SELECT id, comp_code, amt FROM invoices");
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  const invoice = req.params.id;
  try {
    const result = await db.query("SELECT * FROM invoices WHERE id = $1", [
      invoice,
    ]);
    if (result.rows.length === 0) {
      throw new ExpressError(`Can't find invoice ${result.name}`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { comp_code, amt } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *",
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async function (req, res, next) {
  const id = req.params.id;
  const { amt, paid } = req.body;
  let paidDate = null;
  try {
    const currResult = await db.query(
      `SELECT paid
         FROM invoices
         WHERE id = $1`,
      [id]
    );

    if (currResult.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }

    const currPaidDate = currResult.rows[0].paid_date;

    if (!currPaidDate && paid) {
      paidDate = new Date();
    } else if (!paid) {
      paidDate = null;
    } else {
      paidDate = currPaidDate;
    }

    const result = await db.query(
      `UPDATE invoices
         SET amt=$1, paid=$2, paid_date=$3
         WHERE id=$4
         RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, paidDate, id]
    );

    return res.json({ invoice: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM companies WHERE code = $1", [id]);
    return res.json({ msg: `Deleted invoice with id: ${id}!` });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
