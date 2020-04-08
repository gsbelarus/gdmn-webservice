import Router from 'koa-router';
import {
  getDevice,
  getDeviceByCurrentUser,
  lockDevices,
  newDevice,
  removeDevices,
  getDevicesByUser,
} from '../controllers/device';

const router = new Router({ prefix: '/device' });

router.post('/', newDevice);
router.put('/lock', lockDevices);
router.delete('/', removeDevices);
router.get('/:id', getDevice);
router.get('/:id/user', getDeviceByCurrentUser);
router.get('/user/:id', getDevicesByUser);

export default router;
