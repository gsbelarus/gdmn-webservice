import Router from 'koa-router';
import { signUp, logIn, logOut, getUser } from '../controllers/auth';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/auth' });

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/logout', authMiddleware, logOut);
router.get('/user', getUser);

export default router;
