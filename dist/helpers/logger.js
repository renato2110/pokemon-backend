"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLog = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Stores in the log.txt file a new message.
 * @param {string} message - Message to be stored.
 */
const writeLog = async (message) => {
    const logFile = path_1.default.join(__dirname, "../../src/logs/log.txt");
    const date = new Date().toLocaleString();
    fs_1.default.appendFile(logFile, `(${date}) ${message}\n`, (error) => {
        if (error) {
            console.log("Error writing on log file");
        }
        else {
            console.log("Log has been updated");
        }
    });
};
exports.writeLog = writeLog;
