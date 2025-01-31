import express from 'express';
import {
    addClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
} from '../controllers/classController.js';

const router = express.Router();

// Add new class
router.post('/', addClass);

// Get all classes
router.get('/', getClasses);

// Get single class by ID
router.get('/:id', getClassById);

// Update class by ID
router.put('/:id', updateClass);

// Delete class by ID
router.delete('/:id', deleteClass);

export default router;
