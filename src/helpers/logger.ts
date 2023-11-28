import { Response } from "express";
import { ResponseLogObject } from "../common/models/request-model";
import fs from "fs";
import path from "path";
import { ERROR, SUCCESS } from "../common/constants/text-constants";

/**
 * Creates a new response message to be stored.
 * @param {Response} res - Express response object.
 * @param {boolean} success - Used to determine the response status.
 * @param {string} message - Message to be send to the user.
 * @param {Object} data - Data to be send to the user.
 */
export const logResponse = async (
  res: Response,
  success: boolean,
  message: string,
  data?: object
): Promise<void> => {
  let response: ResponseLogObject = {
    status: success ? SUCCESS : ERROR,
    message: message,
  };

  if (data) response.data = data;

  const status = success ? 200 : 400;

  res.status(status).send(response);
  await writeLog(`RESPONSE: ${JSON.stringify(response)}`);
};

/**
 * Stores in the log.txt file a new message.
 * @param {string} message - Message to be stored.
 */
export const writeLog = async (message: string): Promise<void> => {
  const logFile = path.join(__dirname, "../../src/logs/log.txt");
  const date = new Date().toLocaleString();
  // fs.appendFile(logFile, `(${date}) ${message}\n`, (error) => {
  //   if (error) {
  //     console.log("Error writing on log file");
  //   }
  //   else {
  //     console.log("Log has been updated");
  //   }
  // });
};
