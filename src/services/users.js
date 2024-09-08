// import { Session } from '../db/models/session.js';
import { User } from '../db/models/User.js';
import bcrypt from 'bcrypt';
// import { createNewSession } from '../utils/createNewSession.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const updateUserWithToken = (id) => {
  const token = jwt.sign(
    {
      id,
    },
    env('JWT_SECRET'),
  );

  return User.findByIdAndUpdate(id, { token }, { new: true });
};

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({ ...userData, password: hashedPassword });

  return updateUserWithToken(user._id);
};

export const findUserById = (userId) => User.findById(userId);

export const resetToken = (id) => {
  return User.findByIdAndUpdate(id, { token: '' });
};
