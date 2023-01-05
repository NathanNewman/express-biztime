const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

router.get("/", async function(req, res, next) {
    try {
      const companyQuery = await db.query("SELECT id, name FROM company")
      return res.json({ company: companyQuery.rows});
    } catch(err){
      return next(err)
    }
  });

module.exports = router;