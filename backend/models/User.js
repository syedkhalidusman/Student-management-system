import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
    },
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // Pass error to Mongoose
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
