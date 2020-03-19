const express = require("express"),
    Blog = require("../models/blog"),
    router = express.Router(),
    middleware = require("../middleware");



//  INDEX ROUTE
router.get("/", (req, res) => {
    Blog.find({}, (err, blog) => {
        if (err) {
            console.log("ERROR : ${err.message}");
        } else {
            res.render("index", {
                blog: blog
            });
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    const title = req.body.blog.title,
        img = req.body.blog.img,
        content = req.body.blog.content,
        author = {
            id: req.user._id,
            username: req.user.username
        }
    const newPost = {
        title: title,
        img: img,
        content: content,
        author: author
    }
    Blog.create(newPost, (err, newP) => {
        if (err) {
            req.flash("error", err.message)
            res.render("new");
        } else {
            req.flash("success", "Post created!")
            res.redirect("/blog");
        }
    });
});

// DETAIL VIEW
router.get("/:id", (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
        if (err) {
            req.flash("error", "Didn't find that post")
            res.redirect("/");
        } else {
            res.render("show", {
                blog: blog
            })
        };
    });
});
// EDIT FORM VIEW
router.get("/:id/edit", middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            req.flash("No permission to do that!")
            res.redirect("back");
        } else {
            res.render("edit", {
                blog: blog
            });
        }
    });
});

// EDIT VIEW 
router.put("/:id", middleware.checkBlogOwnership, (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if (err) {
            console.log(err.message);
        } else {
            var showUrl = "/blog/" + blog._id;
            res.redirect(showUrl);
        }
    });
});

// DELETE VIEW

router.delete("/:id", middleware.checkBlogOwnership, (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, blog) => {
        if (err) {
            console.log(err.message);
            res.redirect("/blog");
        } else {
            req.flash("success", "Succesfully deleted post!")
            res.redirect("/blog");
        }
    });
});


module.exports = router;