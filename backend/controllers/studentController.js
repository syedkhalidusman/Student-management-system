import Student from '../models/Student.js';

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
};

// Get all students or filter by class
export const getStudents = async (req, res) => {
  try {
    const { class: classId } = req.query;
    const query = classId ? { class: classId } : {};
    const students = await Student.find(query).populate('class').populate('subject');
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get a single student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class').populate('subject');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching student', error: error.message });
  }
};

// Update a student by ID
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
};

// Delete a student by ID
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting student', error: error.message });
  }
};

// Check if a field value is unique
export const checkUniqueField = async (req, res) => {
  try {
    const { field, value } = req.body;
    const query = { [field]: value };
    const student = await Student.findOne(query);
    if (student) {
      return res.status(200).json({ isUnique: false });
    }
    res.status(200).json({ isUnique: true });
  } catch (error) {
    res.status(400).json({ message: 'Error checking uniqueness', error: error.message });
  }
};
