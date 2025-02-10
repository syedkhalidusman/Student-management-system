import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentName: {
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

// Pre-save middleware to clean the department name
departmentSchema.pre('save', function(next) {
  if (this.departmentName) {
    // Replace multiple spaces with single space and trim
    this.departmentName = this.departmentName.replace(/\s+/g, ' ').trim();
  }
  next();
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
