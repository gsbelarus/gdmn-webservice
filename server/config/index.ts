import dev from './dev';
import test from './test';

export default process.env.NODE_ENV === 'test' ? test : dev;
