import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
