const express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Blog = require("../models/blog"),
    Comment = require("../models/comment");

// middleware function checking if user is logged in, if not redirecting to login page
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// ==================================
//  COMMENTS ROUTES
// ==================================
router.get("/new", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            console.log(err);
        } else {
            res.render("newcomment", {
                blog: blog
            });
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blog/" + blog._id);
                }
            });
        }
    });
});

module.exports = router;