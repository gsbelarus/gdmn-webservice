import Router from 'koa-router';
import {
  getUsersByDevice,
  getUsers,
  getUsersByCompany,
  addCompany,
  removeUsers,
  removeUsersFromCompany,
  editProfile,
} from '../controllers/user';

const router = new Router({ prefix: '/user' });

router.get('/byDevice', getUsersByDevice);
router.get('/all', getUsers);
router.get('/byCompany', getUsersByCompany);
router.put('/profile', editProfile);
router.post('/addCompany', addCompany);
router.post('/removeUsers', removeUsers);
router.post('/removeUsersFromCompany', removeUsersFromCompany);

export default router;
