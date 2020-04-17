import Router from 'koa-router';
import { getDevicesByUser, getUsers, getProfile, removeUser, editProfile } from '../controllers/user';
import { chainMiddleware } from '../middleware/chainMiddleware';

const router = new Router({ prefix: '/users' });

router.get('/', chainMiddleware, getUsers);
router.get('/:id/devices', chainMiddleware, getDevicesByUser);
router.get('/:id', chainMiddleware, getProfile);
router.patch('/:id', chainMiddleware, editProfile);
router.delete('/:id', chainMiddleware, removeUser);

export default router;
