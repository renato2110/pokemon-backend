"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const pokemon_controller_1 = require("../../controllers/pokemon-controller");
const context_1 = require("../../common/config/context");
const sinon_1 = require("sinon");
const loggerHelper = __importStar(require("../../helpers/logger"));
const pokemon_model_1 = require("../../common/models/pokemon-model");
const chai_1 = require("chai");
const text_constants_1 = require("../../common/constants/text-constants");
const gym_model_1 = require("../../common/models/gym-model");
const api_service_1 = require("../../services/api-service");
const pokemon_constants_1 = require("../../common/constants/pokemon-constants");
(0, mocha_1.describe)("logResponse", () => {
    let writeLogStub;
    (0, mocha_1.beforeEach)(() => {
        writeLogStub = (0, sinon_1.stub)(loggerHelper, "writeLog");
    });
    (0, mocha_1.afterEach)(() => {
        writeLogStub.restore();
    });
    (0, mocha_1.it)("should send a successful response and write to log", async () => {
        const response = {
            status: text_constants_1.ERROR,
            message: "Test message",
            data: { data: "test" },
        };
        const res = {
            status: (0, sinon_1.stub)().returnsThis(),
            send: (0, sinon_1.stub)(),
        };
        await pokemon_controller_1.PokemonController.logResponse(res, false, "Test message", {
            data: "test",
        }).then(() => {
            sinon_1.assert.calledOnceWithExactly(writeLogStub, `RESPONSE: ${JSON.stringify(response)}`);
        });
    });
});
(0, mocha_1.describe)("PokemonController", () => {
    let logResponseStub;
    const res = {};
    (0, mocha_1.beforeEach)(() => {
        logResponseStub = (0, sinon_1.stub)(pokemon_controller_1.PokemonController, "logResponse");
    });
    (0, mocha_1.afterEach)(() => {
        logResponseStub.restore();
    });
    (0, mocha_1.describe)("getPokemonInfo", () => {
        (0, mocha_1.it)("should return Pokemon information", async () => {
            // GIVEN
            context_1.Context.POKEMON = {
                player: "Renato",
                name: "Sin nombre",
                type: pokemon_model_1.PokemonType.Normal,
                life: 0,
                attacks: [],
                state: pokemon_model_1.PokemonState.AVAILABLE,
            };
            context_1.Context.ENEMIES = [];
            context_1.Context.POKEMON_GYM_STATE = gym_model_1.PokemonGymState.IN_BATTLE;
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.AVAILABLE;
            const req = {};
            // WHEN
            await pokemon_controller_1.PokemonController.getPokemonInfo(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, "", {
                    ...context_1.Context.POKEMON,
                    enemies: [],
                    gymState: gym_model_1.PokemonGymState.IN_BATTLE
                });
            });
        });
    });
    (0, mocha_1.describe)("setPokemonAttributes", () => {
        const body = {
            name: "Charizard",
            player: "Renato",
            type: "agua",
            life: 200,
            id: 7,
            attacks: [
                {
                    type: "fuego",
                    power: 100,
                },
                {
                    type: "agua",
                    power: 80,
                },
                {
                    type: "normal",
                    power: 20,
                },
                {
                    type: "planta",
                    power: 80,
                },
            ],
        };
        (0, mocha_1.it)("should set Pokemon attributes successfully", async () => {
            // GIVEN
            const req = { body };
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.AVAILABLE;
            // WHEN
            await pokemon_controller_1.PokemonController.setPokemonAttributes(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, `${req.body.name} attributes set successfully.`);
                (0, chai_1.expect)(context_1.Context.POKEMON).to.be.equal(body);
            });
        });
        (0, mocha_1.it)("should handle error when setting Pokemon attributes during battle", async () => {
            // GIVEN
            const req = { body };
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.IN_BATTLE;
            // WHEN
            await pokemon_controller_1.PokemonController.setPokemonAttributes(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, "Pokemon attributes cannot be set because it is in a battle.");
            });
        });
        (0, mocha_1.it)("should handle validation error when setting Pokemon attributes", async () => {
            const req = {
                body: {},
            };
            await pokemon_controller_1.PokemonController.setPokemonAttributes(req, res).then(() => {
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, "attacks is a required field");
            });
        });
    });
    (0, mocha_1.describe)("sendPokemonAttack", () => {
        const attackBody = {
            attackId: 1,
            targetPlayer: 'enemy',
        };
        const enemy = {
            player: "enemy",
            name: "Blastoise",
            type: pokemon_model_1.PokemonType.Water,
            life: 1000,
        };
        (0, mocha_1.it)("should handle error when the Pokemon is not attacking", async () => {
            // GIVEN
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.IN_BATTLE;
            const req = {
                body: attackBody,
            };
            // WHEN
            await pokemon_controller_1.PokemonController.sendPokemonAttack(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, `Pokemon is not ${pokemon_model_1.PokemonState.ATTACKING}. Pokemon is: '${context_1.Context.POKEMON.state}'.`);
            });
        });
        (0, mocha_1.it)("should handle error when the Pokemon attack or Pokemon enemy are not valid", async () => {
            // GIVEN
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.ATTACKING;
            const req = {
                body: attackBody,
            };
            // WHEN
            await pokemon_controller_1.PokemonController.sendPokemonAttack(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, "Pokemon or Attack not valid.");
            });
        });
        (0, mocha_1.it)("should return the Pokemon attack and Pokemon enemy successfully", async () => {
            // GIVEN
            context_1.Context.ENEMIES = [enemy];
            context_1.Context.POKEMON = {
                player: "Renato",
                name: "Charizard",
                type: pokemon_model_1.PokemonType.Fire,
                life: 90,
                attacks: [
                    {
                        type: pokemon_model_1.PokemonType.Fire,
                        power: 100,
                    },
                ],
                state: pokemon_model_1.PokemonState.ATTACKING
            };
            const req = {
                body: attackBody,
            };
            const sendAttackToGymMock = (0, sinon_1.stub)(api_service_1.APIService, 'sendAttackToGym').resolves(true);
            // WHEN
            await pokemon_controller_1.PokemonController.sendPokemonAttack(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, "Pokemon Attack send successfully.", {
                    attack: {
                        type: pokemon_model_1.PokemonType.Fire,
                        power: 100,
                    },
                    pokemon: context_1.Context.ENEMIES[0],
                });
                (0, chai_1.expect)(context_1.Context.POKEMON.state).to.be.equal(pokemon_model_1.PokemonState.ATTACKING);
            });
            sendAttackToGymMock.restore();
        });
        (0, mocha_1.it)("should handle error Pokemon Gym API fail", async () => {
            // GIVEN
            context_1.Context.ENEMIES = [enemy];
            context_1.Context.POKEMON = {
                player: "Renato",
                name: "Charizard",
                type: pokemon_model_1.PokemonType.Fire,
                life: 90,
                attacks: [
                    {
                        type: pokemon_model_1.PokemonType.Fire,
                        power: 100,
                    },
                ],
                state: pokemon_model_1.PokemonState.ATTACKING
            };
            const req = {
                body: attackBody,
            };
            const sendAttackToGymMock = (0, sinon_1.stub)(api_service_1.APIService, 'sendAttackToGym').rejects(new Error('Error simulado'));
            // WHEN
            await pokemon_controller_1.PokemonController.sendPokemonAttack(req, res).catch(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, "Pokemon Attack send successfully.", {
                    attack: {
                        type: pokemon_model_1.PokemonType.Fire,
                        power: 100,
                    },
                    pokemon: context_1.Context.ENEMIES[0],
                });
                (0, chai_1.expect)(context_1.Context.POKEMON.state).to.be.equal(pokemon_model_1.PokemonState.ATTACKING);
            });
            sendAttackToGymMock.restore();
        });
        (0, mocha_1.it)("should handle validation error when sending Pokemon attack", async () => {
            // GIVEN
            const req = {
                body: {},
            };
            // WHEN
            await pokemon_controller_1.PokemonController.sendPokemonAttack(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, "attackId is a required field");
            });
        });
    });
    (0, mocha_1.describe)("joinToBattle", () => {
        (0, mocha_1.it)("should handle error when the Pokemon is not available", async () => {
            // GIVEN
            context_1.Context.POKEMON_GYM_STATE = gym_model_1.PokemonGymState.LOBBY;
            const req = {};
            // WHEN
            await pokemon_controller_1.PokemonController.joinToBattle(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, false, `Error joining to battle. Gym is: ${gym_model_1.PokemonGymState.LOBBY}.`);
            });
        });
        (0, mocha_1.it)("should set Pokemon state as in battle", async () => {
            // GIVEN
            context_1.Context.POKEMON_GYM_STATE = gym_model_1.PokemonGymState.OVER;
            const req = {};
            const joinGymBattleMock = (0, sinon_1.stub)(api_service_1.APIService, 'joinGymBattle').resolves(true);
            // WHEN
            await pokemon_controller_1.PokemonController.joinToBattle(req, res).then(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, "Pokemon joined to battle successfully.");
            });
            joinGymBattleMock.restore();
        });
        (0, mocha_1.it)("should handle error Pokemon Gym API fails", async () => {
            // GIVEN
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.AVAILABLE;
            const req = {};
            const joinGymBattleMock = (0, sinon_1.stub)(api_service_1.APIService, 'joinGymBattle').rejects(new Error('Error simulado'));
            // WHEN
            await pokemon_controller_1.PokemonController.joinToBattle(req, res).catch(() => {
                // THEN
                sinon_1.assert.calledOnceWithExactly(logResponseStub, res, true, "Pokemon joined to battle successfully.");
            });
            joinGymBattleMock.restore();
        });
    });
    (0, mocha_1.describe)("setGymInfo", () => {
        (0, mocha_1.it)("should set the current Gym attributes successfully", async () => {
            // GIVEN
            const pokemonGym = {
                id: 0,
                state: gym_model_1.PokemonGymState.LOBBY,
                playerInformationList: [{
                        playerName: pokemon_constants_1.PLAYER_NAME,
                        state: pokemon_model_1.PokemonState.IN_BATTLE,
                        pokemon: {
                            name: 'Blastoise',
                            type: pokemon_model_1.PokemonType.Water,
                            life: 100,
                            attacks: [{
                                    type: pokemon_model_1.PokemonType.Water,
                                    power: 10
                                }]
                        }
                    }, {
                        playerName: 'ENEMY',
                        state: pokemon_model_1.PokemonState.IN_BATTLE,
                        pokemon: {
                            name: 'Charizard',
                            type: pokemon_model_1.PokemonType.Fire,
                            life: 100,
                            attacks: [{
                                    type: pokemon_model_1.PokemonType.Fire,
                                    power: 10
                                }]
                        }
                    }]
            };
            context_1.Context.POKEMON.state = pokemon_model_1.PokemonState.ATTACKING;
            context_1.Context.POKEMON.player = pokemon_constants_1.PLAYER_NAME;
            // WHEN
            await pokemon_controller_1.PokemonController.setGymInfo(pokemonGym).then(() => {
                // THEN
                (0, chai_1.expect)(context_1.Context.POKEMON.state).to.be.equal(pokemon_model_1.PokemonState.IN_BATTLE);
                (0, chai_1.expect)(context_1.Context.ENEMIES[0].name).to.be.equal('Charizard');
            });
        });
    });
});
