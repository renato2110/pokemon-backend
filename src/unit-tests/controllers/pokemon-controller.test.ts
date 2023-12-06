import { describe, it, beforeEach, afterEach } from "mocha";
import { Request, Response } from "express";
import { PokemonController } from "../../controllers/pokemon-controller";
import { Context } from "../../common/config/context";
import { SinonStub, stub, assert } from "sinon";
import * as loggerHelper from "../../helpers/logger";
import {
  Pokemon,
  PokemonStatus,
  PokemonType,
} from "../../common/models/pokemon-model";
import { expect } from "chai";
import { ResponseLogObject } from "../../common/models/request-model";
import { ERROR } from "../../common/constants/text-constants";

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
      };
      Context.STATUS = PokemonStatus.Available;
      const req = {} as Request;

      // WHEN
      await PokemonController.getPokemonInfo(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(logResponseStub, res, true, "", {
          ...Context.POKEMON,
          status: Context.STATUS,
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
      Context.STATUS = PokemonStatus.Available;

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
      Context.STATUS = PokemonStatus.InBattle;

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

  describe("getPokemonEnemies", () => {
    it("should return Pokemon enemies information", async () => {
      // GIVEN
      const req = {} as Request;
      Context.ENEMIES = [
        {
          player: "Renato",
          name: "Sin nombre",
          type: PokemonType.Normal,
          life: 0,
          attacks: [],
        },
      ];

      // WHEN
      await PokemonController.getPokemonEnemies(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "",
          Context.ENEMIES
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
      Context.STATUS = PokemonStatus.InBattle;
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
          `Pokemon is not ${PokemonStatus.Attacking}. Pokemon is: '${Context.STATUS}'.`
        );
      });
    });

    it("should handle error when the Pokemon attack or Pokemon enemy are not valid", async () => {
      // GIVEN
      Context.STATUS = PokemonStatus.Attacking;
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
      Context.STATUS = PokemonStatus.Attacking;
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
      };
      const req = {
        body: attackBody,
      } as Request;

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
        expect(Context.STATUS).to.be.equal(PokemonStatus.InBattle);
      });
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

  describe("addToBattle", () => {
    it("should handle error when the Pokemon is not available", async () => {
      // GIVEN
      Context.STATUS = PokemonStatus.InBattle;
      const req = {} as Request;

      // WHEN
      await PokemonController.addToBattle(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Error adding to battle. Pokemon is: ${PokemonStatus.InBattle}.`
        );
      });
    });

    it("should set Pokemon status as in battle", async () => {
      // GIVEN
      Context.STATUS = PokemonStatus.Available;
      const req = {} as Request;

      // WHEN
      await PokemonController.addToBattle(req, res).then(() => {
        // THEN
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon added to battle successfully."
        );
        expect(Context.STATUS).to.be.equal(PokemonStatus.InBattle);
      });
    });
  });
});
