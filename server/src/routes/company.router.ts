import Router from 'koa-router';
import { getCompanyProfile, addCompany, editCompanyProfile, getUsersByCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';
import { Context } from 'koa';

const router = new Router({ prefix: '/companies' });

router.post(
  '/',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  addCompany,
);
router.get(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getCompanyProfile,
);
router.put(
  '/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  editCompanyProfile,
);
router.get(
  '/:id/users',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getUsersByCompany,
);

export default router;
