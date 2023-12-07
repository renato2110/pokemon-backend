import fs from "fs";
import path from "path";

/**
 * Stores in the log.txt file a new message.
 * @param {string} message - Message to be stored.
 */
export const writeLog = async (message: string): Promise<void> => {
  const logFile = path.join(__dirname, "../../src/logs/log.txt");
  const date = new Date().toLocaleString();
  fs.appendFile(logFile, `(${date}) ${message}\n`, (error) => {
    if (error) {
      console.log("Error writing on log file");
    }
    else {
      console.log("Log has been updated");
    }
  });
};
