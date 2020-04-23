import Router from 'koa-router';
import { getDevicesByUser, getUsers, getProfile, removeUser, editProfile } from '../controllers/user';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/users' });

router.get('/', compose([authMiddleware, deviceMiddleware]), getUsers);
router.get('/:id/devices', compose([authMiddleware, deviceMiddleware]), getDevicesByUser);
router.get('/:id', compose([authMiddleware, deviceMiddleware]), getProfile);
router.patch('/:id', compose([authMiddleware, deviceMiddleware]), editProfile);
router.delete('/:id', compose([authMiddleware, deviceMiddleware]), removeUser);

export default router;
