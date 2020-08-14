const express = require("express");
const router = express.Router();

// @route GET    ->   api/users
// @description  ->   Test Route for users
// @access       ->   public(no security token needed since anyone can access this route)

router.get("/", (req, res) => {
  res.send("User Route");
});

module.exports = router;
