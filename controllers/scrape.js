var app = express();
var db = require("./models");
var axios = require("axios");
var cheerio = require("cheerio");
// app.get("/scrape", function(req, res) {
//     axios.get("http://www.nytimes.com").then(function(response) {
      
//     var $ = cheerio.load(response.data);
//     var article = {}

//       $("#top-stories").each(function(i, element) {
//         var result = {};

//         result.headline = $(this)
//           .children("h2")
//           .text();
//         result.summary = $(this)
//           .children("li")
//           .text();
//         result.url = $(this)
//           .children("a")
//           .attr("href");
//         db.Article.create(result)
//           .then(function(dbArticle) {
//             console.log(dbArticle);
//           })
//           .catch(function(err) {
//             console.log(err);
//           });
//       });
//       res.send("Scrape Complete");
//       console.log(result);
//     });
//   });