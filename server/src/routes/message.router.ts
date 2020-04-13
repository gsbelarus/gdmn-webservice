import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/messages' });

router.post('/', authMiddleware, newMessage);
router.get('/', authMiddleware, getMessage);
router.delete('/:companyId/:id', authMiddleware, removeMessage);

export default router;
