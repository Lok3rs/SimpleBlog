const express = require("express"),
    Blog = require("../models/blog"),
    router = express.Router();


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
router.get("/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
router.post("/", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var formData = req.body.blog;
    Blog.create(formData, (err, newPost) => {
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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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