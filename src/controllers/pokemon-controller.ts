import { Request, Response } from "express";
import {
  SavePokemonSchema,
  SendPokemonAttackSchema
} from "../validators/pokemon-validator";
import { ERROR, SUCCESS, VALIDATION_ERROR } from "../common/constants/text-constants";
import { Pokemon, PokemonState } from "../common/models/pokemon-model";
import { PokemonService } from "../services/pokemon-service";
import { ResponseLogObject } from "../common/models/request-model";
import { writeLog } from "../helpers/logger";
import { PokemonGym, PokemonGymState } from "../common/models/gym-model";
import { PLAYER_NAME } from "../common/constants/pokemon-constants";
import { APIService } from "../services/api-service";

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
    await APIService.getGymInfo();
    const data = {
      ...PokemonService.getPokemon(),
      enemies: PokemonService.getPokemonEnemies(),
      gymState: PokemonService.getPokemonGymState()
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

      const state = PokemonService.getPokemonState();
      const gymState = PokemonService.getPokemonGymState();
      const access = (state === PokemonState.AVAILABLE) || (gymState === PokemonGymState.OVER) || (gymState === PokemonGymState.LOBBY);
      if (access) {
        PokemonService.setPokemon(req.body);
        PokemonController.logResponse(res, true, `${req.body.name} attributes set successfully.`);
      } else {
        PokemonController.logResponse(
          res,
          false,
          `Pokemon attributes cannot be set because it is in a battle.`
        );
      }
    } catch (error: any) {
      PokemonController.logResponse(res, false, error.errors[0] || VALIDATION_ERROR);
    }
  }

  /**
   * Sends an attack from the Pokemon to an enemy.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {string} req.body.targetPlayer - Player name of a specific Pokemon enemy.
   * @param {number} req.body.attackId - Number of a specific current attack.
   */
  static async sendPokemonAttack(req: Request, res: Response) {
    try {
      await SendPokemonAttackSchema.validate(req.body, { strict: true });

      const status = PokemonService.getPokemonState();
      if (status !== PokemonState.ATTACKING) {
        PokemonController.logResponse(
          res,
          false,
          `Pokemon is not ${PokemonState.ATTACKING}. Pokemon is: '${status}'.`
        );
      } else {
        const { attackId, targetPlayer } = req.body;
        const attacks = PokemonService.getPokemonAttacks();
        const enemies = PokemonService.getPokemonEnemies();
        const pokemon = enemies?.find((pokemon) => pokemon.player === targetPlayer);

        if (attacks && attacks.length >= attackId && pokemon) {
          APIService.sendAttackToGym(attackId, targetPlayer).then(() => {
            PokemonController.logResponse(res, true, "Pokemon Attack send successfully.", {
              attack: attacks[attackId - 1],
              pokemon,
            });
          })
            .catch(error => {
              PokemonController.logResponse(res, false, error.message);
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
   * Joins the current Pokemon to the battle.
   * @param {Request} _req - Express request.
   * @param {Response} res - Express response object.
   */
  static async joinToBattle(_req: Request, res: Response) {
    const gymState = PokemonService.getPokemonGymState();
    const access = (gymState === PokemonGymState.LOBBY) || (gymState === PokemonGymState.OVER);
    if (access) {
      APIService.joinGymBattle().then(() => {
        PokemonController.logResponse(res, true, "Pokemon joined to battle successfully.");
      })
        .catch(error => {
          PokemonController.logResponse(res, false, error.message);
        });
    } else {
      PokemonController.logResponse(res, false, `Error joining to battle. Gym is: ${gymState}.`);
    }
  }


  /**
   * Adds the current Gym information to the current Pokemon.
   * @param {PokemonGym} pokemonGym - Pokemon Gym Information.
   * @param {PokemonGymState} pokemonGym.state - Current Gym states.
   * @param {PlayerInformation[]} pokemonGym.playerInformationList - All the information about the enemies.
   */
  static async setGymInfo(pokemonGym: PokemonGym) {
    PokemonService.setPokemonGymState(pokemonGym.state);
    PokemonService.setPokemonState(PokemonState.AVAILABLE);
    const enemies: Pokemon[] = [];

    pokemonGym.playerInformationList.forEach(player => {
      const pokemon: Pokemon = { ...player.pokemon, player: player.playerName, state: player.state };
      if (player.playerName === PLAYER_NAME) {
        PokemonService.setPokemon(pokemon);
      }
      else {
        enemies.push(pokemon);
      }
    });

    PokemonService.setPokemonEnemies(enemies);


  }
}
