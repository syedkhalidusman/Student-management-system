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
  const { departmentName } = req.body;
  const normalizedName = departmentName.replace(/\s+/g, ' ').trim();

  try {
    const existingDepartment = await Department.findOne({ 
      departmentName: { $regex: new RegExp(`^${normalizedName}$`, 'i') } 
    });
    
    if (existingDepartment) {
      return res.status(400).json({ 
        message: "Department already exists" 
      });
    }

    const newDepartment = new Department({ departmentName: normalizedName });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ 
      message: error.code === 11000 ? "Department already exists" : "Failed to create department" 
    });
  }
};

export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { departmentName } = req.body;
  const normalizedName = departmentName.replace(/\s+/g, ' ').trim();
  
  try {
    const existingDepartment = await Department.findOne({
      departmentName: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingDepartment) {
      return res.status(400).json({ 
        message: "Department name already exists" 
      });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { departmentName: normalizedName },
      { new: true }
    );
    
    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ 
      message: error.code === 11000 ? "Department already exists" : "Failed to update department" 
    });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department" });
  }
};
