import Router from 'koa-router';
import { getCompaniesByUser, getCompanyProfile, addCompany, editCompanyProfile } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/company' });

router.post('/new', authMiddleware, addCompany);
router.get('/byUser', authMiddleware, getCompaniesByUser);
router.get('/profile', authMiddleware, getCompanyProfile);
router.put('/profile', authMiddleware, editCompanyProfile);
export default router;
