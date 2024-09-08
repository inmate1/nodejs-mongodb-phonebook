import createHttpError from 'http-errors';
import {
  findUserByEmail,
  createUser,
  updateUserWithToken,
  resetToken,
} from '../services/users.js';
import bcrypt from 'bcrypt';

export const userRegisterController = async (req, res, next) => {
  const { email, name } = req.body;
  const user = await findUserByEmail(email);

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const newUser = await createUser(req.body);

  res.status(201).json({
    user: { name, email },
    token: newUser.token,
  });
};

export const userLoginController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Unauthorized');
  }

  const updatedUser = await updateUserWithToken(user._id);

  res.json({
    user: { name: updatedUser.name, email: updatedUser.email },
    token: updatedUser.token,
  });
};

export const logoutController = async (req, res, next) => {
  const userId = req.user._id;
  await resetToken(userId);

  res.status(204).end();
};

export const getCurrentUsserController = (req, res, next) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
};
