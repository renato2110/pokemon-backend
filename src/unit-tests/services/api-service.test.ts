import { match, restore, stub } from "sinon";
import { APIService, attackPath, infoPath, joinPath } from "../../services/api-service";
import axios from "axios";
import { expect } from "chai";
import { PokemonService } from "../../services/pokemon-service";
import { PokemonGymState } from "../../common/models/gym-model";
import { PokemonState } from "../../common/models/pokemon-model";


describe('APIService', () => {
    afterEach(() => {
        restore();
    });

    it('should get gym info successfully', async () => {
        // GIVEN
        const axiosGetStub = stub(axios, 'get').resolves({ data: 'GymInfo' });

        // WHEN
        await APIService.getGymInfo();

        //THEN
        expect(axiosGetStub.calledOnceWithExactly(infoPath)).to.be.true;

        axiosGetStub.restore();
    });

    it('should get gym info when gym is down', async () => {
        // GIVEN
        const axiosGetStub = stub(axios, 'get').rejects({ response: { status: 500 } });
        const consoleLogStub = stub(console, 'log');

        // WHEN
        await APIService.getGymInfo();

        // THEN
        expect(axiosGetStub.calledOnceWithExactly(infoPath)).to.be.true;    
        expect(consoleLogStub.calledOnce).to.be.false;

        axiosGetStub.restore();
        consoleLogStub.restore();
    });

    it('should handle errors while getting gym info', async () => {
        // GIVEN
        const axiosGetStub = stub(axios, 'get').rejects({ response: { status: 400 } });

        // WHEN
        await APIService.getGymInfo();

        // THEN
        expect(axiosGetStub.calledOnceWithExactly(infoPath)).to.be.true;
        expect(PokemonService.getPokemonGymState()).to.equal(PokemonGymState.LOBBY);
        expect(PokemonService.getPokemonState()).to.equal(PokemonState.IN_BATTLE);

        axiosGetStub.restore();
    });

    it('should join gym battle successfully', async () => {
        // GIVEN
        const axiosPostStub = stub(axios, 'post').resolves({ data: 'JoinResponse' });

        // WHEN
        const response = await APIService.joinGymBattle();

        // THEN
        expect(axiosPostStub.calledOnceWithExactly(joinPath, match.any)).to.be.true;
        expect(response).to.equal('JoinResponse');

        axiosPostStub.restore();
    });

    it('should handle errors while joining gym battle', async () => {
        // GIVEN
        const axiosPostStub = stub(axios, 'post').rejects(new Error('JoinError'));

        // WHEN
        try {
            await APIService.joinGymBattle();
        } catch (error: any) {
            // THEN
            expect(axiosPostStub.calledOnceWithExactly(joinPath, match.any)).to.be.true;
            expect(error.message).to.equal('JoinError');
        }

        axiosPostStub.restore();
    });

    it('should send attack to gym successfully', async () => {
        // GIVEN
        const axiosPostStub = stub(axios, 'post').resolves({ data: 'AttackResponse' });

        // WHEN
        const response = await APIService.sendAttackToGym(1, 'TargetPlayer');

        // THEN
        expect(axiosPostStub.calledOnceWithExactly(attackPath, match.any)).to.be.true;
        expect(response).to.equal('AttackResponse');

        axiosPostStub.restore();
    });

    it('should handle errors while sending attack to gym', async () => {
        // GIVEN
        const axiosPostStub = stub(axios, 'post').rejects(new Error('AttackError'));

        // WHEN
        try {
            await APIService.sendAttackToGym(1, 'TargetPlayer');
        } catch (error: any) {
            // THEN
            expect(axiosPostStub.calledOnceWithExactly(attackPath, match.any)).to.be.true;
            expect(error.message).to.equal('AttackError');
        }

        axiosPostStub.restore();
    });
});
