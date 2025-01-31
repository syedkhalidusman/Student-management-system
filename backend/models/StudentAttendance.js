import mongoose from 'mongoose';

const studentAttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Unhealthy', 'Leave'],
    required: true,
  },
});

// Add compound index for student and date to ensure uniqueness
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);

export default StudentAttendance;
