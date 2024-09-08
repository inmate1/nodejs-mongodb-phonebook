import createHttpError from 'http-errors';
import { findUserById } from '../services/users.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Unauthorized'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Token should be of type Bearer'));
    }

    // Валидация токена с использованием секрета
    const { id } = jwt.verify(token, env('JWT_SECRET'));

    // Поиск пользователя по id
    const user = await findUserById(id);

    // Проверка существования пользователя и соответствия токенов
    if (!user || !user.token || user.token !== token) {
      return next(createHttpError(401, 'User not found or token mismatch'));
    }

    // Добавляем данные пользователя в запрос
    req.user = user;
    next();
  } catch (error) {
    // Обрабатываем ошибки верификации и любые другие
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    return next(createHttpError(500, 'Server error'));
  }
};