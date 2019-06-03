
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    
//   app.get("/", function (req, res) {
//     db.Article.find({}).sort({
//         "_id": -1
//     }).then(function (dbArticle) {
//         res.render("index", {
//             data: dbArticle
//         });
        
//     }).catch(function (err) {
//         res.json(err)
//     });
// });
app.get("/", function(req, res) {
  // Grab every document in the Articles collection
      db.Article.find({})
          .then(function(data) {
          // If we were able to successfully find Articles, send them back to the client
  
          var hbsObject = {
              articles: data,
              };
          
              console.log(hbsObject);
              res.render("index", hbsObject);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
              res.json(err);
          });
  });
  
  
  
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
      
      db.Article.findOne({
        headline: result.headline,
        summary: result.summary,
        url: result.url 
      }).then(function (dbArticle) {
        if (dbArticle) {
            console.log(dbArticle.headline + " already in db!")
        } else {
            //create new one
            db.Article.create(result).then(function (dbArticle) {
                
                
            })
        }
      }).catch(function (err) {
        
        console.log(err)
      })
    })
      res.send("scrape complete")
  });

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
  
}