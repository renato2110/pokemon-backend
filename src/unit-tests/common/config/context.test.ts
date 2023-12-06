import { PokemonStatus, PokemonType } from "../../../common/models/pokemon-model";

import { expect } from 'chai';
import { Context } from '../../../common/config/context';

// GIVEN
describe('Context', () => {
    // WHEN
    beforeEach(() => {
        Context.initialize();
    });

    // THEN
    it('should initialize POKEMON with default values', () => {
        expect(Context.POKEMON.id).to.equal(0);
        expect(Context.POKEMON.name).to.equal('Sin nombre');
        expect(Context.POKEMON.type).to.equal(PokemonType.Normal);
        expect(Context.POKEMON.life).to.equal(0);
        expect(Context.POKEMON.attacks).to.deep.equal([]);
    });

    it('should initialize ENEMIES with default values', () => {
        expect(Context.ENEMIES).to.have.lengthOf(3);
        expect(Context.ENEMIES[0].name).to.equal('Blastoise');
        expect(Context.ENEMIES[1].type).to.equal(PokemonType.Grass);
    });

    it('should initialize STATUS with Available', () => {
        expect(Context.STATUS).to.equal(PokemonStatus.Available);
    });
});
