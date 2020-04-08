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

router.get('/device/:id', getUsersByDevice);
router.get('/', getUsers);
router.get('/company/:id', getUsersByCompany);
router.put('/:id', editProfile);
router.put('/', addCompany);
router.delete('/', removeUsers);
router.put('/withoutCompany/:id', removeUsersFromCompany);

export default router;
