
import express from 'express';
import { PokemonController } from '../controllers/pokemon-controller';
import { Logger } from '../middlewares/logger';

export const router = express.Router();
const logger = new Logger();

router.put('/pokemon/iniciar', logger.logRequest(), PokemonController.setPokemonAttributes);

router.get('/pokemon/enemigos', logger.logRequest(), PokemonController.getPokemonEnemies);
router.get('/pokemon/info', logger.logRequest(), PokemonController.getPokemonInfo);

router.post('/pokemon/atacar', logger.logRequest(), PokemonController.sendPokemonAttack);
router.post('/pokemon/iniciar-turno', logger.logRequest(), PokemonController.initializeTurn);
router.post('/pokemon/editar-vida', logger.logRequest(), PokemonController.editPokemonLife);
router.post('/pokemon/terminar-partida', logger.logRequest(), PokemonController.finishBattle);