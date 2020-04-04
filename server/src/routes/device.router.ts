import Router from 'koa-router';
import {
  isExistDevice,
  verifyCode,
  getActivationCode,
  newDevice,
  lockDevices,
  removeDevices,
  isActiveDevice,
  getDevicesByUser,
} from '../controllers/device';

const router = new Router({ prefix: '/device' });

router.get('/verifyCode', verifyCode);
router.get('/getActivationCode', getActivationCode);
router.post('/new', newDevice);
router.post('/lock', lockDevices);
router.post('/remove', removeDevices);
router.get('/isExist', isExistDevice);
router.get('/isActive', isActiveDevice);
router.get('/byUser', getDevicesByUser);

export default router;
