import { Context } from "../common/config/context";
import { Pokemon, PokemonStatus } from "../common/models/pokemon-model";

export class PokemonService {
  static getPokemon() {
    return Context.POKEMON;
  }

  static setPokemon(pokemon: Pokemon) {
    Context.POKEMON = pokemon;
  }

  static getPokemonAttacks() {
    return Context.POKEMON.attacks;
  }

  static setPokemonLife(life: number) {
    Context.POKEMON.life = life;
  }

  static getPokemonStatus() {
    return Context.STATUS;
  }

  static setPokemonStatus(status: PokemonStatus) {
    Context.STATUS = status;
  }

  static getPokemonEnemies() {
    return Context.ENEMIES;
  }

  static setPokemonEnemies(enemies: Pokemon[]) {
    Context.ENEMIES = enemies;
  }
}
