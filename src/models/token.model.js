import { DataTypes } from 'sequelize';
import { client } from '../utils/db.js';
import { User } from './user.model.js';

export const Token = client.define('token', {
  refreshToken: {
    type: DataTypes.STRING(512),
    allowNull: false,
    unique: true,
  },
});

Token.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',
});

User.hasOne(Token, {
  foreignKey: { name: 'userId', allowNull: false },
});
