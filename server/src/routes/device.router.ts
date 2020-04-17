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
import { Context } from 'koa';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/devices' });

router.post(
  '/',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  addDevice,
);
router.get('/:id', getDevice);
router.get(
  '/:id/currentuser',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getDeviceByCurrentUser,
);
router.get(
  '/:id/users',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getUsersByDevice,
);
router.patch(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  editDevice,
);
router.delete(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  removeDevice,
);

export default router;
