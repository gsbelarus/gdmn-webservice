import { users } from './dao/db';

const findByUserId = async (userId: string) => users.find(userId);

const findByUserName = async (userName: string) => users.find(user => user.id === userName);

const addCompanyToUser = async (userId: string, companyName: string) => {
  const user = await findByUserId(userId);
  if (user.companies?.some(i => companyName === i)) {
    throw new Error('company already exists');
  }

  return users.update({ ...user, companies: [...user.companies, companyName] });
};

export { findByUserId, findByUserName, addCompanyToUser };
