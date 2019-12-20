import Router from 'koa-router';
import Auth from './auth.router';
import Organisation from './organisation.router';
import Device from './device.router';
import User from './user.router';

const rootRouter = new Router({prefix: '/api'});

for (const route of [Auth, Organisation, Device, User]) {
	rootRouter.use(route.routes());
}

export default rootRouter;
