import 'dotenv/config';

export default {
  DB_URL: process.env.DB_URL as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
};
