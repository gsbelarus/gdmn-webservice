import Router from 'koa-router';
import { getDevicesByUser, getUsers, getProfile, removeUsers, editProfile } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/users' });

router.get('/', authMiddleware, getUsers);
router.get('/:id/devices', authMiddleware, getDevicesByUser);
router.put('/:id', authMiddleware, getProfile);
router.delete('/:id', authMiddleware, removeUsers);
router.patch('/:id', authMiddleware, editProfile);

export default router;
