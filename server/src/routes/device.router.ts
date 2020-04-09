import Router from 'koa-router';
import { newDevice, getDevice, getUsersByDevice, editeDevice, removeDevice } from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/devices' });

router.post('/', authMiddleware, newDevice);
router.get('/:id', getDevice);
router.get('/:id/user', authMiddleware, getDeviceByCurrentUser);
// router.get('/:id/user', authMiddleware, getUsersByDevice);
router.patch('/:id', authMiddleware, editeDevice);
router.delete('/:id', authMiddleware, removeDevice);

export default router;
