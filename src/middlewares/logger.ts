import { NextFunction } from "express";
import { logResponse, writeLog } from "../helpers/logger";
import { RequestLogObject } from "../common/models/request-model";

export class Logger {
  /**
   * Creates a new request message to be stored.
   */
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
        
       writeLog(`REQUEST: ${JSON.stringify(logObject)}`);
        return next();
      } catch (err) {
        logResponse(res, false, "Internal server error.");
      }
    };
  }
}
