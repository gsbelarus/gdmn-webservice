import Router from 'koa-router';
import { getCompanyProfile, addCompany, editCompanyProfile, getUsersByCompany } from '../controllers/company';
import { chainMiddleware } from '../middleware/chainMiddleware';

const router = new Router({ prefix: '/companies' });

router.post('/', chainMiddleware, addCompany);
router.get('/:id', chainMiddleware, getCompanyProfile);
router.put('/:id', chainMiddleware, editCompanyProfile);
router.get('/:id/users', chainMiddleware, getUsersByCompany);

export default router;
