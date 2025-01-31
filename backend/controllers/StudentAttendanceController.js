import StudentAttendance from '../models/StudentAttendance.js';
import Student from '../models/Student.js';

// Create a new attendance record for a student
export const createAttendance = async (req, res) => {
  try {
    const { student, class: classId, date, status } = req.body;

    // Check if attendance already exists for this student on this date
    const existingAttendance = await StudentAttendance.findOne({
      student,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        message: 'Attendance already exists for this student on this date',
        existing: existingAttendance 
      });
    }

    // Log the request payload for debugging
    console.log('Request Payload:', req.body);

    const newAttendance = new StudentAttendance({
      student,
      class: classId,
      date: new Date(date),
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Attendance recorded successfully', attendance: newAttendance });
  } catch (error) {
    // Log the error message for debugging
    console.error('Error recording attendance:', error.message);
    res.status(400).json({ message: 'Error recording attendance', error: error.message });
  }
};

// Get students by class
export const getStudentsByClass = async (req, res) => {
  try {
    const { class: classId } = req.query;

    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }

    const students = await Student.find({ class: classId }).populate('class');

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this class' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get monthly attendance by student
export const getMonthlyAttendanceByStudent = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;

    if (!studentId || !month || !year) {
      return res.status(400).json({ message: 'Student ID, month, and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await StudentAttendance.find({
      student: studentId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('student class');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this student in the specified month' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching monthly attendance:', error.message);
    res.status(500).json({ message: 'Error fetching monthly attendance', error: error.message });
  }
};

// Get attendance by student, class, and date
export const getAttendanceByStudentClassAndDate = async (req, res) => {
  try {
    const { studentId, classId, date } = req.query;

    if (!studentId || !classId || !date) {
      return res.status(400).json({ message: 'Student ID, class ID, and date are required' });
    }

    const attendance = await StudentAttendance.findOne({
      student: studentId,
      class: classId,
      date: new Date(date),
    }).populate('student class');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// Get attendance by class and date
export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({ message: 'Class ID and date are required' });
    }

    const attendance = await StudentAttendance.find({
      class: classId,
      date: new Date(date),
    }).populate('student class');

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching class attendance:', error.message);
    res.status(500).json({ message: 'Error fetching class attendance', error: error.message });
  }
};
