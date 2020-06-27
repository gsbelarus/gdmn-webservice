import { users } from './dao/db';

const findeByUserId = async (userId: string) => users.find(user => user.id === userId);

const findByUserName = async (userName: string) => users.find(user => user.id === userName);

export { findeByUserId, findByUserName };
