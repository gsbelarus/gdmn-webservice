import Router from 'koa-router';
import {
  isExistDevice,
  newDevice,
  lockDevices,
  removeDevices,
  isActiveDevice,
  getDevicesByUser,
} from '../controllers/device';

const router = new Router({ prefix: '/device' });

router.post('/', newDevice);
router.put('/lock', lockDevices);
router.delete('/', removeDevices);
router.get('/:id/exists', isExistDevice);
router.get('/:id/active', isActiveDevice);
router.get('/user/:id', getDevicesByUser);

export default router;
