import Router from "koa-router";
import log4js from "log4js";
import koaPassport from "koa-passport";
import { promisify } from "util";
import { IUser } from "../models";
import { PATH_LOCAL_DB_USERS } from "../rest";
import { readFile, writeFile } from "../workWithFile";
import { findByUserName } from "./util";

const router = new Router();
const logger = log4js.getLogger("SERVER");
logger.level = "trace";

router.post("/login", async ctx => getLogin(ctx));
router.get("/logout", async ctx => getSignOut(ctx));
router.post("/signup", ctx => signup(ctx));
router.get("/me", ctx => getMe(ctx));

const getLogin = async (ctx: any) => {
  if (!ctx.isUnauthenticated()) {    
    ctx.status = 403;
    ctx.body = JSON.stringify({
      status: 403,
      result: "you are already logged in"
    });
    logger.warn("this user has already logged in");
    return;
  };

  const user = (
    await promisify(cb => {
    koaPassport.authenticate("local", cb)(ctx, async () => {});
  })()) as IUser | false;
    
  if (!user) {
    ctx.status = 404;
    ctx.body = JSON.stringify({
      status: 404,
      result: "wrong password or login"
    });
    logger.info("failed login attempt");
    return;
  }

  ctx.login(user);

  if (ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = JSON.stringify({
      status: 200,
      result: user ? user.id : false
    });
    logger.info(`login user ${user}`);
  }  
};

const getMe = async (ctx: any) => {
  if (ctx.isAuthenticated()) {
    let user = ctx.state.user;
    delete user.password;
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: user });
    logger.info(`user authenticated: ${ctx.state.user.userName}`);
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({ status: 403, result: "not authenticated" });
    logger.info("is unauthenticated");
  }
};

const getSignOut = (ctx: any) => {
  if (ctx.isAuthenticated()) {
    const user = ctx.state.user.userName;
    ctx.logout();
    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: "sign out successful" });
    logger.info(`user ${user} sign out successful`);
  } else {
    ctx.status = 403;
    ctx.body = JSON.stringify({
      status: 403,
      result: "left before or didn’t enter"
    });
    logger.warn("left before or didn’t enter");
  }
};

const signup = async (ctx: any) => {
  const newUser = ctx.request.body as IUser;
  if (!(await findByUserName(newUser.userName))) {
    const allUsers: IUser[] | undefined = await readFile(PATH_LOCAL_DB_USERS);
    //  const code = await saveActivationCode(newUser.userName);
    await writeFile(
      PATH_LOCAL_DB_USERS,
      JSON.stringify(
        allUsers
          ? [...allUsers, { id: newUser.userName, ...newUser }]
          : [
              { id: newUser.userName, ...newUser },
              {
                id: "gdmn",
                userName: "gdmn",
                creatorId: newUser.userName,
                password: "gdmn",
                companies: [],
                code: "jqgxmm"
              }
            ]
      )
    );

    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, result: newUser });
    logger.info("sign up successful");
  } else {
    ctx.status = 404;
    ctx.body = JSON.stringify({
      status: 404,
      result: "such user already exists"
    });
    logger.info("such user already exists");
  }
};

export default router;
