import Subject from '../models/Subject.js';

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

export const createSubject = async (req, res) => {
  const { subjectName } = req.body;
  const normalizedName = subjectName.replace(/\s+/g, ' ').trim();

  try {
    const existingSubject = await Subject.findOne({ 
      subjectName: { $regex: new RegExp(`^${normalizedName}$`, 'i') } 
    });
    
    if (existingSubject) {
      return res.status(400).json({ 
        message: "Subject already exists" 
      });
    }

    const newSubject = new Subject({ subjectName: normalizedName });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ 
      message: error.code === 11000 ? "Subject already exists" : "Failed to create subject" 
    });
  }
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subjectName } = req.body;
  const normalizedName = subjectName.replace(/\s+/g, ' ').trim();
  
  try {
    const existingSubject = await Subject.findOne({
      subjectName: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingSubject) {
      return res.status(400).json({ 
        message: "Subject name already exists" 
      });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { subjectName: normalizedName },
      { new: true }
    );
    
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(500).json({ 
      message: error.code === 11000 ? "Subject already exists" : "Failed to update subject" 
    });
  }
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subject" });
  }
};
