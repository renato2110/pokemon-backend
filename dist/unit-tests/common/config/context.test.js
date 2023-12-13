"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_model_1 = require("../../../common/models/pokemon-model");
const chai_1 = require("chai");
const context_1 = require("../../../common/config/context");
const pokemon_constants_1 = require("../../../common/constants/pokemon-constants");
const gym_model_1 = require("../../../common/models/gym-model");
// GIVEN
describe('Context', () => {
    // WHEN
    beforeEach(() => {
        context_1.Context.initialize();
    });
    // THEN
    it('should initialize POKEMON with default values', () => {
        (0, chai_1.expect)(context_1.Context.POKEMON.player).to.equal(pokemon_constants_1.PLAYER_NAME);
        (0, chai_1.expect)(context_1.Context.POKEMON.name).to.equal('Sin nombre');
        (0, chai_1.expect)(context_1.Context.POKEMON.type).to.equal(pokemon_model_1.PokemonType.Normal);
        (0, chai_1.expect)(context_1.Context.POKEMON.life).to.equal(0);
        (0, chai_1.expect)(context_1.Context.POKEMON.attacks).to.deep.equal([]);
    });
    it('should initialize ENEMIES with default values', () => {
        (0, chai_1.expect)(context_1.Context.ENEMIES).to.have.lengthOf(0);
    });
    it('should initialize State with Available', () => {
        (0, chai_1.expect)(context_1.Context.POKEMON.state).to.equal(pokemon_model_1.PokemonState.AVAILABLE);
    });
    it('should initialize Gym State with In Battle', () => {
        (0, chai_1.expect)(context_1.Context.POKEMON_GYM_STATE).to.equal(gym_model_1.PokemonGymState.IN_BATTLE);
    });
});
