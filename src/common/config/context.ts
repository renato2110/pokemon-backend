import { Pokemon, PokemonStatus, PokemonType } from "../models/pokemon-model";

export class Context {
    static POKEMON: Pokemon;
    static ENEMIES: Pokemon[];
    static STATUS: PokemonStatus | undefined;

    static initialize() {
        Context.POKEMON = {
            name: "Sin nombre",
            type: PokemonType.Normal,
            life: 0,
            attacks: [],
            player: "Renato"
        };
        Context.ENEMIES = [{
            name: 'Blastoise',
            type: PokemonType.Water,
            life: 1000,
            player: "Jugador 1"
        },{
            name: 'Venasaur',
            type: PokemonType.Grass,
            life: 1000,
            player: "Jugador 2"
        },{
            name: 'Nidoran',
            type: PokemonType.Normal,
            life: 1000,
            player: "Jugador 3"
        }];
        Context.STATUS = PokemonStatus.Available;
    }
}
