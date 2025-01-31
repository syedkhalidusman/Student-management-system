import Class from '../models/Class.js';

// Add new class
export const addClass = async (req, res) => {
    const { className, teacher, department, shift } = req.body;

    if (!className || !teacher || !department || shift.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newClass = new Class({
            className,
            teacher,
            department,
            shift
        });

        await newClass.save();
        res.status(201).json({ message: 'Class added successfully', newClass });
    } catch (error) {
        console.error('Error adding class:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all classes
export const getClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate('teacher', 'name')
            .populate('department', 'departmentName');
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Failed to fetch classes' });
    }
};

// Get single class by ID
export const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Class.findById(id)
            .populate('teacher', 'name')
            .populate('department', 'departmentName');
        if (!cls) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(cls);
    } catch (error) {
        console.error('Error fetching class by ID:', error);
        res.status(500).json({ message: 'Failed to fetch class' });
    }
};

// Update class
export const updateClass = async (req, res) => {
    const { id } = req.params;
    const { className, teacher, department, shift } = req.body;

    try {
        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { className, teacher, department, shift },
            { new: true, runValidators: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ message: 'Class updated successfully', updatedClass });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ message: 'Failed to update class' });
    }
};

// Delete class
export const deleteClass = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Failed to delete class' });
    }
};
