const mongoose = require("mongoose");

// MONGOOSE/MODEL SCHEMA
const blogSchema = new mongoose.Schema({
    title: String,
    img: String,
    content: String,
    created: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Blog", blogSchema);