export default {
  jwt: {
    secret: process.env.APP_SECRET || 'nada',
    expiresIn: '5d',
  },
};
