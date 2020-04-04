import Router from 'koa-router';
import { addCompany, editProfile } from '../controllers/user';
import { getCompaniesByUser, getProfile } from '../controllers/company';

const router = new Router({ prefix: '/company' });

router.post('/new', addCompany);
router.get('/byUser', getCompaniesByUser);
router.get('/profile', getProfile);
router.post('/editeProfile', editProfile);

export default router;
