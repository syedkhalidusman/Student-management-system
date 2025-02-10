import Stipend from '../models/Stipend.js';

export const getStipends = async (req, res) => {
  try {
    const stipends = await Stipend.find().sort({ createdAt: -1 });
    res.status(200).json(stipends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stipends" });
  }
};

export const createStipend = async (req, res) => {
  const { stipendName, amount } = req.body;
  try {
    const existingStipend = await Stipend.findOne({ 
      stipendName: { $regex: new RegExp(`^${stipendName}$`, 'i') } 
    });
    
    if (existingStipend) {
      return res.status(400).json({ message: "Stipend already exists" });
    }

    const newStipend = new Stipend({ 
      stipendName: stipendName.trim(), 
      amount: Number(amount) 
    });
    await newStipend.save();
    res.status(201).json(newStipend);
  } catch (error) {
    res.status(500).json({ 
      message: error.code === 11000 ? "Stipend already exists" : "Failed to create stipend" 
    });
  }
};

export const updateStipend = async (req, res) => {
  const { id } = req.params;
  const { stipendName, amount } = req.body;
  
  try {
    const existingStipend = await Stipend.findOne({
      stipendName: { $regex: new RegExp(`^${stipendName}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingStipend) {
      return res.status(400).json({ message: "Stipend name already exists" });
    }

    const updatedStipend = await Stipend.findByIdAndUpdate(
      id,
      { stipendName: stipendName.trim(), amount: Number(amount) },
      { new: true }
    );
    
    if (!updatedStipend) {
      return res.status(404).json({ message: "Stipend not found" });
    }
    res.status(200).json(updatedStipend);
  } catch (error) {
    res.status(500).json({ message: "Failed to update stipend" });
  }
};

export const deleteStipend = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStipend = await Stipend.findByIdAndDelete(id);
    if (!deletedStipend) {
      return res.status(404).json({ message: "Stipend not found" });
    }
    res.status(200).json({ message: "Stipend deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete stipend" });
  }
};
