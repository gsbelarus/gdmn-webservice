import Router from 'koa-router';
import { getCompanyProfile, addCompany, editCompanyProfile, getUsersByCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/companies' });

router.post('/', authMiddleware, addCompany);
router.get('/:id', authMiddleware, getCompanyProfile);
router.put('/:id', authMiddleware, editCompanyProfile);
router.get('/:id/users', authMiddleware, getUsersByCompany);
export default router;
