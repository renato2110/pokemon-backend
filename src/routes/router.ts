
import express from 'express';
import { PokemonController } from '../controllers/pokemon-controller';
import { Logger } from '../middlewares/logger';

export const router = express.Router();
const logger = new Logger();

router.put('/pokemon/iniciar', logger.logRequest(), PokemonController.setPokemonAttributes);

router.get('/pokemon/info', logger.logRequest(), PokemonController.getPokemonInfo);

router.post('/pokemon/atacar', logger.logRequest(), PokemonController.sendPokemonAttack);
router.post('/pokemon/unirse', logger.logRequest(), PokemonController.joinToBattle);