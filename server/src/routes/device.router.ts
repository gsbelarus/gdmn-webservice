import Router from 'koa-router';
import {
  addDevice,
  getDevices,
  editDevice,
  removeDevice,
  getDevice,
  getUsersByDevice,
  getDeviceByCurrentUser,
} from '../controllers/device';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/devices' });

router.post('/', compose([deviceMiddleware, authMiddleware]), addDevice);
router.get('/', compose([deviceMiddleware, authMiddleware]), getDevices);
router.get('/:id', getDevice);
router.get('/:id/currentuser', compose([deviceMiddleware, authMiddleware]), getDeviceByCurrentUser);
router.get('/:id/users', compose([deviceMiddleware, authMiddleware]), getUsersByDevice);
router.patch('/:id/user/:userId', compose([deviceMiddleware, authMiddleware]), editDevice);
router.delete('/:id', compose([deviceMiddleware, authMiddleware]), removeDevice);

export default router;
