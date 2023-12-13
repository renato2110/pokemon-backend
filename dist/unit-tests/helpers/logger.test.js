"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const sinon_1 = require("sinon");
const loggerHelper = __importStar(require("../../helpers/logger"));
const fs_1 = __importDefault(require("fs"));
(0, mocha_1.describe)("writeLog", () => {
    let consoleLogStub;
    beforeEach(() => {
        consoleLogStub = (0, sinon_1.stub)(console, "log");
    });
    afterEach(() => {
        consoleLogStub.restore();
    });
    (0, mocha_1.it)("should append to the log file", async () => {
        // GIVEN
        const appendFileStub = (0, sinon_1.stub)(fs_1.default, 'appendFile').callsFake((_file, _data, callback) => {
            callback(null);
        });
        // WHEN
        await loggerHelper.writeLog("Test log message").then(() => {
            // THEN
            sinon_1.assert.calledWithExactly(consoleLogStub, "Log has been updated");
        });
        appendFileStub.restore();
    });
    (0, mocha_1.it)("should handle error on appendFile", async () => {
        // GIVEN
        const appendFileStub = (0, sinon_1.stub)(fs_1.default, 'appendFile').callsFake((_file, _data, callback) => {
            callback(new Error('Testing error'));
        });
        // WHEN
        await loggerHelper.writeLog("Test log message").then(() => {
            // THEN
            sinon_1.assert.calledWithExactly(consoleLogStub, "Error writing on log file");
        });
        appendFileStub.restore();
    });
});
