import { init } from './rest';

export default async function run() {
  await init();
}

if (!module.parent) {
  run().then(() => {
    console.log('Server started successful');
  }).catch((err) => {
    console.error('!!! SERVER DROPPED BY ERROR !!!');
    console.error(err instanceof Error || typeof err !== 'object' ? err : '!!! undefined error !!!');
		process.exit(1);
  });
}
