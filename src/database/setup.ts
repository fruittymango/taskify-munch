import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import '../helpers/loadEnv';

const dbName = process.env.DB_NAME as string;
const dbUserName = process.env.DB_USERNAME as string;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = process.env.DB_URL;
const dbDriver = process.env.DB_DIALECT as Dialect;

const sequelizeConnection = new Sequelize({
  database: dbName,
  username: dbUserName,
  password: dbPassword,
  storage: dbUrl,
  dialect: dbDriver,
  models: [__dirname + '/models/*.model.ts'],
  logging:false
});

export default sequelizeConnection;