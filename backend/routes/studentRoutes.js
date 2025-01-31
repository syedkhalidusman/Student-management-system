import express from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  checkUniqueField
} from "../controllers/studentController.js";

const router = express.Router();

// Routes for CRUD operations
router.post("/", createStudent);  // Add new student
router.get("/", getStudents);  // Get all students
router.get("/:id", getStudentById);  // Get student by ID
router.put("/:id", updateStudent);  // Update student by ID
router.delete("/:id", deleteStudent);  // Delete student by ID

// Route to check if a field value is unique
router.post('/check-unique', checkUniqueField);

export default router;
