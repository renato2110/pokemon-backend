import { describe, it } from "mocha";
import { SinonStub, stub, assert } from "sinon";
import { Response } from "express";
import * as loggerHelper from "../../helpers/logger";
import { ResponseLogObject } from "../../common/models/request-model";
import { ERROR } from "../../common/constants/text-constants";
import fs from "fs";

describe("logResponse", () => {
  const res: Response = {
    status: stub().returnsThis(),
    send: stub(),
  } as unknown as Response;
  let writeLogStub: SinonStub;

  beforeEach(() => {
    writeLogStub = stub(loggerHelper, "writeLog");
  });

  afterEach(() => {
    writeLogStub.restore();
  });

  it("should send a successful response and write to log", async () => {
    const response: ResponseLogObject = {
      status: ERROR,
      message: "Test message",
      data: { data: "test" },
    };

    await loggerHelper
      .logResponse(res, false, "Test message", { data: "test" })
      .then(() => {
        assert.calledOnceWithExactly(
          writeLogStub,
          `RESPONSE: ${JSON.stringify(response)}\n`
        );
      });
  });
});

describe("writeLog", () => {
  let consoleLogStub: SinonStub;

  beforeEach(() => {
    consoleLogStub = stub(console, "log");
  });

  afterEach(() => {
    consoleLogStub.restore();
  });

  it("should append to the log file", async () => {
    const appendFileStub = stub(fs, 'appendFile').callsFake((_file, _data, callback) => {
      callback(null);
    });
    await loggerHelper.writeLog("Test log message").then(() => {
      assert.calledWithExactly(consoleLogStub, "Log has been updated");
    });
    appendFileStub.restore();
  });

  it("should handle error on appendFile", async () => {
    const appendFileStub = stub(fs, 'appendFile').callsFake((_file, _data, callback) => {
      callback(new Error('Testing error'));
    });
    await loggerHelper.writeLog("Test log message").then(() => {
      assert.calledWithExactly(consoleLogStub, "Error writing on log file");
    });
    appendFileStub.restore();
  });
});
