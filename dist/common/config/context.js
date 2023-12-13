"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const gym_model_1 = require("../models/gym-model");
const pokemon_model_1 = require("../models/pokemon-model");
const pokemon_constants_1 = require("../constants/pokemon-constants");
class Context {
    static POKEMON;
    static ENEMIES;
    static POKEMON_GYM_STATE;
    static initialize() {
        Context.POKEMON = {
            name: "Sin nombre",
            type: pokemon_model_1.PokemonType.Normal,
            life: 0,
            attacks: [],
            player: pokemon_constants_1.PLAYER_NAME,
            state: pokemon_model_1.PokemonState.AVAILABLE
        };
        Context.ENEMIES = [];
        Context.POKEMON_GYM_STATE = gym_model_1.PokemonGymState.IN_BATTLE;
    }
}
exports.Context = Context;
