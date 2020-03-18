// DECLARING REQUIRES AND CONSTANTS
const methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Blog = require("./models/blog"),
    express = require("express"),
    app = express(),
    seedDB = require("./seed"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

// ROUTES REQUIRES
const indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    commentRoutes = require("./routes/comments");

// SEEDING DATABASE
seedDB();

// SETTING APLICATION
mongoose.connect("mongodb+srv://Lok3rs:z3xjek39@cluster0-q5ytv.mongodb.net/test?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(sanitizer());
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Fafik is the best dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// providing current logged (or not) user to every each page as a middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comment", commentRoutes);







// RUNNING APPLICATION AND LISTENING
app.listen(3000, () => {
    console.log("Server started, Blog App is listening at port 3000");
});