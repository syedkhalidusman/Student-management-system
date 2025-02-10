import express from 'express';
import { getStipends, getStipendById, createStipend, updateStipend, deleteStipend } from '../controllers/stipendController.js';

const router = express.Router();

router.get('/', getStipends);
router.get('/:id', getStipendById);
router.post('/', createStipend);
router.put('/:id', updateStipend);
router.delete('/:id', deleteStipend);

export default router;
