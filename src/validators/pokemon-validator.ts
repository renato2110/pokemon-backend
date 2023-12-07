
import { array, boolean, number, object, string } from 'yup';
import { PokemonState, PokemonType } from "../common/models/pokemon-model";
import { PokemonGymState } from '../common/models/gym-model';

const lifeSchema = number().min(1).max(9999).required();
const typeSchema = string().required().oneOf(Object.values(PokemonType));
const powerSchema = number().min(0).max(100).required();

const attackSchema = object().shape({
    type: typeSchema,
    power: powerSchema,
});

export const SavePokemonSchema = object().shape({
    name: string().required(),
    type: typeSchema,
    life: lifeSchema,
    attacks: array().of(attackSchema).min(1).max(4).required()
});

export const EditPokemonLifeSchema = object().shape({
    life: number().min(0).max(9999).required()
});

export const SendPokemonAttackSchema = object().shape({
    targetPlayer: string().required(),
    attackId: number().required()
});

export const FinishBattleSchema = object().shape({
    victory: boolean().required()
});

const playerSchema = object().shape({
    playerName: string().required(),
    state: string().required().oneOf(Object.values(PokemonState)),
    pokemon: SavePokemonSchema
});

export const SetGymInfoSchema = object().shape({
    state: string().required().oneOf(Object.values(PokemonGymState)),
    playerInformationList: array().of(playerSchema).min(1).max(4).required()
});