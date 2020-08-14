const express = require("express");
const router = express.Router();

// @route GET    ->   api/posts
// @description  ->   Test Route for posts
// @access       ->   public(no security token needed since anyone can access this route)

router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
