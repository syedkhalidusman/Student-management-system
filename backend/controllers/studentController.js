import Student from '../models/Student.js';
import { deleteFile, deleteStudentFiles } from '../utils/fileHelper.js';

// Create a new student
export const createStudent = async (req, res) => {
  try {
    console.log('Received student data:', req.body); // Debug log

    // Enhanced validation
    const requiredFields = [
      'name', 
      'class', 
      'department', // Changed from 'subject' to 'department'
      'fatherName', 
      'roleNumber',
      'registrationNumber',
      'age',
      'fatherIdentityCard'
    ];

    const errors = {};
    requiredFields.forEach(field => {
      if (!req.body[field] && req.body[field] !== 0) {
        errors[field] = `${field} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const studentData = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.photo) {
        studentData.photo = req.files.photo[0].filename;
      }
      if (req.files.birthCertificate) {
        studentData.birthCertificate = req.files.birthCertificate[0].filename;
      }
      if (req.files.bForm) {
        studentData.bForm = req.files.bForm[0].filename;
      }
    }

    // Create and save student
    const student = new Student(studentData);
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.error('Student creation error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      // Only handle uniqueness errors for roleNumber and registrationNumber
      if (field === 'roleNumber' || field === 'registrationNumber') {
        return res.status(400).json({
          errors: {
            [field]: `This ${field} is already in use`
          }
        });
      }
    }

    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }

    res.status(400).json({ 
      message: 'Error creating student', 
      error: error.message 
    });
  }
};

// Get all students or filter by class
export const getStudents = async (req, res) => {
  try {
    const { class: classId } = req.query;
    const query = classId ? { class: classId } : {};
    const students = await Student.find(query)
      .populate('class')
      .populate('department');
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching students', error: error.message });
  }
}; 

// Get a single student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class')
      .populate('department');
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
    // Get the existing student first
    const existingStudent = await Student.findById(req.params.id);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updateData = { ...req.body };
    
    // Handle file uploads and cleanup old files
    if (req.files) {
      if (req.files.photo) {
        // Delete old photo if it exists
        if (existingStudent.photo) {
          await deleteFile(existingStudent.photo, 'photo');
        }
        updateData.photo = req.files.photo[0].filename;
      }
      if (req.files.birthCertificate) {
        // Delete old birth certificate if it exists
        if (existingStudent.birthCertificate) {
          await deleteFile(existingStudent.birthCertificate, 'document');
        }
        updateData.birthCertificate = req.files.birthCertificate[0].filename;
      }
      if (req.files.bForm) {
        // Delete old B-Form if it exists
        if (existingStudent.bForm) {
          await deleteFile(existingStudent.bForm, 'document');
        }
        updateData.bForm = req.files.bForm[0].filename;
      }
    }

    // Handle null or empty string stipendId
    if (!updateData.stipendId || updateData.stipendId === 'null' || updateData.stipendId === '') {
      updateData.stipendId = null;
    }

    // Convert dates if they exist
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.dateOfJoining) {
      updateData.dateOfJoining = new Date(updateData.dateOfJoining);
    }
    if (updateData.expelledDate) {
      updateData.expelledDate = new Date(updateData.expelledDate);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(student);
  } catch (error) {
    console.error('Update error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(400).json({ 
      message: 'Error updating student', 
      error: error.message 
    });
  }
};

// Delete a student by ID
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete all associated files first
    await deleteStudentFiles(student);

    // Then delete the student record
    await student.deleteOne();

    res.status(200).json({ message: 'Student and associated files deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ message: 'Error deleting student', error: error.message });
  }
};

// Check if a field value is unique
export const checkUniqueField = async (req, res) => {
  try {
    const { field, value } = req.body;
    // Only check uniqueness for roleNumber and registrationNumber
    if (field !== 'roleNumber' && field !== 'registrationNumber') {
      return res.status(200).json({ isUnique: true });
    }
    
    const query = { [field]: value };
    const student = await Student.findOne(query);
    res.status(200).json({ isUnique: !student });
  } catch (error) {
    res.status(400).json({ message: 'Error checking uniqueness', error: error.message });
  }
};
