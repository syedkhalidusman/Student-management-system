import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import classRoutes from './routes/classRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import userRoutes from './routes/authRoutes.js';
import studentAttendanceRoutes from './routes/StudentAttendanceRoutes.js';
import stipendRoutes from './routes/stipendRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// 📌 MongoDB Connection
mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 📌 CORS Setup
app.use(cors({
  origin: 'http://localhost:5173',
}));

// 📌 Middleware
app.use(express.json());

// ✅ Serve Static Files Correctly
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ✅ Ensure Uploads Directory Exists
const studentUploadsDir = path.join(__dirname, '../uploads/students');
fs.mkdirSync(studentUploadsDir, { recursive: true });

// Create upload directories
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads/students/photos'),
    path.join(__dirname, '../uploads/students/documents')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Serve static files with specific routes
app.use('/api/uploads/students/photos', express.static(path.join(__dirname, '../uploads/students/photos')));
app.use('/api/uploads/students/documents', express.static(path.join(__dirname, '../uploads/students/documents')));

// Error handling for missing files
app.use('/api/uploads', (req, res) => {
  console.log('File not found:', req.url);
  res.status(404).send('File not found');
});

// ✅ API to Serve Images Directly
app.get('/uploads/students/:filename', (req, res) => {
    const filePath = path.join(studentUploadsDir, req.params.filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.log('File not found:', filePath);
        res.status(404).send('Image not found');
    }
});

// 📌 Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/studentAttendance', studentAttendanceRoutes);
app.use('/api/stipends', stipendRoutes);
app.use('/api/auth', userRoutes);

// 📌 Error Handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      message: 'File upload error'
    });
  }
  next(err);
});

// 📌 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
