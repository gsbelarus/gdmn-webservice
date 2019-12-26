import Router from 'koa-router';
import { IUser, IDevice } from '../models';
import { readFile, writeFile } from '../workWithFile';
import { PATH_LOCAL_DB_USERS, PATH_LOCAL_DB_DEVICES } from '../rest';
import log4js from 'log4js';

const logger = log4js.getLogger('SERVER');
logger.level = 'trace';

const router = new Router({prefix: '/user'});

router.get('/byDevice', ctx => getUsersByDevice(ctx));
router.post('/edite', ctx => editeProfile(ctx));

const getUsersByDevice = async (ctx: any) => {
  const {idDevice} = ctx.query;
  const allDevices: IDevice[] | undefined = await readFile(PATH_LOCAL_DB_DEVICES);
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  ctx.body = JSON.stringify({
    status: 200,
    result: !allDevices || !allDevices.length
    ? []
    : allDevices
      .filter( device => device.uid === idDevice)
      .map(device => {
        const user = allUsers && allUsers.find(user => user.id === device.user);
        return user ? {user: user.userName, state: device.isBlock ? 'blocked' : 'active'} : 'not found user'
      })
  });
  logger.info('get users by device successfully');
}

const editeProfile = async(ctx: any) => {
  const newUser = ctx.request.body;
  const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
  const idx = allUsers && allUsers.findIndex( user => user.userName === newUser.userName );
  console.log(idx);
  if(!allUsers || idx === undefined || idx < 0) {
    ctx.body = JSON.stringify({ status: 404, result: `no such user(${newUser.userName})`});
    logger.warn(`no such user(${newUser.userName})`);
  } else {
    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify([...allUsers.slice(0, idx), {id: allUsers[idx].id, ...newUser}, ...allUsers.slice(idx + 1)]
      )
    );
    ctx.body = JSON.stringify({ status: 200, result: 'user edited successfully'});
    logger.info('user edited successfully');
  }
}

export default router;
