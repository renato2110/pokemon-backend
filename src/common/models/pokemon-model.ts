
export interface Pokemon {
  name: string;
  type: PokemonType;
  life: number;
  attacks?: PokemonAttack[];
  player: string;
}

export interface PokemonAttack {
  type: PokemonType;
  power: number;
}

export enum PokemonType {
  Fire = "fuego",
  Grass = "planta",
  Normal = "normal",
  Water = "agua",
}

export enum PokemonStatus {
  Attacking = "atacando",
  Available = "disponible",
  Defeated = 'derrotado',
  InBattle = "en-batalla"
}
