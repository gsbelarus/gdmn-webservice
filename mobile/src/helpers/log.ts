export const log = (...message: string[]) => {
  if (__DEV__) {
    console.log(new Date().toTimeString(), ...message);
  }
};
