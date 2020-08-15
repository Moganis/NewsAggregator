const express = require("express");
const router = express.Router();
const config = require("config");
const request = require("request");

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth.middleware");

const Posts = require("../../models/Posts");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route POST   ->   POST api/posts
// @description  ->   Create a post
// @access       ->   private

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select("-password");
    try {
      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.send("Server Error");
    }
  }
);

// @route GET    ->   api/posts
// @description  ->   Get all posts
// @access       ->   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// @route GET    ->   api/profile/user/:id
// @description  ->   Get post by id
// @access       ->   Private
router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Post not found" });
    }
    res.status(500).send("Internal Server Error");
  }
});

// @route DELETE ->   DELETE api/posts/:id
// @description  ->   Delete experience from profile
// @access       ->   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    //check user exists
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    //check user owns post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.remove();

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Post not found" });
    }
    res.status(500).send("Internal Server Error");
  }
});

// @route PUT    ->   PUT api/posts/like/:id
// @description  ->   Like a post
// @access       ->   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    //check if already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// @route PUT    ->   PUT api/posts/unlike/:id
// @description  ->   unlike a post
// @access       ->   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    //check if already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ message: "Post hasn't been liked yet" });
    }

    const removeIndex = post.likes.map((like) =>
      like.user.toString().indexOf(req.user.id)
    );

    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// @route POST   ->   POST api/posts/comment/:id
// @description  ->   Comment on a post
// @access       ->   private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE ->   DELETE api/posts/comment/:id/:comment_id
// @description  ->   Delete comment
// @access       ->   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    //Pull comment

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //Make sure comment exists

    if (!comment) {
      return res.status(404).json({ message: "Comment doesn't exist" });
    }

    //check user owns comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const removeIndex = post.comments.map((comment) =>
      comment.user.toString().indexOf(req.user.id)
    );

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Post not found" });
    }
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
