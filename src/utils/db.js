import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const client = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  //   user: process.env.DB_USERNAME || 'postgres',
  //   password: process.env.DB_PASSWORD || '123456',
  //   database: process.env.DB_DATABASE || 'postgres',

  //   port: process.env.DB_PORT || 5432,

  //   dialect: 'postgres',

  // host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
});
