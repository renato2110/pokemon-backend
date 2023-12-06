import { Request, Response } from "express";
import {
  EditPokemonLifeSchema,
  FinishBattleSchema,
  SavePokemonSchema,
  SendPokemonAttackSchema,
} from "../validators/pokemon-validator";
import { ERROR, SUCCESS, VALIDATION_ERROR } from "../common/constants/text-constants";
import { PokemonStatus } from "../common/models/pokemon-model";
import { PokemonService } from "../services/pokemon-service";
import { ResponseLogObject } from "../common/models/request-model";
import { writeLog } from "../helpers/logger";

export class PokemonController {
  /**
   * Creates a new response message to be stored.
   * @param {Response} res - Express response object.
   * @param {boolean} success - Used to determine the response status.
   * @param {string} message - Message to be send to the user.
   * @param {Object} data - Data to be send to the user (optional).
   */
  static async logResponse(res: Response, success: boolean, message: string, data?: object) {
    let response: ResponseLogObject = {
      status: success ? SUCCESS : ERROR,
      message: message,
    };
    if (data) response.data = data;
    const status = success ? 200 : 400;

    res.status(status).send(response);
    
    await writeLog(`RESPONSE: ${JSON.stringify(response)}`);
  };

  /**
   * Gets the current information about the Pokemon.
   * @param {Request} _req - Express request object.
   * @param {Response} res - Express response object.
   */
  static async getPokemonInfo(_req: Request, res: Response) {
    const data = {
      ...PokemonService.getPokemon(),
      status: PokemonService.getPokemonStatus()
    }
    PokemonController.logResponse(res, true, "", data);
  }

  /**
   * Sets the attributes about the Pokemon.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {string} req.body.name - New Pokemon name.
   * @param {string} req.body.string - New Player name.
   * @param {PokemonType} req.body.type - New Pokemon type.
   * @param {number} req.body.life - New Pokemon life.
   * @param {PokemonAttack[]} req.body.attacks - New Pokemon attacks.
   */
  static async setPokemonAttributes(req: Request, res: Response) {
    try {
      await SavePokemonSchema.validate(req.body, { strict: true });

      const status = PokemonService.getPokemonStatus();
      if (status !== PokemonStatus.Available) {
        PokemonController.logResponse(
          res,
          false,
          `Pokemon attributes cannot be set because it is in a battle.`
        );
      } else {
        PokemonService.setPokemon(req.body);
        PokemonController.logResponse(res, true, `${req.body.name} attributes set successfully.`);
      }
    } catch (error: any) {
      PokemonController.logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  /**
   * Gets the information about the current enemies of the Pokemon.
   * @param {Request} _req - Express request object.
   * @param {Response} res - Express response object.
   */
  static async getPokemonEnemies(_req: Request, res: Response) {
    const enemies = PokemonService.getPokemonEnemies();
    PokemonController.logResponse(res, true, "", enemies);
  }

  /**
   * Sends an attack from the Pokemon to an enemy. And move the Pokemon to in-battle status.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {string} req.body.targetPlayer - Player name of a specific Pokemon enemy.
   * @param {number} req.body.attackId - Number of a specific current attack.
   */
  static async sendPokemonAttack(req: Request, res: Response) {
    try {
      await SendPokemonAttackSchema.validate(req.body, { strict: true });

      const status = PokemonService.getPokemonStatus();
      if (status !== PokemonStatus.Attacking) {
        PokemonController.logResponse(
          res,
          false,
          `Pokemon is not ${PokemonStatus.Attacking}. Pokemon is: '${status}'.`
        );
      } else {
        const { attackId, targetPlayer } = req.body;
        const attacks = PokemonService.getPokemonAttacks();
        const enemies = PokemonService.getPokemonEnemies();
        const pokemon = enemies?.find((pokemon) => pokemon.player === targetPlayer);

        if (attacks && attacks.length >= attackId && pokemon) {
          PokemonService.setPokemonStatus(PokemonStatus.InBattle);
          PokemonController.logResponse(res, true, "Pokemon Attack send successfully.", {
            attack: attacks[attackId - 1],
            pokemon,
          });
        } else {
          PokemonController.logResponse(res, false, "Pokemon or Attack not valid.");
        }
      }
    } catch (error: any) {
      PokemonController.logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  /**
   * Adds the current Pokemon to the battle. And move the Pokemon to in-battle status.
   * @param {Request} _req - Express request.
   * @param {Response} res - Express response object.
   */
  static async addToBattle(_req: Request, res: Response) {
    const status = PokemonService.getPokemonStatus();
    if (status !== PokemonStatus.Available) {
      PokemonController.logResponse(res, false, `Error adding to battle. Pokemon is: ${status}.`);
    } else {
      PokemonService.setPokemonStatus(PokemonStatus.InBattle);
      PokemonController.logResponse(res, true, "Pokemon added to battle successfully.");
    }
  }
}
