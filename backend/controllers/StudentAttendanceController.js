import StudentAttendance from '../models/StudentAttendance.js';
import Student from '../models/Student.js';

// Create attendance record
export const createAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    const existingAttendance = await StudentAttendance.findOne({
      student,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        message: 'Attendance already exists for this student on this date'
      });
    }

    const newAttendance = new StudentAttendance({
      student,
      date: new Date(date),
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Attendance recorded successfully', attendance: newAttendance });
  } catch (error) {
    console.error('Error recording attendance:', error.message);
    res.status(400).json({ message: 'Error recording attendance' });
  }
};

// Get attendance by student and date
export const getAttendanceByStudentAndDate = async (req, res) => {
  try {
    const { studentId, date } = req.query;

    if (!studentId || !date) {
      return res.status(400).json({ message: 'Student ID and date are required' });
    }

    const attendance = await StudentAttendance.findOne({
      student: studentId,
      date: new Date(date)
    }).populate('student');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get attendance by date range for a student
export const getAttendanceByDateRange = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;

    if (!studentId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Student ID and date range are required' });
    }

    const attendance = await StudentAttendance.find({
      student: studentId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('student')
      .sort({ date: 1 });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ 
        message: 'No attendance records found for this student in the specified date range.'
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance by date range:', error.message);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};

// Get all attendance for a student
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = await StudentAttendance.find({ student: studentId })
      .sort({ date: -1 })
      .populate('student', 'name roleNumber');

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ 
        message: 'No attendance records found for this student.',
        studentName: student.name
      });
    }

    res.status(200).json({
      attendance,
      studentName: student.name
    });
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const attendance = await StudentAttendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('student', 'name');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    console.error('Error updating attendance:', error.message);
    res.status(400).json({ message: 'Error updating attendance' });
  }
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await StudentAttendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error.message);
    res.status(400).json({ message: 'Error deleting attendance' });
  }
};
