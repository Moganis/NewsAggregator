const express = require("express");
const router = express.Router();

// @route GET    ->   api/auth
// @description  ->   Test Route for auth
// @access       ->   public(no security token needed since anyone can access this route)

router.get("/", (req, res) => {
  res.send("Auth Route");
});

module.exports = router;
