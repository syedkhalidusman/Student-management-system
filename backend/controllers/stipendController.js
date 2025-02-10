import Stipend from '../models/Stipend.js';

// Get all stipends
export const getStipends = async (req, res) => {
  try {
    const stipends = await Stipend.find().sort({ stipendName: 1 });
    res.status(200).json(stipends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stipends" });
  }
};

// Get stipend by ID
export const getStipendById = async (req, res) => {
  try {
    const stipend = await Stipend.findById(req.params.id);
    if (!stipend) {
      return res.status(404).json({ message: "Stipend not found" });
    }
    res.status(200).json(stipend);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stipend" });
  }
};

// Create new stipend
export const createStipend = async (req, res) => {
  try {
    const newStipend = new Stipend(req.body);
    await newStipend.save();
    res.status(201).json(newStipend);
  } catch (error) {
    res.status(400).json({ message: "Failed to create stipend" });
  }
};

// Update stipend
export const updateStipend = async (req, res) => {
  try {
    const updatedStipend = await Stipend.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStipend) {
      return res.status(404).json({ message: "Stipend not found" });
    }
    res.status(200).json(updatedStipend);
  } catch (error) {
    res.status(400).json({ message: "Failed to update stipend" });
  }
};

// Delete stipend
export const deleteStipend = async (req, res) => {
  try {
    const deletedStipend = await Stipend.findByIdAndDelete(req.params.id);
    if (!deletedStipend) {
      return res.status(404).json({ message: "Stipend not found" });
    }
    res.status(200).json({ message: "Stipend deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete stipend" });
  }
};
