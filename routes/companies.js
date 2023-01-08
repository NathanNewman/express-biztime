const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query("SELECT code, name FROM companies");
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async function (req, res, next) {
  const company = req.params.code;
  try {
    const result = await db.query("SELECT code, name, description FROM companies WHERE code = $1", [
      company,
    ]);
    const invoices = await db.query(
      "SELECT id FROM invoices WHERE comp_code = $1",
      [company]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can't find company with code of ${company}`, 404);
    }
    const comp = result.rows[0];
    const inv = invoices.rows;
    comp.invoices = inv.map((inv) => inv.id);
    return res.json({ company: comp });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { code, name, description } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *",
      [code, name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.put("/:code", async function (req, res, next) {
  const company = req.params.code;
  try {
    const { name, description } = req.body;
    const result = await db.query(
      "UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *",
      [name, description, company]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can't find company with code of ${company}`, 404);
    }
    return res.json({ company: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:code", async function (req, res, next) {
  const company = req.params.code;
  try {
    await db.query("DELETE FROM companies WHERE code = $1", [company]);
    return res.json({ msg: `Deleted ${company}!` });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
