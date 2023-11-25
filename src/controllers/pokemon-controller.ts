import { Request, Response } from "express";
import {
  EditPokemonLifeSchema,
  FinishBattleSchema,
  SavePokemonSchema,
  SendPokemonAttackSchema,
} from "../validators/pokemon-validator";
import { VALIDATION_ERROR } from "../common/constants/text-constants";
import { PokemonStatus } from "../common/models/pokemon-model";
import { logResponse } from "../helpers/logger";
import { PokemonService } from "../services/pokemon-service";

export class PokemonController {

  static async getPokemonInfo(_req: Request, res: Response) {
    const pokemon = PokemonService.getPokemon();
    const status = PokemonService.getPokemonStatus();
    logResponse(res, true, "", {
      ...pokemon,
      status,
    });
  }

  static async setPokemonAttributes(req: Request, res: Response) {
    try {
      await SavePokemonSchema.validate(req.body, { strict: true });

      const status = PokemonService.getPokemonStatus();
      if (status !== PokemonStatus.Available) {
        logResponse(
          res,
          false,
          `Pokemon attributes cannot be set because it is in a battle.`
        );
      } else {
        PokemonService.setPokemon(req.body);
        logResponse(res, true, `${req.body.name} attributes set successfully.`);
      }
    } catch (error: any) {
      logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  static async editPokemonLife(req: Request, res: Response) {
    try {
      await EditPokemonLifeSchema.validate(req.body, { strict: true });

      if (req.body.life === 0) PokemonService.setPokemonStatus(PokemonStatus.Defeated);
      PokemonService.setPokemonLife(req.body.life);
      logResponse(res, true, "Pokemon life has been modified.");
    } catch (error: any) {
      logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  static async getPokemonEnemies(_req: Request, res: Response) {
    const enemies = PokemonService.getPokemonEnemies();
    logResponse(res, true, "", enemies);
  }

  static async sendPokemonAttack(req: Request, res: Response) {
    try {
      await SendPokemonAttackSchema.validate(req.body, { strict: true });

     const status = PokemonService.getPokemonStatus();
      if (status !== PokemonStatus.Attacking) {
        logResponse(
          res,
          false,
          `Pokemon is not ${PokemonStatus.Attacking}. Pokemon is: '${status}'.`
        );
      } else {
        const { attackId, pokemonId } = req.body;
        const attacks = PokemonService.getPokemonAttacks();
        const enemies = PokemonService.getPokemonEnemies();
        const pokemon = enemies?.find(
          (pokemon) => pokemon.id === pokemonId
        );

        if (attacks && attacks.length >= attackId && pokemon) {
          PokemonService.setPokemonStatus(PokemonStatus.InBattle);
          logResponse(res, true, "Pokemon Attack send successfully.", {
            attack: attacks[attackId - 1],
            pokemon,
          });
        } else {
          logResponse(res, false, "Pokemon or Attack not valid.");
        }
      }
    } catch (error: any) {
      logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  static async initializeTurn(_req: Request, res: Response) {
    const status = PokemonService.getPokemonStatus();
    if (status !== PokemonStatus.InBattle) {
      logResponse(res, false, `Error initializing turn. Pokemon is: ${status}`);
    } else {
      PokemonService.setPokemonStatus(PokemonStatus.Attacking);
      logResponse(res, true, "Turn initialized successfully.");
    }
  }

  static async finishBattle(req: Request, res: Response) {
    try {
      await FinishBattleSchema.validate(req.body, { strict: true });
      const status = PokemonService.getPokemonStatus();
      if (
        status !== PokemonStatus.InBattle &&
        status !== PokemonStatus.Defeated
      ) {
        logResponse(res, false, `Error resting Pokemon. Pokemon is: ${status}`);
      } else {
        PokemonService.setPokemonStatus(PokemonStatus.Available);
        PokemonService.setPokemonEnemies([]);
        logResponse(res, true, "Pokemon has been reset.");
      }
    } catch (error: any) {
      logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }
}
