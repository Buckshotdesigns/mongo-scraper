var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var noteSchema = new Schema({
  
      noteTitle: String,
      noteBody: String
  });
  var Note = mongoose.model("Note", noteSchema);
  module.exports = Note;