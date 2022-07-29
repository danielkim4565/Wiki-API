const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added article")
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err){
        if (!err) {
            res.send("Successfully deleted article");
        } else {
            res.send(err);
        }
    });
});


app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (foundAricle) {
            res.send(foundArticle);
        } else {
            res.send("no Article matching that title was found");
        }
    })
})

.put(function(req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {ovewrite: true},
        function(err) {
            if (!err) {
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        }
    )
})

.patch(function(req,res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        }
    )
})

.delete(function(req,res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (!err) {
            res.send("Successfully deleted article");
        } else {
            res.send(err);
        }
    })
});


app.listen(3000, function() {
    console.log("Sever is up")
})