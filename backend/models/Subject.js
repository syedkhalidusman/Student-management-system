import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to clean the subject name
subjectSchema.pre('save', function(next) {
  if (this.subjectName) {
    // Replace multiple spaces with single space and trim
    this.subjectName = this.subjectName.replace(/\s+/g, ' ').trim();
  }
  next();
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
