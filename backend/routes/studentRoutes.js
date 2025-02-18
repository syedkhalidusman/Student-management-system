import express from 'express';
import upload from '../config/multerConfig.js';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  checkUniqueField
} from "../controllers/studentController.js";

const router = express.Router();

const uploadFields = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'bForm', maxCount: 1 }
]);

// Routes for CRUD operations
router.post("/", uploadFields, createStudent);  // Add new student
router.get("/", getStudents);  // Get all students
router.get("/:id", getStudentById);  // Get student by ID
router.put("/:id", uploadFields, updateStudent);  // Update student by ID
router.delete("/:id", deleteStudent);  // Delete student by ID

// Route to check if a field value is unique
router.post('/check-unique', checkUniqueField);

export default router;
