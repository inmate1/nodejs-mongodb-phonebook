import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './utils/env.js';
import userRouter from './routers/users.js';
import contactRouter from './routers/contact.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  // app.use(cors());
  // const cors = require('cors');
  app.use(cors({
    origin: env("FRONTEND_DOMAIN")
  }));

  app.use('/users', userRouter);
  app.use('/contacts', contactRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
