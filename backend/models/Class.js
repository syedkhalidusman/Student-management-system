import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher', // Teacher model reference
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department', // Department model reference
      required: true
    },
    shift: {
      type: [String],
      enum: ['Morning', 'Evening', 'Night', 'Late Night'], // Enum for shifts
      required: true
    }
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

const Class = mongoose.model('Class', classSchema); // Ensure the collection is named correctly
export default Class;
