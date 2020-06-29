import { ICompany } from '../../../common';
import { companies, users } from './dao/db';
import { userService } from '.';
import { IUserProfile } from '../../../common/models';
import { makeProfile } from '../controllers/user';

/**
 * Добавление новой организации
 * @param {string} title - наименование организации
 * @return id, идентификатор организации
 * */
const addOne = async (company: ICompany): Promise<string> => {
  /*
    1. Проверяем что организация существует
    2. Добавляем организацию
    3. К текущему пользователю записываем созданную организацию
    4. К администратору добавляем созданную организацию
  */
  if (await companies.find(el => el.title === company.title)) {
    throw new Error('company already exists');
  }
  const companyId = await companies.insert(company);

  await userService.addCompanyToUser(company.admin, company.title);
  await userService.addCompanyToUser('gdmn', company.title);

  return companyId;
};

/**
 * Возвращает одну организацию
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findOne = async (id: string): Promise<ICompany> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('company not found');
  }

  return company;
};

/**
 * Возвращает все органиции
 * @param {string} id - идентификатор организации
 * @return company, организация
 * */
const findAll = async (): Promise<ICompany[]> => {
  return companies.read();
};

/**
 * Обновляет одну организацию
 * @param {ICompany} company - организациия
 * @return id, идентификатор организации
 * */
const updateOne = async (company: ICompany): Promise<string> => {
  if (!(await companies.find(company.id))) {
    throw new Error('company not found');
  }

  await companies.update(company);

  return company.id;
};

/**
 * Удаляет одну организацию
 * @param {string} id - идентификатор организации
 * */
const deleteOne = async (company: ICompany): Promise<void> => {
  /*
    1. Проверяем что организация существует
    2. Удаляем у пользователей организацию
    3. Удаляем организацию
  */
  if (!(await companies.find(company.id))) {
    throw new Error('company not found');
  }

  await companies.delete(company.id);
};

/**
 * Возвращает пользователей организации
 * @param {string} id - идентификатор организации
 * @return users, пользователи
 * */
const findUsers = async (id: string): Promise<IUserProfile[]> => {
  const company = await companies.find(id);

  if (!company) {
    throw new Error('company not found');
  }

  // TODO заменить на company.title на companyId
  return (await users.read()).filter(el => el.companies?.some(i => i === company.title)).map(el => makeProfile(el));
};

export { findOne, findAll, addOne, updateOne, deleteOne, findUsers };
