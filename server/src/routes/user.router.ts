import Router from 'koa-router';
import { getDevicesByUser, getUsers, getProfile, removeUser, editProfile } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/users' });

router.get('/', authMiddleware, getUsers);
router.get('/:id/devices', authMiddleware, getDevicesByUser);
router.get('/:id', authMiddleware, getProfile);
router.delete('/:id', authMiddleware, removeUser);
router.patch('/:id', authMiddleware, editProfile);

export default router;
