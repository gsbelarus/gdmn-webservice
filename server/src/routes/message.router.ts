import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/messages' });

router.post('/', compose([authMiddleware, deviceMiddleware]), newMessage);
router.get('/:companyId', compose([authMiddleware, deviceMiddleware]), getMessage);
router.delete('/:companyId/:id', compose([authMiddleware, deviceMiddleware]), removeMessage);

export default router;
