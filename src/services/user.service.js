import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model.js';
import { ApiError } from '../exeptions/api.error.js';
import { emailService } from './email.service.js';
import { Token } from '../models/token.model.js';

const normalize = ({ id, name, email }) => {
  return { id, name, email };
};

const findByEmail = (email) => {
  return User.findOne({ where: { email } });
};

const register = async (name, email, password) => {
  const activationToken = uuidv4();

  const existUser = await findByEmail(email);

  if (existUser) {
    throw ApiError.BadRequest('User already exists', {
      email: 'User already exists',
    });
  }

  await User.create({
    name,
    email,
    password,
    activationToken,
  });

  await emailService.sendActivationEmail(email, activationToken);
};

const passwordReset = async (email) => {
  const resetToken = uuidv4();

  const user = await findByEmail(email);

  if (!user) {
    throw ApiError.badRequest('No such user');
  }

  user.activationToken = resetToken;
  await user.save();

  await emailService.sendResetEmail(email, resetToken);
};

const save = async (userId, newToken) => {
  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    await Token.create({ userId, refreshToken: newToken });

    return;
  }

  token.refreshToken = newToken;

  await token.save();
};

const getByToken = (refreshToken) => {
  return Token.findOne({ where: { refreshToken } });
};

const remove = (userId) => {
  return Token.destroy({ where: { userId } });
};

export const userService = {
  normalize,
  findByEmail,
  register,
  passwordReset,
  save,
  getByToken,
  remove,
};
