import express from 'express';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import classRoutes from './routes/classRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import userRoutes  from './routes/authRoutes.js'; // Ensure correct path
import studentAttendanceRoutes from './routes/StudentAttendanceRoutes.js';

import cors from 'cors';

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure CORS to allow requests from the React app running on port 5173
app.use(cors({
  origin: 'http://localhost:5173',
}));

// Middleware
app.use(express.json());

// Use the student routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);// Ensure the auth routes are included as well
app.use('/api/studentAttendance', studentAttendanceRoutes); // Add attendance routes

app.use('/api/auth', userRoutes); // Add this line to ensure correct routing

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
