import express from 'express';
import { 
  getStipends, 
  createStipend, 
  updateStipend, 
  deleteStipend 
} from '../controllers/stipendController.js';

const router = express.Router();

router.get('/', getStipends);
router.post('/', createStipend);
router.put('/:id', updateStipend);
router.delete('/:id', deleteStipend);

export default router;
