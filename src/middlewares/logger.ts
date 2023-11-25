import { NextFunction } from "express";
import { logResponse, writeLog } from "../helpers/logger";
import { RequestLogObject } from "../common/models/request-model";

export class Logger {
  logRequest() {
    return async (req: any, res: any, next: NextFunction) => {
      try {
        const method = req.method;

        const logObject: RequestLogObject = {
          url: req.url,
          method
        };

        if (method === "GET") {
          logObject.params = req.params;
        } else {
          logObject.body = req.body;
        }
        
       writeLog(`REQUEST: ${JSON.stringify(logObject)}\n`);
       // TODO: Descomentar el writeLog
        return next();
      } catch (err) {
        logResponse(res, false, "Internal server error.");
      }
    };
  }
}
