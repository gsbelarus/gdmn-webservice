import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';
import { Context } from 'koa';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/messages' });

router.post(
  '/',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  newMessage,
);
router.get(
  '/',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  getMessage,
);
router.delete(
  '/:companyId/:id',
  (ctx: Context, next: Function) => {
    authMiddleware(ctx, next);
    deviceMiddleware(ctx, next);
  },
  removeMessage,
);

export default router;
