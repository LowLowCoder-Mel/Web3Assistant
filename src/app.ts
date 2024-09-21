import Koa from 'koa';
import { router } from './router';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import { logger } from './logging';
import bodyParser from 'koa-bodyparser';
dotenv.config();

const app = new Koa();


app.use(cors());
app.use(bodyParser());
app.use(router.routes());

app.listen(
  parseInt(process.env.SERVER_PORT as string),
  process.env.SERVER_IP,
  () => {
    logger.info(
      `server start to listen at ${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
    );
  }
);
