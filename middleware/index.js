const Blog = require("../models/blog"),
    Comment = require("../models/comment");

const middlewareObj = {
    checkBlogOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Blog.findById(req.params.id, (err, foundBlog) => {
                if (err) {
                    res.redirect("back");
                } else {
                    if (foundBlog.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    checkCommentOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    res.redirect("back");
                } else {
                    if (foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    },
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }
}

module.exports = middlewareObj;