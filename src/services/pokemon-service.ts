import { Context } from "../common/config/context";
import { PokemonGymState } from "../common/models/gym-model";
import { Pokemon, PokemonAttack, PokemonState } from "../common/models/pokemon-model";

export class PokemonService {
  /**
   * Gets the current Pokemon.
   */
  static getPokemon(): Pokemon {
    return Context.POKEMON;
  }

  /**
   * Sets the current information about the Pokemon.
   * @param {Pokemon} pokemon - New Pokemon information.
   */
  static setPokemon(pokemon: Pokemon): void {
    Context.POKEMON = pokemon;
  }

  /**
   * Gets the current Pokemon attacks.
   */
  static getPokemonAttacks(): PokemonAttack[] | undefined {
    return Context.POKEMON.attacks;
  }

  /**
   * Gets the current Pokemon state.
   */
  static getPokemonState(): PokemonState | undefined {
    return Context.POKEMON.state;
  }

  /**
   * Sets the current Pokemon State.
   * @param {PokemonState} state - New Pokemon state.
   */
  static setPokemonState(state: PokemonState): void {
    Context.POKEMON.state = state;
  }

  /**
   * Gets the current Pokemon enemies.
   */
  static getPokemonEnemies(): Pokemon[] {
    return Context.ENEMIES;
  }

  /**
   * Sets the current Pokemon Enemies.
   * @param {Pokemon[]} enemies - New Pokemon enemies.
   */
  static setPokemonEnemies(enemies: Pokemon[]): void {
    Context.ENEMIES = enemies;
  }

  /**
   * Gets the current Pokemon Gym State.
   */
  static getPokemonGymState(): PokemonGymState {
    return Context.POKEMON_GYM_STATE;
  }

  /**
   * Sets the current Pokemon Gym state.
   * @param {PokemonGymState} state - New Pokemon Gym state.
   */
  static setPokemonGymState(state: PokemonGymState): void {
    Context.POKEMON_GYM_STATE = state;
  }
}
