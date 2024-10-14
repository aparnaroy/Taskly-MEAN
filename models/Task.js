const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    text: String,
    completed: Boolean
  }, {
      versionKey: false // Disable the __v field that Mongoose automatically adds
});
  
module.exports = mongoose.model('Task', TaskSchema);