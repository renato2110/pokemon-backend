import { Context } from "../common/config/context";
import { Pokemon, PokemonAttack, PokemonStatus } from "../common/models/pokemon-model";

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
   * Sets the current Pokemon life.
   * @param {number} life - New Pokemon life.
   */
  static setPokemonLife(life: number): void {
    Context.POKEMON.life = life;
  }

  /**
   * Gets the current Pokemon status.
   */
  static getPokemonStatus(): PokemonStatus | undefined {
    return Context.STATUS;
  }

  /**
   * Sets the current Pokemon Status.
   * @param {PokemonStatus} status - New Pokemon status.
   */
  static setPokemonStatus(status: PokemonStatus): void {
    Context.STATUS = status;
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
}
