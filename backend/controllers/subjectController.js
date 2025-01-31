import Subject from '../models/Subject.js';

// Get all subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

// Create a new subject
export const createSubject = async (req, res) => {
  const { subjectName, description } = req.body;
  try {
    const newSubject = new Subject({ subjectName, description });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: "Failed to create subject" });
  }
};
