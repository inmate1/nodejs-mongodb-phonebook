import express from 'express';
import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  createContactController,
  deleteContactController,
  getContactsController,
  patchContactController,
} from '../controllers/contact.js';
import { contactCreateSchema } from '../validation/contact.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactRouter = Router();

// JSON парсер с настройками
const jsonParser = express.json({
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb',
});

// Использование аутентификации для всех маршрутов
contactRouter.use(authenticate);

// Получение всех контактов
contactRouter.get('/', ctrlWrapper(getContactsController));

// Создание нового контакта
contactRouter.post(
  '/',
  validateBody(contactCreateSchema),
  ctrlWrapper(createContactController),
);

// Обновление контакта
contactRouter.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(contactCreateSchema),
  ctrlWrapper(patchContactController),
);

// Удаление контакта
contactRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactRouter;
