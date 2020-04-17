import Router from 'koa-router';
import {
  addDevice,
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

router.post('/', compose([authMiddleware, deviceMiddleware]), addDevice);
router.get('/:id', getDevice);
router.get('/:id/currentuser', compose([authMiddleware, deviceMiddleware]), getDeviceByCurrentUser);
router.get('/:id/users', compose([authMiddleware, deviceMiddleware]), getUsersByDevice);
router.patch('/:id', compose([authMiddleware, deviceMiddleware]), editDevice);
router.delete('/:id', compose([authMiddleware, deviceMiddleware]), removeDevice);

export default router;
