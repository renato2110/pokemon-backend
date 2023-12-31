import { describe, it } from "mocha";
import { SinonStub, stub, assert } from "sinon";
import * as loggerHelper from "../../helpers/logger";
import fs from "fs";

describe("writeLog", () => {
  let consoleLogStub: SinonStub;

  beforeEach(() => {
    consoleLogStub = stub(console, "log");
  });

  afterEach(() => {
    consoleLogStub.restore();
  });

  it("should append to the log file", async () => {
    // GIVEN
    const appendFileStub = stub(fs, 'appendFile').callsFake((_file, _data, callback) => {
      callback(null);
    });

    // WHEN
    await loggerHelper.writeLog("Test log message").then(() => {
      // THEN
      assert.calledWithExactly(consoleLogStub, "Log has been updated");
    });
    appendFileStub.restore();
  });

  it("should handle error on appendFile", async () => {
    // GIVEN
    const appendFileStub = stub(fs, 'appendFile').callsFake((_file, _data, callback) => {
      callback(new Error('Testing error'));
    });

    // WHEN
    await loggerHelper.writeLog("Test log message").then(() => {
      // THEN
      assert.calledWithExactly(consoleLogStub, "Error writing on log file");
    });
    appendFileStub.restore();
  });
});
