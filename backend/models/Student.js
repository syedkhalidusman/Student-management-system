import mongoose from 'mongoose';

// Define the schema for a Student
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roleNumber: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 5, // Assuming students are at least 5 years old
    },
    fatherIdentityCard: {
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
    homeland: {
      type: String,
      required: true,
      trim: true,
    },
    currentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    guardianName: {
      type: String,
      required: true,
      trim: true,
    },
    overbearingParenting: {
      type: String,
      required: true,
      trim: true,
    },
    guardianAddress: {
      type: String,
      required: true,
      trim: true,
    },
    guardianPhone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Example validation for phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    schoolHistory: {
      type: String,
      required: true,
      trim: true,
    },
    lastSeminary: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
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
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class', // Assuming there is a 'Class' model
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject', // Assuming there is a 'Subject' model
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expelled', 'On Leave'],
      default: 'Active'
    },
    expelledDate: {
      type: Date,
      required: function() {
        return this.status === 'Expelled';
      }
    },
    leaveRecords: [{
      fromDate: {
        type: Date,
        required: function() {
          return this.status === 'On Leave';
        }
      },
      toDate: {
        type: Date,
        required: function() {
          return this.status === 'On Leave';
        }
      }
    }]
  },
  { timestamps: true }
);

// Create a model using the schema
const Student = mongoose.model('Student', studentSchema);

// Export the model for use in other files
export default Student;