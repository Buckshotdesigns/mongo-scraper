var express = require("express");

var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();


    app.get("/scrape", function(req, res) {
        axios.get("http://www.nytimes.com/").then(function(response) {
      console.log("scraper run")
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
  
      var result = {};
  
      var summary;
      if ($(this).find("ul").length) {
        summary = $(this).find("li").first().text();
      } else {
        summary = $(this).find("p").text();
      };
  
      result.headline = $(this).find("h2").text();
      result.summary = summary;
      result.url = "https://www.nytimes.com" + $(this).find("a").attr("href");
      
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("Scrape Complete");
    
    });
  });
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
    .then(function(scrapedData) {
      var hbsObject = {articles:scrapedData};
        console.log(hbsObject)
        res.render("index",hbsObject);
        })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/", function(req,res){
    res.render("index")
});
  
  // Route for grabbing a specific Article by id, populate it with it's note
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
//   // Route for saving/updating an Article's associated Note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  
module.exports = app;