import { findByUserName, findeByUserId } from './userService';
import { authenticate } from './AuthService';

const userService = {
  findByUserName,
  findeByUserId,
};

const authService = {
  authenticate,
};

export { authService, userService };
