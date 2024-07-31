const express = require("express");
const {
  query,
  getQuery,
  deleteQuery,
} = require("../controllers/contact.controller");

const router = express.Router();

router.post("/query", query);
router.get("/getQuery", getQuery);
router.delete("/deleteQuery/:id", deleteQuery);

module.exports = router;
