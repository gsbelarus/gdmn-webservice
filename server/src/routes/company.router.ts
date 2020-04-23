import Router from 'koa-router';
import {
  addCompany,
  editCompanyProfile,
  getCompanyProfile,
  getUsersByCompany,
  getCompanies,
  deleteCompany,
} from '../controllers/company';
import compose from 'koa-compose';
import { authMiddleware } from '../middleware/authRequired';
import { deviceMiddleware } from '../middleware/deviceRequired';

const router = new Router({ prefix: '/companies' });

router.post('/', compose([authMiddleware, deviceMiddleware]), addCompany);
router.get('/:id', compose([authMiddleware, deviceMiddleware]), getCompanyProfile);
router.patch('/:id', compose([authMiddleware, deviceMiddleware]), editCompanyProfile);
router.get('/:id/users', compose([authMiddleware, deviceMiddleware]), getUsersByCompany);
router.delete('/:id', compose([authMiddleware, deviceMiddleware]), deleteCompany);
router.get('/', compose([authMiddleware, deviceMiddleware]), getCompanies);

export default router;
