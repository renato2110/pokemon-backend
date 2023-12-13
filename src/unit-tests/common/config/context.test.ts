import { PokemonState, PokemonType } from "../../../common/models/pokemon-model";

import { expect } from 'chai';
import { Context } from '../../../common/config/context';
import { PLAYER_NAME } from "../../../common/constants/pokemon-constants";
import { PokemonGymState } from "../../../common/models/gym-model";

// GIVEN
describe('Context', () => {
    // WHEN
    beforeEach(() => {
        Context.initialize();
    });

    // THEN
    it('should initialize POKEMON with default values', () => {
        expect(Context.POKEMON.player).to.equal(PLAYER_NAME);
        expect(Context.POKEMON.name).to.equal('Sin nombre');
        expect(Context.POKEMON.type).to.equal(PokemonType.Normal);
        expect(Context.POKEMON.life).to.equal(0);
        expect(Context.POKEMON.attacks).to.deep.equal([]);
    });

    it('should initialize ENEMIES with default values', () => {
        expect(Context.ENEMIES).to.have.lengthOf(0);
    });

    it('should initialize State with Available', () => {
        expect(Context.POKEMON.state).to.equal(PokemonState.AVAILABLE);
    });

    it('should initialize Gym State with In Battle', () => {
        expect(Context.POKEMON_GYM_STATE).to.equal(PokemonGymState.IN_BATTLE);
    });
});
