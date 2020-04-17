import Router from 'koa-router';
import { getCompanyProfile, addCompany, editCompanyProfile, getUsersByCompany } from '../controllers/company';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/companies' });

router.post('/', compose([authMiddleware, deviceMiddleware]), addCompany);
router.get('/:id', compose([authMiddleware, deviceMiddleware]), getCompanyProfile);
router.put('/:id', compose([authMiddleware, deviceMiddleware]), editCompanyProfile);
router.get('/:id/users', compose([authMiddleware, deviceMiddleware]), getUsersByCompany);

export default router;
