
import { array, boolean, number, object, string } from 'yup';
import { PokemonType } from "../common/models/pokemon-model";

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
    pokemonId: number().required(),
    attackId: number().required()
});

export const FinishBattleSchema = object().shape({
    victory: boolean().required()
});