import Router from 'koa-router';
import { getCompaniesByUser, getCompanyProfile, addCompany, editCompanyProfile } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/company' });

router.post('/', authMiddleware, addCompany);
router.get('/user/:id', authMiddleware, getCompaniesByUser);
router.get('/:id', authMiddleware, getCompanyProfile);
router.put('/:id', authMiddleware, editCompanyProfile);
export default router;
