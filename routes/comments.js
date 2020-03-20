const express = require("express"),
  router = express.Router({
    mergeParams: true
  }),
  Blog = require("../models/blog"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// ==================================
//  COMMENTS ROUTES
// ==================================
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comment/new", {
        blog: blog
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username and user id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // saving comment and pushing it to database
          comment.save();
          blog.comments.push(comment);
          blog.save();
          res.redirect("/blog/" + blog._id);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comment/edit", {
        blog_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/blog/" + req.params.id);
    }
  });
});
// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    err ? res.redirect("back") : res.redirect(`/blog/${req.params.id}`);
  });
});

module.exports = router;
