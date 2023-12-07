import { Pokemon, PokemonState } from "./pokemon-model";

export interface PokemonGym {
    id: number,
    state: PokemonGymState;
    playerInformationList: PlayerInformation[];
}

export interface PlayerInformation {
    playerName: string;
    state: PokemonState;
    pokemon: Pokemon;
}

export enum PokemonGymState {
    IN_BATTLE = "EN_BATALLA",
    LOBBY = "LOBBY",
    OVER = "TERMINADA"
  }