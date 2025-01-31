import Teacher from "../models/Teacher.js";

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json({
      status: "success",
      message: "Teacher added successfully!",
      data: newTeacher,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, field) => {
        acc[field] = error.errors[field].message;
        return acc;
      }, {});
      return res.status(400).json({ status: "error", errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "error",
        message: `Duplicate value for '${field}'. Please use a unique value.`,
      });
    }
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to add teacher. Please try again." });
  }
};

// Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teacher = await Teacher.find().populate('subject');
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching Teacher', error: error.message });
  }
};
   
// Get a single teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("subject");
    if (!teacher) {
      return res.status(404).json({ status: "error", message: "Teacher not found." });
    }
    res.status(200).json(teacher);

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to fetch teacher. Please try again." });
  }
};

// Update a teacher by ID
export const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("subject");
    if (!updatedTeacher) {
      return res.status(404).json({ status: "error", message: "Teacher not found." });
    }
    res.status(200).json({
      status: "success",
      message: "Teacher updated successfully!",
      data: updatedTeacher,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, field) => {
        acc[field] = error.errors[field].message;
        return acc;
      }, {});
      return res.status(400).json({ status: "error", errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: "error",
        message: `Duplicate value for '${field}'. Please use a unique value.`,
      });
    }
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to update teacher. Please try again." });
  }
};

// Delete a teacher by ID
export const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ status: "error", message: "Teacher not found." });
    }
    res.status(200).json({ status: "success", message: "Teacher deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to delete teacher. Please try again." });
  }
};
