import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Swift-data.db',
  logging: false,
});

export default sequelize;
