import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import logger from './utils/logger';
import router from './routes';
import deserializeUser from './middleware/deserializeUser';
import cors from 'cors';

dotenv.config();

const port = config.get<number>('port');

const app = express();

app.use(express.json());
app.use(cors());
app.use(deserializeUser);

app.use(router);

app.listen(port, () => {
  logger.info('App is running!');
});
