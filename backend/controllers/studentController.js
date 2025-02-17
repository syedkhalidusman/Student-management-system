import Student from '../models/Student.js';

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

    // Create and save student
    const student = new Student(req.body);
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
    // Clean up the data before update
    const updateData = { ...req.body };
    
    // Handle photo upload
    if (req.file) {
      updateData.photo = req.file.filename;
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

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
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
