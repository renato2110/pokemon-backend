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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./routes/swagger.json"));
const dotenv = __importStar(require("dotenv"));
const context_1 = require("./common/config/context");
const api_service_1 = require("./services/api-service");
var cors = require('cors');
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(cors());
context_1.Context.initialize();
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    return res.send('Welcome to Pokemon API');
});
app.use('/pokemon/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(router_1.router);
app.listen(PORT, () => {
    console.log(`Pokemon Server in now running on: http://localhost:${PORT}`);
    setInterval(() => {
        api_service_1.APIService.getGymInfo();
    }, 3000);
});
