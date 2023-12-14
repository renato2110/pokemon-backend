"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const pokemon_validator_1 = require("../validators/pokemon-validator");
const text_constants_1 = require("../common/constants/text-constants");
const pokemon_model_1 = require("../common/models/pokemon-model");
const pokemon_service_1 = require("../services/pokemon-service");
const logger_1 = require("../helpers/logger");
const gym_model_1 = require("../common/models/gym-model");
const pokemon_constants_1 = require("../common/constants/pokemon-constants");
const api_service_1 = require("../services/api-service");
class PokemonController {
    /**
     * Creates a new response message to be stored.
     * @param {Response} res - Express response object.
     * @param {boolean} success - Used to determine the response status.
     * @param {string} message - Message to be send to the user.
     * @param {Object} data - Data to be send to the user (optional).
     */
    static async logResponse(res, success, message, data) {
        let response = {
            status: success ? text_constants_1.SUCCESS : text_constants_1.ERROR,
            message: message,
        };
        if (data)
            response.data = data;
        const status = success ? 200 : 400;
        res.status(status).send(response);
        await (0, logger_1.writeLog)(`RESPONSE: ${JSON.stringify(response)}`);
    }
    ;
    /**
     * Gets the current information about the Pokemon.
     * @param {Request} _req - Express request object.
     * @param {Response} res - Express response object.
     */
    static async getPokemonInfo(_req, res) {
        await api_service_1.APIService.getGymInfo();
        const data = {
            ...pokemon_service_1.PokemonService.getPokemon(),
            enemies: pokemon_service_1.PokemonService.getPokemonEnemies(),
            gymState: pokemon_service_1.PokemonService.getPokemonGymState()
        };
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
    static async setPokemonAttributes(req, res) {
        try {
            await pokemon_validator_1.SavePokemonSchema.validate(req.body, { strict: true });
            const state = pokemon_service_1.PokemonService.getPokemonState();
            const gymState = pokemon_service_1.PokemonService.getPokemonGymState();
            const access = (state === pokemon_model_1.PokemonState.AVAILABLE) || (gymState === gym_model_1.PokemonGymState.OVER) || (gymState === gym_model_1.PokemonGymState.LOBBY);
            if (access) {
                pokemon_service_1.PokemonService.setPokemon(req.body);
                PokemonController.logResponse(res, true, `${req.body.name} attributes set successfully.`);
            }
            else {
                PokemonController.logResponse(res, false, `Pokemon attributes cannot be set because it is in a battle.`);
            }
        }
        catch (error) {
            PokemonController.logResponse(res, false, error.errors[0] || text_constants_1.VALIDATION_ERROR);
        }
    }
    /**
     * Sends an attack from the Pokemon to an enemy.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @param {string} req.body.targetPlayer - Player name of a specific Pokemon enemy.
     * @param {number} req.body.attackId - Number of a specific current attack.
     */
    static async sendPokemonAttack(req, res) {
        try {
            await pokemon_validator_1.SendPokemonAttackSchema.validate(req.body, { strict: true });
            const status = pokemon_service_1.PokemonService.getPokemonState();
            if (status !== pokemon_model_1.PokemonState.ATTACKING) {
                PokemonController.logResponse(res, false, `Pokemon is not ${pokemon_model_1.PokemonState.ATTACKING}. Pokemon is: '${status}'.`);
            }
            else {
                const { attackId, targetPlayer } = req.body;
                const attacks = pokemon_service_1.PokemonService.getPokemonAttacks();
                const enemies = pokemon_service_1.PokemonService.getPokemonEnemies();
                const pokemon = enemies?.find((pokemon) => pokemon.player === targetPlayer);
                if (attacks && attacks.length >= attackId && pokemon) {
                    api_service_1.APIService.sendAttackToGym(attackId, targetPlayer).then(() => {
                        PokemonController.logResponse(res, true, "Pokemon Attack send successfully.", {
                            attack: attacks[attackId - 1],
                            pokemon,
                        });
                    })
                        .catch(error => {
                        PokemonController.logResponse(res, false, error.message);
                    });
                }
                else {
                    PokemonController.logResponse(res, false, "Pokemon or Attack not valid.");
                }
            }
        }
        catch (error) {
            PokemonController.logResponse(res, false, error.errors[0] || text_constants_1.VALIDATION_ERROR);
        }
    }
    /**
     * Joins the current Pokemon to the battle.
     * @param {Request} _req - Express request.
     * @param {Response} res - Express response object.
     */
    static async joinToBattle(_req, res) {
        const gymState = pokemon_service_1.PokemonService.getPokemonGymState();
        const access = (gymState !== gym_model_1.PokemonGymState.LOBBY) && (gymState !== gym_model_1.PokemonGymState.IN_BATTLE);
        if (access) {
            api_service_1.APIService.joinGymBattle().then(() => {
                PokemonController.logResponse(res, true, "Pokemon joined to battle successfully.");
            })
                .catch(error => {
                PokemonController.logResponse(res, false, error.message);
            });
        }
        else {
            PokemonController.logResponse(res, false, `Error joining to battle. Gym is: ${gymState}.`);
        }
    }
    /**
     * Adds the current Gym information to the current Pokemon.
     * @param {PokemonGym} pokemonGym - Pokemon Gym Information.
     * @param {PokemonGymState} pokemonGym.state - Current Gym states.
     * @param {PlayerInformation[]} pokemonGym.playerInformationList - All the information about the enemies.
     */
    static async setGymInfo(pokemonGym) {
        pokemon_service_1.PokemonService.setPokemonGymState(pokemonGym.state);
        pokemon_service_1.PokemonService.setPokemonState(pokemon_model_1.PokemonState.AVAILABLE);
        const enemies = [];
        pokemonGym.playerInformationList.forEach(player => {
            const pokemon = { ...player.pokemon, player: player.playerName, state: player.state };
            if (player.playerName === pokemon_constants_1.PLAYER_NAME) {
                pokemon_service_1.PokemonService.setPokemon(pokemon);
            }
            else {
                enemies.push(pokemon);
            }
        });
        pokemon_service_1.PokemonService.setPokemonEnemies(enemies);
    }
}
exports.PokemonController = PokemonController;
