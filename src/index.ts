import express from "express";
import { router as PokemonRouter } from "./routes/router";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './routes/swagger.json';
import * as dotenv from 'dotenv';
import { Context } from "./common/config/context";
var cors = require('cors')

const PORT = 3000;

dotenv.config();
const app = express();
app.use(cors())
Context.initialize();

app.use(express.json());

app.listen(PORT, () => {
  app.use('/pokemon/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(PokemonRouter);
  console.log(`Pokemon Server in now running on: http://localhost:${PORT}`);
});

export { app };