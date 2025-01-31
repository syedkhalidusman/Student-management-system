import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentName: {
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

const Department = mongoose.model('Department', departmentSchema);

export default Department;
