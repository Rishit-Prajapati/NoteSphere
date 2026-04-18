const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Notes', 'PYQ Papers', 'Solutions', 'Assignments', 'Other Resources']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  year: {
    type: Number,
    required: [true, 'Please add a year']
  },
  exam: {
    type: String
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is missing']
  },
  fileType: {
    type: String
  },
  fileName: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Material', materialSchema);
