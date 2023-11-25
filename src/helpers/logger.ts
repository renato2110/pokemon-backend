import { Response } from "express";
import { ResponseLogObject } from "../common/models/request-model";
import fs from "fs";
import path from "path";
import { ERROR, SUCCESS } from "../common/constants/text-constants";

export const logResponse = async (
  res: Response,
  success: boolean,
  message: string,
  data?: object
): Promise<void> => {
  let response: ResponseLogObject = {
    status: success ? SUCCESS : ERROR,
    message: message
  };

  if (data) response.data = data;

  const status = success ? 200 : 400;

  res.status(status).send(response);
  await writeLog(`RESPONSE: ${JSON.stringify(response)}\n`);
};

export const writeLog = async (message: string): Promise<void> => {
  const logFile = path.join(__dirname, "../../src/logs/log.txt");
  const date = new Date().toLocaleString();

  fs.appendFile(logFile, `(${date}) ${message}`, (error) => { 
    if (error) { 
      console.log("Error writing on log file"); 
    } 
    else { 
      console.log("Log has been updated");
    } 
  }); 
};
