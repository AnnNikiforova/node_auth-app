import { DataTypes } from 'sequelize';
import { client } from '../utils/db.js';
import { Token } from './token.model.js';

export const User = client.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activationToken: {
    type: DataTypes.STRING,
  },
});

User.hasMany(Token, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',
});

Token.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',
});
