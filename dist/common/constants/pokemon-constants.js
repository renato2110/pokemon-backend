"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_NAME = exports.TYPE_MODIFIERS = void 0;
const pokemon_model_1 = require("../models/pokemon-model");
exports.TYPE_MODIFIERS = {
    [pokemon_model_1.PokemonType.Fire]: { [pokemon_model_1.PokemonType.Water]: 0.75, [pokemon_model_1.PokemonType.Grass]: 1.5, [pokemon_model_1.PokemonType.Normal]: 1, [pokemon_model_1.PokemonType.Fire]: 1 },
    [pokemon_model_1.PokemonType.Grass]: { [pokemon_model_1.PokemonType.Water]: 1.5, [pokemon_model_1.PokemonType.Grass]: 1, [pokemon_model_1.PokemonType.Normal]: 1, [pokemon_model_1.PokemonType.Fire]: 0.75 },
    [pokemon_model_1.PokemonType.Normal]: { [pokemon_model_1.PokemonType.Water]: 1, [pokemon_model_1.PokemonType.Grass]: 1, [pokemon_model_1.PokemonType.Normal]: 1, [pokemon_model_1.PokemonType.Fire]: 1 },
    [pokemon_model_1.PokemonType.Water]: { [pokemon_model_1.PokemonType.Water]: 1, [pokemon_model_1.PokemonType.Grass]: 0.75, [pokemon_model_1.PokemonType.Normal]: 1, [pokemon_model_1.PokemonType.Fire]: 1.5 }
};
exports.PLAYER_NAME = "Renato";
