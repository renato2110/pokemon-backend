"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonState = exports.PokemonType = void 0;
var PokemonType;
(function (PokemonType) {
    PokemonType["Fire"] = "fuego";
    PokemonType["Grass"] = "planta";
    PokemonType["Normal"] = "normal";
    PokemonType["Water"] = "agua";
})(PokemonType = exports.PokemonType || (exports.PokemonType = {}));
var PokemonState;
(function (PokemonState) {
    PokemonState["ATTACKING"] = "ATACANDO";
    PokemonState["AVAILABLE"] = "DISPONIBLE";
    PokemonState["DEFEATED"] = "DERROTADO";
    PokemonState["IN_BATTLE"] = "EN_BATALLA";
    PokemonState["WINNER"] = "GANADOR";
})(PokemonState = exports.PokemonState || (exports.PokemonState = {}));
