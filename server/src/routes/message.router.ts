import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';
import { chainMiddleware } from '../middleware/chainMiddleware';

const router = new Router({ prefix: '/messages' });

router.post('/', chainMiddleware, newMessage);
router.get('/', chainMiddleware, getMessage);
router.delete('/:companyId/:id', chainMiddleware, removeMessage);

export default router;
