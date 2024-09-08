import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from '../services/contact.js';

// Получение контактов пользователя
export const getContactsController = async (req, res, next) => {
  const userId = req.user._id; // Берем id пользователя из req.user, который добавляется при аутентификации

  const contacts = await getContacts(userId); // Получаем контакты по userId

  res.status(200).json(contacts);
};

// Создание нового контакта
export const createContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { name, number } = req.body;

  // Создаем новый контакт с привязкой к userId
  const contact = await createContact({ name, number, userId });

  res.status(201).json(contact);
};

// Обновление контакта
export const patchContactController = async (req, res, next) => {
  const { id } = req.params; // Предполагаем, что параметр называется id (не contactId)

  // Обновляем контакт по id и userId
  const result = await updateContact(id, { ...req.body }, req.user._id);

  // Проверка, что контакт был найден и обновлен

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const result = await deleteContact(id, req.user._id);
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).end();
};
