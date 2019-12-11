import Koa from 'koa';
import koaCors from "@koa/cors";
import router from './roters';

export async function init() {
  const app = new Koa();

  app.use(koaCors({
		credentials: true
	}));
  
  app.use(router.routes());

  const port = 3649;

  await new Promise((resolve) => app.listen(port, () => resolve()));
	console.log(`Rest started on http://localhost:${port}`);
}
