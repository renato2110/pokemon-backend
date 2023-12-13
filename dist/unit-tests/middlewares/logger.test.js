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
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = require("sinon");
const logger_1 = require("../../middlewares/logger");
const loggerHelper = __importStar(require("../../helpers/logger"));
describe("Logger Middleware", () => {
    let writeLogStub;
    const logger = new logger_1.Logger();
    const res = {};
    const logObject = {
        url: "/test",
        method: "GET",
        params: { id: 1 },
    };
    let req = logObject;
    beforeEach(() => {
        writeLogStub = (0, sinon_1.stub)(loggerHelper, "writeLog");
    });
    afterEach(() => {
        writeLogStub.restore();
    });
    it("Should store the new GET request and their values", async () => {
        // GIVEN
        const next = (0, sinon_1.spy)();
        // WHEN
        logger
            .logRequest()(req, res, next)
            .then(() => {
            // THEN
            sinon_1.assert.calledOnceWithExactly(writeLogStub, `REQUEST: ${JSON.stringify(logObject)}\n`);
        });
    });
    it("Should store the new POST request and their values", async () => {
        // GIVEN
        const next = (0, sinon_1.spy)();
        req.method = "POST";
        // WHEN
        logger
            .logRequest()(req, res, next)
            .then(() => {
            // THEN
            sinon_1.assert.calledOnceWithExactly(writeLogStub, `REQUEST: ${JSON.stringify(logObject)}\n`);
        });
    });
});
