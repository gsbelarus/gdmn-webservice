import crypto from 'crypto';

export const generateCode = (world: string) => {
  const code = crypto.createHmac('sha256', Math.random().toString(32)).update(world).digest('hex');
  return code.substr(0, 6);
} 
