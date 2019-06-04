
$(document).ready (function(){

  $(".scrape").on("click", scrapeArticle);
  $(".save-button").on("click", saveArticle);
  $(".delete-button").on("click", deleteArticle);
  $(".note-button").on("click", addNote);
  
  function scrapeArticle(event) {
      event.stopPropagation();
      $.ajax({
          method: "GET",
          url: "/scrape"
      }).then(function (data) {
        console.log(data);
        location.reload();
      })
  };

  function deleteArticle(event) {
      event.stopPropagation();
      let id = $(this).data("id");
      $.ajax({
        method: "DELETE",
        url: "/delete/" + id

            }).then(function () {
        
            location.reload()
    });
  };
  function saveArticle(event) {
        event.stopPropagation();
        var id = $(this).data("id");
        var saved = $(this).data("saved");

        let savedArticle = {
            saved: true
        };
        $.ajax({
        method: "put",
        url: "/saved/" + id,
        saved: savedArticle
            }).then(function () {
        
            location.reload()
            });
    }
  function addNote() { 
    event.stopPropagation();
  
    $(".modal-body").empty();
        $("#myModal").modal("show")
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/" + thisId
        }).then(function (data) {
            $(".modal-title").html("<h5>" + data.headline + "</h5>");
                $(".modal-body").append("<input id='titleinput' name='title' placeholder='title'></br>");
                $(".modal-body").append("<textarea id='bodyinput' name='body'placeholder='comment'></textarea></br>");
                $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
                if (data.note) {
                    $("#titleinput").val(data.note.noteTitle);
                    console.log(data.note.noteTitle);
                    $("#bodyinput").val(data.note.noteBody);
                }
        });
       
  };
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    console.log("Ive been clicked");
    $.ajax({
        method: "POST",
        url: "/" + thisId,
        data: {
        noteTitle: $("#titleinput").val(),
        noteBody: $("#bodyinput").val()
        }
    })
        .then(function(data) {
        
        console.log(data);
        
      
        
    });
    $("#myModal").modal("hide")
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});