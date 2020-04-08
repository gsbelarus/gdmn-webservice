import Router from 'koa-router';
import { signUp, logIn, logOut, getCurrentUser, getActivationCode, verifyCode } from '../controllers/auth';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/auth' });

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/logout', authMiddleware, logOut);
router.get('/user', authMiddleware, getCurrentUser);
router.get('/DEVICE/CODE', getActivationCode);
router.post('/DEVICE/CODE', verifyCode);

export default router;
