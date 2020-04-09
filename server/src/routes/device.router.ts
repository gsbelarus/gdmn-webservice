import Router from 'koa-router';
import {
  addDevice,
  editDevice,
  removeDevice,
  getDevice,
  getUsersByDevice,
  getDeviceByCurrentUser,
} from '../controllers/device';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/devices' });

router.post('/', authMiddleware, addDevice);
router.get('/:id', getDevice);
router.get('/:id/currentuser', authMiddleware, getDeviceByCurrentUser);
router.get('/:id/users', authMiddleware, getUsersByDevice);
router.patch('/:id', authMiddleware, editDevice);
router.delete('/:id', authMiddleware, removeDevice);

export default router;
