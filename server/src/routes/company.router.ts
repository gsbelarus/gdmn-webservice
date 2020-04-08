import Router from 'koa-router';
import { getCompanyProfile, addCompany, editCompanyProfile, getUsersByCompany } from '../controllers/company';
import { authMiddleware } from '../middleware/authRequired';

const router = new Router({ prefix: '/company' });

router.post('/', authMiddleware, addCompany);
router.get('/:id', authMiddleware, getCompanyProfile);
router.put('/:id', authMiddleware, editCompanyProfile);
router.put('/:id/users', authMiddleware, getUsersByCompany);
export default router;
