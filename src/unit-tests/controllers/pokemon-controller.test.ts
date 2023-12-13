import { describe, it, beforeEach, afterEach } from "mocha";
import { Request, Response } from "express";
import { PokemonController } from "../../controllers/pokemon-controller";
import { Context } from "../../common/config/context";
import { SinonStub, stub, assert } from "sinon";
import * as loggerHelper from "../../helpers/logger";
import {
  Pokemon,
  PokemonState,
  PokemonType,
} from "../../common/models/pokemon-model";
import { expect } from "chai";
import { ResponseLogObject } from "../../common/models/request-model";
import { ERROR } from "../../common/constants/text-constants";
import { PokemonGym, PokemonGymState } from "../../common/models/gym-model";
import { APIService } from "../../services/api-service";
import { PLAYER_NAME } from "../../common/constants/pokemon-constants";

describe("logResponse", () => {
  let writeLogStub: SinonStub;

  beforeEach(() => {
    writeLogStub = stub(loggerHelper, "writeLog");
  });

  afterEach(() => {
    writeLogStub.restore();
  });

  it("should send a successful response and write to log", async () => {
    const response: ResponseLogObject = {
      status: ERROR,
      message: "Test message",
      data: { data: "test" },
    };
    const res: Response = {
      status: stub().returnsThis(),
      send: stub(),
    } as unknown as Response;

    await PokemonController.logResponse(res, false, "Test message", {
      data: "test",
    }).then(() => {
      assert.calledOnceWithExactly(
        writeLogStub,
        `RESPONSE: ${JSON.stringify(response)}`
      );
    });
  });
});

describe("PokemonController", () => {
  let logResponseStub: SinonStub;
  const res = {} as Response;

  beforeEach(() => {
    logResponseStub = stub(PokemonController, "logResponse");
  });

  afterEach(() => {
    logResponseStub.restore();
  });

  describe("getPokemonInfo", () => {
    it("should return Pokemon information", async () => {
      // GIVEN
      Context.POKEMON = {
        player: "Renato",
        name: "Sin nombre",
        type: PokemonType.Normal,
        life: 0,
        attacks: [],
        state: PokemonState.AVAILABLE,
      };
      Context.ENEMIES = [];
      Context.POKEMON_GYM_STATE = PokemonGymState.IN_BATTLE;
      Context.POKEMON.state = PokemonState.AVAILABLE;
      const req = {} as Request;

      // WHEN
      await PokemonController.getPokemonInfo(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(logResponseStub, res, true, "", {
          ...Context.POKEMON,
          enemies: [],
          gymState: PokemonGymState.IN_BATTLE
        });
      });
    });
  });

  describe("setPokemonAttributes", () => {
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

    it("should set Pokemon attributes successfully", async () => {
      // GIVEN
      const req = { body } as Request;
      Context.POKEMON.state = PokemonState.AVAILABLE;

      // WHEN
      await PokemonController.setPokemonAttributes(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          `${req.body.name} attributes set successfully.`
        );
        expect(Context.POKEMON).to.be.equal(body);
      });
    });

    it("should handle error when setting Pokemon attributes during battle", async () => {
      // GIVEN
      const req = { body } as Request;
      Context.POKEMON.state = PokemonState.IN_BATTLE;

      // WHEN
      await PokemonController.setPokemonAttributes(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "Pokemon attributes cannot be set because it is in a battle."
        );
      });
    });

    it("should handle validation error when setting Pokemon attributes", async () => {
      const req = {
        body: {},
      } as Request;

      await PokemonController.setPokemonAttributes(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "attacks is a required field"
        );
      });
    });
  });

  describe("sendPokemonAttack", () => {
    const attackBody = {
      attackId: 1,
      targetPlayer: 'enemy',
    };

    const enemy: Pokemon = {
      player: "enemy",
      name: "Blastoise",
      type: PokemonType.Water,
      life: 1000,
    };

    it("should handle error when the Pokemon is not attacking", async () => {
      // GIVEN
      Context.POKEMON.state = PokemonState.IN_BATTLE;
      const req = {
        body: attackBody,
      } as Request;

      // WHEN
      await PokemonController.sendPokemonAttack(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Pokemon is not ${PokemonState.ATTACKING}. Pokemon is: '${Context.POKEMON.state}'.`
        );
      });
    });

    it("should handle error when the Pokemon attack or Pokemon enemy are not valid", async () => {
      // GIVEN
      Context.POKEMON.state = PokemonState.ATTACKING;
      const req = {
        body: attackBody,
      } as Request;

      // WHEN
      await PokemonController.sendPokemonAttack(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "Pokemon or Attack not valid."
        );
      });
    });

    it("should return the Pokemon attack and Pokemon enemy successfully", async () => {
      // GIVEN
      Context.ENEMIES = [enemy];
      Context.POKEMON = {
        player: "Renato",
        name: "Charizard",
        type: PokemonType.Fire,
        life: 90,
        attacks: [
          {
            type: PokemonType.Fire,
            power: 100,
          },
        ],
        state: PokemonState.ATTACKING
      };
      const req = {
        body: attackBody,
      } as Request;
      const sendAttackToGymMock = stub(APIService, 'sendAttackToGym').resolves(true);

      // WHEN
      await PokemonController.sendPokemonAttack(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon Attack send successfully.",
          {
            attack: {
              type: PokemonType.Fire,
              power: 100,
            },
            pokemon: Context.ENEMIES[0],
          }
        );
        expect(Context.POKEMON.state).to.be.equal(PokemonState.ATTACKING);
      });
      sendAttackToGymMock.restore();
    });

    it("should handle error Pokemon Gym API fail", async () => {
      // GIVEN
      Context.ENEMIES = [enemy];
      Context.POKEMON = {
        player: "Renato",
        name: "Charizard",
        type: PokemonType.Fire,
        life: 90,
        attacks: [
          {
            type: PokemonType.Fire,
            power: 100,
          },
        ],
        state: PokemonState.ATTACKING
      };
      const req = {
        body: attackBody,
      } as Request;
      const sendAttackToGymMock = stub(APIService, 'sendAttackToGym').rejects(new Error('Error simulado'));

      // WHEN
      await PokemonController.sendPokemonAttack(req, res).catch(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon Attack send successfully.",
          {
            attack: {
              type: PokemonType.Fire,
              power: 100,
            },
            pokemon: Context.ENEMIES[0],
          }
        );
        expect(Context.POKEMON.state).to.be.equal(PokemonState.ATTACKING);
      });
      sendAttackToGymMock.restore();
    });

    it("should handle validation error when sending Pokemon attack", async () => {
      // GIVEN
      const req = {
        body: {},
      } as Request;

      // WHEN
      await PokemonController.sendPokemonAttack(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "attackId is a required field"
        );
      });
    });
  });

  describe("joinToBattle", () => {
    it("should handle error when the Pokemon is not available", async () => {
      // GIVEN
      Context.POKEMON.state = PokemonState.IN_BATTLE;
      const req = {} as Request;

      // WHEN
      await PokemonController.joinToBattle(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Error joining to battle. Pokemon is: ${PokemonState.IN_BATTLE}.`
        );
      });
    });

    it("should set Pokemon state as in battle", async () => {
      // GIVEN
      Context.POKEMON.state = PokemonState.AVAILABLE;
      const req = {} as Request;
      const joinGymBattleMock = stub(APIService, 'joinGymBattle').resolves(true);

      // WHEN
      await PokemonController.joinToBattle(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon joined to battle successfully."
        );
      });

      joinGymBattleMock.restore();
    });

    it("should handle error Pokemon Gym API fails", async () => {
      // GIVEN
      Context.POKEMON.state = PokemonState.AVAILABLE;
      const req = {} as Request;
      const joinGymBattleMock = stub(APIService, 'joinGymBattle').rejects(new Error('Error simulado'));

      // WHEN
      await PokemonController.joinToBattle(req, res).catch(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon joined to battle successfully."
        );
      });

      joinGymBattleMock.restore();
    });

  });

  describe("setGymInfo", () => {
    it("should set the current Gym attributes successfully", async () => {
      // GIVEN
      const pokemonGym: PokemonGym = {
        id: 0,
        state: PokemonGymState.LOBBY,
        playerInformationList: [{
          playerName: PLAYER_NAME,
          state: PokemonState.IN_BATTLE,
          pokemon: {
            name: 'Blastoise',
            type: PokemonType.Water,
            life: 100,
            attacks: [{
              type: PokemonType.Water,
              power: 10
            }]
          }
        }, {
          playerName: 'ENEMY',
          state: PokemonState.IN_BATTLE,
          pokemon: {
            name: 'Charizard',
            type: PokemonType.Fire,
            life: 100,
            attacks: [{
              type: PokemonType.Fire,
              power: 10
            }]
          }
        }]
      };
      Context.POKEMON.state = PokemonState.ATTACKING;
      Context.POKEMON.player = PLAYER_NAME;

      // WHEN
      await PokemonController.setGymInfo(pokemonGym).then(() => {
        // THEN
        expect(Context.POKEMON.state).to.be.equal(PokemonState.IN_BATTLE);
        expect(Context.ENEMIES[0].name).to.be.equal('Charizard');
      });
    });
  });
});
