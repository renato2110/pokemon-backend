import { PokemonType } from "../models/pokemon-model";

type TypeModifiers = {
  [attacker in PokemonType]: {
    [defender in PokemonType]: number;
  };
};

export const TYPE_MODIFIERS: TypeModifiers = {
  [PokemonType.Fire]: { [PokemonType.Water]: 0.75, [PokemonType.Grass]: 1.5, [PokemonType.Normal]: 1, [PokemonType.Fire]: 1 },
  [PokemonType.Grass]: { [PokemonType.Water]: 1.5, [PokemonType.Grass]: 1, [PokemonType.Normal]: 1, [PokemonType.Fire]: 0.75 },
  [PokemonType.Normal]: { [PokemonType.Water]: 1, [PokemonType.Grass]: 1, [PokemonType.Normal]: 1, [PokemonType.Fire]: 1 },
  [PokemonType.Water]: { [PokemonType.Water]: 1, [PokemonType.Grass]: 0.75, [PokemonType.Normal]: 1, [PokemonType.Fire]: 1.5 }
};