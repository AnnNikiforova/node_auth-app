import { ApiError } from '../exeptions/api.error.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation.js';
import { emailService } from '../services/email.service.js';

const updateName = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (validateName(name)) {
    throw ApiError.badRequest(validateName(name));
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.name = name;
  await user.save();

  res.send({ message: 'Name updated successfully', name: user.name });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
  const userId = req.user.id;

  if (validatePassword(newPassword)) {
    throw ApiError.badRequest(validatePassword(newPassword));
  }

  const errors = {
    password: validateEmail(newPassword),
  };

  if (!newPassword || errors.password) {
    throw ApiError.badRequest('Invalid password', errors);
  }

  if (newPassword !== newPasswordConfirm) {
    throw ApiError.badRequest('Passwords do not match');
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.password) {
    throw ApiError.badRequest(
      'This account does not have a password. Use password reset flow.',
    );
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw ApiError.badRequest('Old password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.send({ message: 'Password updated successfully' });
};

const updateEmail = async (req, res) => {
  const { password, newEmail, newEmailConfirm } = req.body;
  const userId = req.user.id;

  if (newEmail !== newEmailConfirm) {
    throw ApiError.badRequest('Emails do not match');
  }

  const errors = {
    email: validateEmail(newEmail),
  };

  if (!newEmail || errors.email) {
    throw ApiError.badRequest('Invalid email', errors);
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Password is incorrect');
  }

  const existingUser = await User.findOne({ where: { email: newEmail } });

  if (existingUser) {
    throw ApiError.badRequest('Email is already in use');
  }

  const oldEmail = user.email;

  user.email = newEmail;
  await user.save();

  await emailService.sendUpdateEmail(oldEmail, newEmail);

  res.send({ message: 'Email updated successfully' });
};

export const userController = {
  updateName,
  updatePassword,
  updateEmail,
};
