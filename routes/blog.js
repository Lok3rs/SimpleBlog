const express = require("express"),
    Blog = require("../models/blog"),
    router = express.Router();

// middleware function checking if user is logged in, if not redirecting to login page
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
});

// CREATE ROUTE
router.post("/", isLoggedIn, (req, res) => {
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
            res.render("new");
        } else {
            res.redirect("/blog");
        }
    });
});

// DETAIL VIEW
router.get("/:id", (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, blog) => {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", {
                blog: blog
            })
        };
    });
});
// EDIT FORM VIEW
router.get("/:id/edit", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("edit", {
                blog: blog
            });
        }
    });
});

// EDIT VIEW 
router.put("/:id", isLoggedIn, (req, res) => {
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

router.delete("/:id", isLoggedIn, (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, blog) => {
        if (err) {
            console.log(err.message);
            res.redirect("/blog");
        } else {
            res.redirect("/blog");
        }
    });
});


module.exports = router;