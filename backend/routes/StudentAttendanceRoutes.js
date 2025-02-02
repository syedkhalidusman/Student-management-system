import express from 'express';
import {
  createAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/StudentAttendanceController.js';

const router = express.Router();

router.post('/', createAttendance);
router.get('/student-attendance', getStudentAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
