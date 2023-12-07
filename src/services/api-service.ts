import axios from "axios";
import { PokemonController } from "../controllers/pokemon-controller";
import { PokemonService } from "./pokemon-service";
import { PokemonGym, PokemonGymState } from "../common/models/gym-model";
import { PokemonState } from "../common/models/pokemon-model";
import { PLAYER_NAME } from "../common/constants/pokemon-constants";

export const prefix = "http://localhost:8080/api/gimnasio";
export const infoPath = `${prefix}/info`;
export const joinPath = `${prefix}/unirse`;
export const attackPath = `${prefix}/atacar`;

export class APIService {

    /**
     * Gets the current information about the Pokemon Gym.
     */
    static async getGymInfo() {
        axios.get(infoPath).then(async response => {
            await PokemonController.setGymInfo(response.data as PokemonGym);
        }).catch(error => {
            if (error.response?.status === 400) {
                PokemonService.setPokemonGymState(PokemonGymState.OVER);
                PokemonService.setPokemonState(PokemonState.AVAILABLE);
            }
            else {
                console.log('Error getting gym info: ', error.message);
            }
        })
    }

    /**
     * Joins the current Pokemon to the battle.
     */
    static async joinGymBattle() {
        try {
            const pokemon = PokemonService.getPokemon();
            const data = {
                playerName: PLAYER_NAME,
                pokemon: (({ player, ...rest }) => rest)(pokemon)
            };
            return (await axios.post(joinPath, data)).data;
        } catch (error: any) {
            console.log('Error joining battle: ', error.message);
            throw error;
        }
    }

    /**
     * Sends an attack to the gym, from the Pokemon to an enemy in the battle.
     * @param {number} attackId - Number of a specific current attack.
     * @param {string} targetPlayerName - Player name of a specific Pokemon enemy.
     */
    static async sendAttackToGym(attackId: number, targetPlayerName: string) {
        try {
            const data = {
                attackId,
                targetPlayerName,
                sourcePlayerName: PLAYER_NAME
            };
            return (await axios.post(attackPath, data)).data;
        } catch (error: any) {
            console.log('Error sending attack to gym: ', error.message);
            throw error;
        }
    }
}
