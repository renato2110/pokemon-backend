import { PokemonGymState } from "../models/gym-model";
import { Pokemon, PokemonState, PokemonType } from "../models/pokemon-model";
import { PLAYER_NAME } from "../constants/pokemon-constants";

export class Context {
    static POKEMON: Pokemon;
    static ENEMIES: Pokemon[];
    static STATE: PokemonState | undefined;
    static POKEMON_GYM_STATE: PokemonGymState;

    static initialize() {
        Context.POKEMON = {
            name: "Sin nombre",
            type: PokemonType.Normal,
            life: 0,
            attacks: [],
            player: PLAYER_NAME
        };
        Context.ENEMIES = [];
        Context.STATE = PokemonState.AVAILABLE;
        Context.POKEMON_GYM_STATE = PokemonGymState.IN_BATTLE;
    }
}
