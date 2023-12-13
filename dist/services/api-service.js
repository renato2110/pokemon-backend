"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIService = exports.attackPath = exports.joinPath = exports.infoPath = exports.prefix = void 0;
const axios_1 = __importDefault(require("axios"));
const pokemon_controller_1 = require("../controllers/pokemon-controller");
const pokemon_service_1 = require("./pokemon-service");
const gym_model_1 = require("../common/models/gym-model");
const pokemon_model_1 = require("../common/models/pokemon-model");
const pokemon_constants_1 = require("../common/constants/pokemon-constants");
exports.prefix = "http://ec2-3-18-23-121.us-east-2.compute.amazonaws.com:8080/api/gimnasio";
exports.infoPath = `${exports.prefix}/info`;
exports.joinPath = `${exports.prefix}/unirse`;
exports.attackPath = `${exports.prefix}/atacar`;
class APIService {
    /**
     * Gets the current information about the Pokemon Gym.
     */
    static async getGymInfo() {
        axios_1.default.get(exports.infoPath).then(async (response) => {
            await pokemon_controller_1.PokemonController.setGymInfo(response.data);
        }).catch(error => {
            if (error.response?.status === 400) {
                pokemon_service_1.PokemonService.setPokemonGymState(gym_model_1.PokemonGymState.OVER);
                pokemon_service_1.PokemonService.setPokemonState(pokemon_model_1.PokemonState.AVAILABLE);
            }
            else {
                console.log('Error getting gym info: ', error.message);
            }
        });
    }
    /**
     * Joins the current Pokemon to the battle.
     */
    static async joinGymBattle() {
        try {
            const pokemon = pokemon_service_1.PokemonService.getPokemon();
            const data = {
                playerName: pokemon_constants_1.PLAYER_NAME,
                pokemon: (({ player, ...rest }) => rest)(pokemon)
            };
            return (await axios_1.default.post(exports.joinPath, data)).data;
        }
        catch (error) {
            console.log('Error joining battle: ', error.message);
            throw error;
        }
    }
    /**
     * Sends an attack to the gym, from the Pokemon to an enemy in the battle.
     * @param {number} attackId - Number of a specific current attack.
     * @param {string} targetPlayerName - Player name of a specific Pokemon enemy.
     */
    static async sendAttackToGym(attackId, targetPlayerName) {
        try {
            const data = {
                attackId,
                targetPlayerName,
                sourcePlayerName: pokemon_constants_1.PLAYER_NAME
            };
            return (await axios_1.default.post(exports.attackPath, data)).data;
        }
        catch (error) {
            console.log('Error sending attack to gym: ', error.message);
            throw error;
        }
    }
}
exports.APIService = APIService;
