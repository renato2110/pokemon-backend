import express from "express";
import { router as PokemonRouter } from "./routes/router";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './routes/swagger.json';
import * as dotenv from 'dotenv';
import { Context } from "./common/config/context";
import { APIService } from "./services/api-service";
var cors = require('cors')
import { Request, Response } from 'express'

const PORT = process.env.PORT || 3000;

dotenv.config();
const app = express();
app.use(cors())
Context.initialize();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

app.listen(PORT, () => {
  app.use('/pokemon/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(PokemonRouter);
  console.log(`Pokemon Server in now running on: http://localhost:${PORT}`);
  
  setInterval(() => {
    APIService.getGymInfo();
  }, 3000);
});

export { app };