const mongoose = require('mongoose')

const ProjectsSchema = new mongoose.Schema({
  id: Number,
  name : String,
  desc: String, 
  restrict: Boolean
}) 

const Projects = mongoose.Schema('Projects', ProjectsSchema)
module.exports = Projects