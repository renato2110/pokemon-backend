"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const logger_1 = require("../helpers/logger");
class Logger {
    /**
     * Creates a new request message to be stored.
     */
    logRequest() {
        return async (req, _res, next) => {
            const method = req.method;
            const logObject = {
                url: req.url,
                method,
            };
            if (method === "GET") {
                logObject.params = req.params;
            }
            else {
                logObject.body = req.body;
            }
            (0, logger_1.writeLog)(`REQUEST: ${JSON.stringify(logObject)}`);
            return next();
        };
    }
}
exports.Logger = Logger;
