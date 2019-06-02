var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  // require("./controllers/api")(app);
  

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongo-scraper", { useNewUrlParser: true });


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
.then(function(dbArticle) {
  // If we were able to successfully find Articles, send them back to the client
  res.json(dbArticle);
})
.catch(function(err) {
  // If an error occurred, send it to the client
  res.json(err);
});
});

app.get("/", function(req,res){
  db.Article.find({})
      .then(function(scrapedData) {
          var hbsObject = {articles:scrapedData};
      console.log(hbsObject)
      res.render("index",hbsObject);
  })
  .catch(function(error) {
  // If an error occurs, send the error to the client.
  res.json(error);
  });
});


app.listen(PORT, function(){
    console.log("Listening on port" + PORT);
});


