import { Pokemon, PokemonStatus, PokemonType } from "../models/pokemon-model";

export class Context {
    static POKEMON: Pokemon;
    static ENEMIES: Pokemon[];
    static STATUS: PokemonStatus | undefined;
    static PLAYER: string;

    static initialize() {
        Context.POKEMON = {
            id: 0,
            name: "Sin nombre",
            type: PokemonType.Normal,
            life: 0,
            attacks: []
        };
        Context.ENEMIES = [{
            id: 4,
            name: 'Blastoise',
            type: PokemonType.Water,
            life: 1000
        },{
            id: 7,
            name: 'Venasaur',
            type: PokemonType.Grass,
            life: 1000
        },{
            id: 9,
            name: 'Nidoran',
            type: PokemonType.Normal,
            life: 1000
        }];
        Context.STATUS = PokemonStatus.Available;
        Context.PLAYER = 'Renato';
    }
}
