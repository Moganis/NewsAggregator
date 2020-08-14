const express = require("express");
const router = express.Router();

// @route GET    ->   api/profile
// @description  ->   Test Route for profile
// @access       ->   public(no security token needed since anyone can access this route)

router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
