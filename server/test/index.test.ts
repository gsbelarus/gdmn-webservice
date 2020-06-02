import { initEnvironment } from './_test-environment';

beforeAll(async () => {
  await initEnvironment();
});

require('./middleware.spec');
require('./auth.test');
