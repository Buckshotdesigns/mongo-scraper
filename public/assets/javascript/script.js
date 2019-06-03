
$(document).ready (function(){

  $(".scrape").on("click", scrapeArticle);

  function scrapeArticle(event) {

      event.stopPropagation();
      $.ajax({
          method: "GET",
          url: "/scrape"
      }).then(function (response) {
          console.log("this is my data" + response);
      })
  }
  
  
});