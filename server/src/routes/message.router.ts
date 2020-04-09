import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';

const router = new Router({ prefix: '/messages' });

router.post('/', newMessage);
router.get('/', getMessage);
router.delete('/:companyId/:id', removeMessage);

export default router;
