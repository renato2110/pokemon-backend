"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const pokemon_controller_1 = require("../controllers/pokemon-controller");
const logger_1 = require("../middlewares/logger");
exports.router = express_1.default.Router();
const logger = new logger_1.Logger();
exports.router.put('/pokemon/iniciar', logger.logRequest(), pokemon_controller_1.PokemonController.setPokemonAttributes);
exports.router.get('/pokemon/info', logger.logRequest(), pokemon_controller_1.PokemonController.getPokemonInfo);
exports.router.post('/pokemon/atacar', logger.logRequest(), pokemon_controller_1.PokemonController.sendPokemonAttack);
exports.router.post('/pokemon/unirse', logger.logRequest(), pokemon_controller_1.PokemonController.joinToBattle);
