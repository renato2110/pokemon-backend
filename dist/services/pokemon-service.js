"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonService = void 0;
const context_1 = require("../common/config/context");
class PokemonService {
    /**
     * Gets the current Pokemon.
     */
    static getPokemon() {
        return context_1.Context.POKEMON;
    }
    /**
     * Sets the current information about the Pokemon.
     * @param {Pokemon} pokemon - New Pokemon information.
     */
    static setPokemon(pokemon) {
        context_1.Context.POKEMON = pokemon;
    }
    /**
     * Gets the current Pokemon attacks.
     */
    static getPokemonAttacks() {
        return context_1.Context.POKEMON.attacks;
    }
    /**
     * Gets the current Pokemon state.
     */
    static getPokemonState() {
        return context_1.Context.POKEMON.state;
    }
    /**
     * Sets the current Pokemon State.
     * @param {PokemonState} state - New Pokemon state.
     */
    static setPokemonState(state) {
        context_1.Context.POKEMON.state = state;
    }
    /**
     * Gets the current Pokemon enemies.
     */
    static getPokemonEnemies() {
        return context_1.Context.ENEMIES;
    }
    /**
     * Sets the current Pokemon Enemies.
     * @param {Pokemon[]} enemies - New Pokemon enemies.
     */
    static setPokemonEnemies(enemies) {
        context_1.Context.ENEMIES = enemies;
    }
    /**
     * Gets the current Pokemon Gym State.
     */
    static getPokemonGymState() {
        return context_1.Context.POKEMON_GYM_STATE;
    }
    /**
     * Sets the current Pokemon Gym state.
     * @param {PokemonGymState} state - New Pokemon Gym state.
     */
    static setPokemonGymState(state) {
        context_1.Context.POKEMON_GYM_STATE = state;
    }
}
exports.PokemonService = PokemonService;
