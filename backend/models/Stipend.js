import mongoose from 'mongoose';

const stipendSchema = new mongoose.Schema({
  stipendName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

stipendSchema.pre('save', function(next) {
  if (this.stipendName) {
    this.stipendName = this.stipendName.replace(/\s+/g, ' ').trim();
  }
  next();
});

const Stipend = mongoose.model('Stipend', stipendSchema);
export default Stipend;
