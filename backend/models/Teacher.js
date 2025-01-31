import mongoose from 'mongoose';

// Define the schema for a Teacher
const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    identityCardNo: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{5}-\d{7}-\d{1}$/.test(v);  // CNIC format e.g. 12345-1234567-1
        },
        message: (props) => `${props.value} is not a valid CNIC!`,
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18, // Assuming teachers are at least 18 years old
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject', // Assuming there is a 'Subject' model
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Example validation for phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v); // Simple email validation
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    marriedStatus: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?\d{10,13}$/.test(v);  // International phone number validation
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    periodOfService: {
      type: String,
      required: true,
      trim: true,
    },
    increased: {
      type: Number,
      required: true,
      min: 0,
    },
    totalMonthlySalaryAfterIncrement: {
      type: Number,
      required: true,
      min: 0,
    },
    residentStatus: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Teacher = mongoose.model('Teacher', teacherSchema);

// Export the model for use in other files
export default Teacher;
