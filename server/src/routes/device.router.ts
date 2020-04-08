import Router from 'koa-router';
import { newDevice, getDevice, getUsersByCompany, editeDevice, removeDevice } from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/device' });

router.post('/', authMiddleware, newDevice);
router.get('/:id', getDevice);
router.get('/:id/user', authMiddleware, getUsersByCompany);
router.patch('/:id', authMiddleware, editeDevice);
router.delete('/:id', authMiddleware, removeDevice);

export default router;
