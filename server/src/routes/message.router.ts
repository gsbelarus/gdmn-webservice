import Router from 'koa-router';
import { newMessage, getMessage, removeMessage } from '../controllers/message';

const router = new Router();

router.post('/messages', newMessage);
router.get('/messages', getMessage);
router.delete('/messages/:companyId/:id', removeMessage);

export default router;
