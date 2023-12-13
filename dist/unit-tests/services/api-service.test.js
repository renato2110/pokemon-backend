"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = require("sinon");
const api_service_1 = require("../../services/api-service");
const axios_1 = __importDefault(require("axios"));
const chai_1 = require("chai");
const gym_model_1 = require("../../common/models/gym-model");
const pokemon_model_1 = require("../../common/models/pokemon-model");
const context_1 = require("../../common/config/context");
describe('APIService', () => {
    afterEach(() => {
        (0, sinon_1.restore)();
    });
    it('should get gym info successfully', async () => {
        // GIVEN
        const axiosGetStub = (0, sinon_1.stub)(axios_1.default, 'get').resolves({ data: 'GymInfo' });
        // WHEN
        await api_service_1.APIService.getGymInfo();
        //THEN
        (0, chai_1.expect)(axiosGetStub.calledOnceWithExactly(api_service_1.infoPath)).to.be.true;
        axiosGetStub.restore();
    });
    it('should get gym info when gym is down', async () => {
        // GIVEN
        const axiosGetStub = (0, sinon_1.stub)(axios_1.default, 'get').rejects({ response: { status: 500 } });
        const consoleLogStub = (0, sinon_1.stub)(console, 'log');
        // WHEN
        await api_service_1.APIService.getGymInfo();
        // THEN
        (0, chai_1.expect)(axiosGetStub.calledOnceWithExactly(api_service_1.infoPath)).to.be.true;
        (0, chai_1.expect)(consoleLogStub.calledOnce).to.be.false;
        axiosGetStub.restore();
        consoleLogStub.restore();
    });
    it('should handle errors while getting gym info', async () => {
        // GIVEN
        const axiosGetStub = (0, sinon_1.stub)(axios_1.default, 'get').rejects({ response: { status: 400 } });
        try {
            await api_service_1.APIService.getGymInfo();
        }
        catch (error) {
            // THEN
            (0, chai_1.expect)(axiosGetStub.calledOnceWithExactly(api_service_1.infoPath)).to.be.true;
            (0, chai_1.expect)(context_1.Context.POKEMON_GYM_STATE).to.equal(gym_model_1.PokemonGymState.OVER);
            (0, chai_1.expect)(context_1.Context.POKEMON.state).to.equal(pokemon_model_1.PokemonState.IN_BATTLE);
        }
        axiosGetStub.restore();
    });
    it('should join gym battle successfully', async () => {
        // GIVEN
        const axiosPostStub = (0, sinon_1.stub)(axios_1.default, 'post').resolves({ data: 'JoinResponse' });
        // WHEN
        const response = await api_service_1.APIService.joinGymBattle();
        // THEN
        (0, chai_1.expect)(axiosPostStub.calledOnceWithExactly(api_service_1.joinPath, sinon_1.match.any)).to.be.true;
        (0, chai_1.expect)(response).to.equal('JoinResponse');
        axiosPostStub.restore();
    });
    it('should handle errors while joining gym battle', async () => {
        // GIVEN
        const axiosPostStub = (0, sinon_1.stub)(axios_1.default, 'post').rejects(new Error('JoinError'));
        // WHEN
        try {
            await api_service_1.APIService.joinGymBattle();
        }
        catch (error) {
            // THEN
            (0, chai_1.expect)(axiosPostStub.calledOnceWithExactly(api_service_1.joinPath, sinon_1.match.any)).to.be.true;
            (0, chai_1.expect)(error.message).to.equal('JoinError');
        }
        axiosPostStub.restore();
    });
    it('should send attack to gym successfully', async () => {
        // GIVEN
        const axiosPostStub = (0, sinon_1.stub)(axios_1.default, 'post').resolves({ data: 'AttackResponse' });
        // WHEN
        const response = await api_service_1.APIService.sendAttackToGym(1, 'TargetPlayer');
        // THEN
        (0, chai_1.expect)(axiosPostStub.calledOnceWithExactly(api_service_1.attackPath, sinon_1.match.any)).to.be.true;
        (0, chai_1.expect)(response).to.equal('AttackResponse');
        axiosPostStub.restore();
    });
    it('should handle errors while sending attack to gym', async () => {
        // GIVEN
        const axiosPostStub = (0, sinon_1.stub)(axios_1.default, 'post').rejects(new Error('AttackError'));
        // WHEN
        try {
            await api_service_1.APIService.sendAttackToGym(1, 'TargetPlayer');
        }
        catch (error) {
            // THEN
            (0, chai_1.expect)(axiosPostStub.calledOnceWithExactly(api_service_1.attackPath, sinon_1.match.any)).to.be.true;
            (0, chai_1.expect)(error.message).to.equal('AttackError');
        }
        axiosPostStub.restore();
    });
});
