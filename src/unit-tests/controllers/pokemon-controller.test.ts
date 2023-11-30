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
        id: 0,
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
    const pokemonBody = {
      name: "Charizard",
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
      const req = {
        body: pokemonBody,
      } as Request;

      Context.STATUS = PokemonStatus.Available;

      await PokemonController.setPokemonAttributes(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          `${req.body.name} attributes set successfully.`
        );
        expect(Context.POKEMON).to.be.equal(pokemonBody);
      });
    });

    it("should handle error when setting Pokemon attributes during battle", async () => {
      const req = { body: pokemonBody } as Request;

      Context.STATUS = PokemonStatus.InBattle;

      await PokemonController.setPokemonAttributes(req, res).then(() => {
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

  describe("editPokemonLife", () => {
    const lifeBody = {
      life: 0,
    };

    it("should set Pokemon life successfully", async () => {
      const req = {
        body: lifeBody,
      } as Request;

      await PokemonController.editPokemonLife(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon life has been modified."
        );
        expect(Context.POKEMON.life).to.be.equal(0);
        expect(Context.STATUS).to.be.equal(PokemonStatus.Defeated);
      });
    });

    it("should handle validation error when setting Pokemon attributes", async () => {
      const req = {
        body: {},
      } as Request;

      await PokemonController.editPokemonLife(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "life is a required field"
        );
      });
    });
  });

  describe("getPokemonEnemies", () => {
    it("should return Pokemon enemies information", async () => {
      const req = {} as Request;
      Context.ENEMIES = [
        {
          id: 0,
          name: "Sin nombre",
          type: PokemonType.Normal,
          life: 0,
          attacks: [],
        },
      ];

      await PokemonController.getPokemonEnemies(req, res).then(() => {
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
      pokemonId: 1,
    };

    const enemy: Pokemon = {
      id: 1,
      name: "Blastoise",
      type: PokemonType.Water,
      life: 1000,
    };

    it("should handle error when the Pokemon is not attacking", async () => {
      Context.STATUS = PokemonStatus.InBattle;
      const req = {
        body: attackBody,
      } as Request;

      await PokemonController.sendPokemonAttack(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Pokemon is not ${PokemonStatus.Attacking}. Pokemon is: '${Context.STATUS}'.`
        );
      });
    });

    it("should handle error when the Pokemon attack or Pokemon enemy are not valid", async () => {
      Context.STATUS = PokemonStatus.Attacking;
      const req = {
        body: attackBody,
      } as Request;

      await PokemonController.sendPokemonAttack(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "Pokemon or Attack not valid."
        );
      });
    });

    it("should return the Pokemon attack and Pokemon enemy successfully", async () => {
      Context.STATUS = PokemonStatus.Attacking;
      Context.ENEMIES = [enemy];
      Context.POKEMON = {
        id: 0,
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

      await PokemonController.sendPokemonAttack(req, res).then(() => {
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
      const req = {
        body: {},
      } as Request;

      await PokemonController.sendPokemonAttack(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "attackId is a required field"
        );
      });
    });
  });

  describe("initializeTurn", () => {
    it("should handle error when the Pokemon is not battling", async () => {
      Context.STATUS = PokemonStatus.Available;
      const req = {} as Request;

      await PokemonController.initializeTurn(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Error initializing turn. Pokemon is: ${PokemonStatus.Available}`
        );
      });
    });

    it("should set Pokemon status as attacking", async () => {
      Context.STATUS = PokemonStatus.InBattle;
      const req = {} as Request;

      await PokemonController.initializeTurn(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Turn initialized successfully."
        );
        expect(Context.STATUS).to.be.equal(PokemonStatus.Attacking);
      });
    });
  });

  describe("finishBattle", () => {
    it("should set Pokemon status as available", async () => {
      Context.STATUS = PokemonStatus.InBattle;
      const req = {
        body: {
          victory: false,
        },
      } as Request;

      await PokemonController.finishBattle(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          true,
          "Pokemon has been reset."
        );
        expect(Context.STATUS).to.be.equal(PokemonStatus.Available);
        expect(Context.ENEMIES.length).to.be.equal(0);
      });
    });

    it("should handle error when the Pokemon is not battling", async () => {
      Context.STATUS = PokemonStatus.Available;
      const req = {
        body: {
          victory: false,
        },
      } as Request;

      await PokemonController.finishBattle(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Error resting Pokemon. Pokemon is: ${PokemonStatus.Available}`
        );
      });
    });

    it("should handle validation error when finishing Pokemon battle", async () => {
      const req = {
        body: {},
      } as Request;

      await PokemonController.finishBattle(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "victory is a required field"
        );
      });
    });
  });

  describe("addToBattle", () => {
    it("should handle error when the Pokemon is not available", async () => {
      Context.STATUS = PokemonStatus.InBattle;
      const req = {} as Request;

      await PokemonController.addToBattle(req, res).then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          `Error adding to battle. Pokemon is: ${PokemonStatus.InBattle}.`
        );
      });
    });

    it("should set Pokemon status as in battle", async () => {
      Context.STATUS = PokemonStatus.Available;
      const req = {} as Request;

      await PokemonController.addToBattle(req, res).then(() => {
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
