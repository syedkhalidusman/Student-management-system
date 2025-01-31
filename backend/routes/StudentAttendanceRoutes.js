import express from 'express';
import {
  createAttendance,
  getStudentsByClass,
  getMonthlyAttendanceByStudent,
  getAttendanceByStudentClassAndDate,
  getAttendanceByClassAndDate,
  getAttendanceByDateRange,
  updateAttendance,
  deleteAttendance,
} from '../controllers/StudentAttendanceController.js';

const router = express.Router();

// Route to create a new attendance record
router.post('/', createAttendance);

// Route to get students by class
router.get('/students', getStudentsByClass);

// Route to get monthly attendance by student
router.get('/monthly-attendance', getMonthlyAttendanceByStudent);

// Route to get attendance by student, class, and date
router.get('/by-student-class-date', getAttendanceByStudentClassAndDate);

// Route to get attendance by class and date
router.get('/by-class-date', getAttendanceByClassAndDate);

// Route to get attendance by date range
router.get('/by-date-range', getAttendanceByDateRange);

// Route to update attendance
router.put('/:id', updateAttendance);

// Route to delete attendance
router.delete('/:id', deleteAttendance);

export default router;
