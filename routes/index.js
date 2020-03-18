const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// middleware function checking if user is logged in, if not redirecting to login page
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



// =======================
// AUTH/LOGIN ROUTES
// =======================
router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
    User.register(new User({
        username: req.body.username,
        email: req.body.email
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => res.redirect("/blog"));
    });
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blog",
    failureRedirect: "/login"
}), (req, res) => {
    console.log("${currentUser.username} logged in");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/blog");
});

// RESTFUL ROUTES
router.get("/", (req, res) => {
    res.redirect("/blog");
});


module.exports = router;