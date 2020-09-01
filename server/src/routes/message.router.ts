import Router from 'koa-router';
import { newMessage, getMessage, removeMessage, subscribe, publish } from '../controllers/message';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/messages' });

router.post('/', compose([authMiddleware, deviceMiddleware]), newMessage);
router.get('/:companyId/:appSystem', compose([authMiddleware, deviceMiddleware]), getMessage);
router.delete('/:companyId/:id', compose([authMiddleware, deviceMiddleware]), removeMessage);
router.get('/subscribe/:companyId/:appSystem', compose([authMiddleware, deviceMiddleware]), subscribe);
router.post('/publish/:companyId', compose([authMiddleware, deviceMiddleware]), publish);

export default router;
