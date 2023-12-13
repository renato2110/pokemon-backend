"use strict";
// exploratory-testing.test.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const axios_1 = __importDefault(require("axios"));
const api_service_1 = require("../services/api-service");
describe('Gym Connectivity Test', function () {
    it('should successfully connect to the Gym endpoint', () => {
        axios_1.default.get(api_service_1.infoPath)
            .then((response) => {
            console.log(response.data);
            (0, chai_1.expect)(response.status).to.equal(200);
        })
            .catch((error) => {
            throw error;
        });
    });
});
