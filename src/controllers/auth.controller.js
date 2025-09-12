import { User } from '../models/user.model.js';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';
import { tokenService } from '../services/token.service.js';
import bcrypt from 'bcrypt';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = {
    name: validateName(email),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (name.email || errors.email || errors.password) {
    throw ApiError.badRequest('Bad request', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await userService.register(name, email, hashedPass);
  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await User.findOne({ where: { activationToken } });

  if (!user) {
    res.sendStatus(404);

    return;
  }
  user.activationToken = null;
  await user.save();

  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.badRequest('No such user');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password');
  }

  await generateTokens(res, user);
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  await userService.passwordReset(email);

  res.send({ message: 'OK' });
};

const passwordReset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { activationToken: token } });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  const hashedPass = await bcrypt.hash(password, 10);

  user.password = hashedPass;
  user.activationToken = null;
  await user.save();

  res.send({ message: 'Password has been reset successfully' });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new Error('Error');
  }

  const userData = jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  if (!userData || !token) {
    throw ApiError.unauthorized();
  }

  const user = await userService.findByEmail(userData.email);

  await generateTokens(res, user);
};

const generateTokens = async (res, user) => {
  const normalizedUser = userService.normalize(user);

  const accessToken = jwtService.sign(normalizedUser);
  const refreshAccessToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshAccessToken);

  res.cookie('refreshToken', refreshAccessToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    HttpOnly: true,
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  const userData = jwtService.verifyRefresh(refreshToken);

  if (!userData || !refreshToken) {
    throw ApiError.unauthorized();
  }

  await tokenService.remove(userData.id);
  res.sendStatus(204);
};

export const authController = {
  register,
  activate,
  login,
  requestPasswordReset,
  passwordReset,
  refresh,
  logout,
};
