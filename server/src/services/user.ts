import { users } from '../utils/db';

const userProfile = (userId: string) => {
  return users && users.find(user => user.id === userId);
};

export { userProfile };
