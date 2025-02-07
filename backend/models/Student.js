import mongoose from 'mongoose';

// Define the schema for a Student
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {  // Added new field
      type: String,
      required: true,
      trim: true,
    },
    roleNumber: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      index: true // Explicitly add index
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true // Explicitly add index
    },
    fatherIdentityCard: {
      type: String,
      required: true,
      unique: false, // Explicitly set to false
      validate: {
        validator: function (v) {
          return /^\d{5}-\d{7}-\d{1}$/.test(v);  // Only format validation
        },
        message: (props) => `${props.value} is not a valid CNIC format!`,
      }, 
    },
    Country: {
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
          // Updated validation to accept numbers starting with 03 and having 11 digits
          return /^03\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Format should be: 03XXXXXXXXX`
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
          // Updated validation to accept numbers starting with 03 and having 11 digits
          return /^03\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Format should be: 03XXXXXXXXX`
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
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals when converting to JSON
    toObject: { virtuals: true } // Enable virtuals when converting to object
  }
);

// Remove any existing indexes before creating new ones
studentSchema.pre('save', async function(next) {
  try {
    await mongoose.connection.collections.students.dropIndex('fatherIdentityCard_1');
  } catch (error) {
    // Index might not exist, continue
  }
  next();
});

// Add virtual field for age
studentSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Add new fields for stipend
studentSchema.add({
  hasStipend: {
    type: Boolean,
    default: false
  },
  stipendAmount: {
    type: Number,
    default: 0
  },
  stipendHistory: [{
    amount: Number,
    date: Date
  }]
});

// Create a model using the schema
const Student = mongoose.model('Student', studentSchema);

// Export the model for use in other files
export default Student;