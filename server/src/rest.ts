import Koa from 'koa';

export async function init() {
  const app = new Koa();

  const port = 3649;

  await new Promise((resolve) => app.listen(port, () => resolve()));
	console.log(`Rest started on http://localhost:${port}`);
}
