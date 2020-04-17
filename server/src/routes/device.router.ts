import Router from 'koa-router';
import {
  addDevice,
  editDevice,
  removeDevice,
  getDevice,
  getUsersByDevice,
  getDeviceByCurrentUser,
} from '../controllers/device';
import { chainMiddleware } from '../middleware/chainMiddleware';

const router = new Router({ prefix: '/devices' });

router.post('/', chainMiddleware, addDevice);
router.get('/:id', getDevice);
router.get('/:id/currentuser', chainMiddleware, getDeviceByCurrentUser);
router.get('/:id/users', chainMiddleware, getUsersByDevice);
router.patch('/:id', chainMiddleware, editDevice);
router.delete('/:id', chainMiddleware, removeDevice);

export default router;
