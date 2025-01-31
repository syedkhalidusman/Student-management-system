import Department from '../models/department.js';

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  const { departmentName, description } = req.body;
  try {
    const newDepartment = new Department({ departmentName, description });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create department" });
  }
};
