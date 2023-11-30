import { NextFunction } from "express";
import { writeLog } from "../helpers/logger";
import { RequestLogObject } from "../common/models/request-model";

export class Logger {
  /**
   * Creates a new request message to be stored.
   */
  logRequest() {
    return async (req: any, _res: any, next: NextFunction) => {
      const method = req.method;

      const logObject: RequestLogObject = {
        url: req.url,
        method,
      };

      if (method === "GET") {
        logObject.params = req.params;
      } else {
        logObject.body = req.body;
      }

      writeLog(`REQUEST: ${JSON.stringify(logObject)}`);
      return next();
    };
  }
}
