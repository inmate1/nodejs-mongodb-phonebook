import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.string().required(),
});
