"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetGymInfoSchema = exports.FinishBattleSchema = exports.SendPokemonAttackSchema = exports.EditPokemonLifeSchema = exports.SavePokemonSchema = void 0;
const yup_1 = require("yup");
const pokemon_model_1 = require("../common/models/pokemon-model");
const gym_model_1 = require("../common/models/gym-model");
const lifeSchema = (0, yup_1.number)().min(1).max(9999).required();
const typeSchema = (0, yup_1.string)().required().oneOf(Object.values(pokemon_model_1.PokemonType));
const powerSchema = (0, yup_1.number)().min(0).max(100).required();
const attackSchema = (0, yup_1.object)().shape({
    type: typeSchema,
    power: powerSchema,
});
exports.SavePokemonSchema = (0, yup_1.object)().shape({
    name: (0, yup_1.string)().required(),
    type: typeSchema,
    life: lifeSchema,
    attacks: (0, yup_1.array)().of(attackSchema).min(1).max(4).required()
});
exports.EditPokemonLifeSchema = (0, yup_1.object)().shape({
    life: (0, yup_1.number)().min(0).max(9999).required()
});
exports.SendPokemonAttackSchema = (0, yup_1.object)().shape({
    targetPlayer: (0, yup_1.string)().required(),
    attackId: (0, yup_1.number)().required()
});
exports.FinishBattleSchema = (0, yup_1.object)().shape({
    victory: (0, yup_1.boolean)().required()
});
const playerSchema = (0, yup_1.object)().shape({
    playerName: (0, yup_1.string)().required(),
    state: (0, yup_1.string)().required().oneOf(Object.values(pokemon_model_1.PokemonState)),
    pokemon: exports.SavePokemonSchema
});
exports.SetGymInfoSchema = (0, yup_1.object)().shape({
    state: (0, yup_1.string)().required().oneOf(Object.values(gym_model_1.PokemonGymState)),
    playerInformationList: (0, yup_1.array)().of(playerSchema).min(1).max(4).required()
});
