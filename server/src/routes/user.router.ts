import Router from 'koa-router';
import { getDevicesByUser, getUsers, getProfile, removeUser, editProfile } from '../controllers/user';
import { authMiddleware } from '../middleware/authRequired';
import { Context } from 'koa';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/users' });

router.get(
  '/',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getUsers,
);
router.get(
  '/:id/devices',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getDevicesByUser,
);
router.get(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getProfile,
);
router.patch(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  editProfile,
);
router.delete(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  removeUser,
);

export default router;
