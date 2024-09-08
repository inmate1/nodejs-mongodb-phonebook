import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createUserSchema, loginUserSchema } from '../validation/users.js';
import { validateBody } from '../utils/validateBody.js';
import {
  logoutController,
  userLoginController,
  userRegisterController,
  getCurrentUsserController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.post(
  '/signup',
  validateBody(createUserSchema),
  ctrlWrapper(userRegisterController),
);

userRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(userLoginController),
);

userRouter.post('/logout', authenticate, ctrlWrapper(logoutController));

userRouter.get(
  '/current',
  authenticate,
  ctrlWrapper(getCurrentUsserController),
);

export default userRouter;
