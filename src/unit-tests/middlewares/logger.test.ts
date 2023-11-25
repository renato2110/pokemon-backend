import { SinonStub, stub, assert, spy } from "sinon";
import { Logger } from "../../middlewares/logger";
import * as loggerHelper from "../../helpers/logger";

describe("Logger Middleware", () => {
  let writeLogStub: SinonStub;
  const logger = new Logger();
  const res = {} as Response;
  let logResponseStub: SinonStub;
  const logObject = {
    url: "/test",
    method: "GET",
    params: { id: 1 },
  };
  let req = logObject;

  beforeEach(() => {
    writeLogStub = stub(loggerHelper, "writeLog");
    logResponseStub = stub(loggerHelper, "logResponse");
  });

  afterEach(() => {
    writeLogStub.restore();
    logResponseStub.restore();
  });

  it("Should store the new GET request and their values", async () => {
    const next = spy();
    logger
      .logRequest()(req, res, next)
      .then(() => {
        assert.calledOnceWithExactly(
          writeLogStub,
          `REQUEST: ${JSON.stringify(logObject)}\n`
        );
      });
  });

  it("Should store the new POST request and their values", async () => {
    const next = spy();
    req.method = "POST";
    logger
      .logRequest()(req, res, next)
      .then(() => {
        assert.calledOnceWithExactly(
          writeLogStub,
          `REQUEST: ${JSON.stringify(logObject)}\n`
        );
      });
  });

  it("Should handle error if writeLog functions fails", async () => {
    const next = spy();
    writeLogStub.throws("Error from unit test.");

    logger
      .logRequest()(req, res, next)
      .then(() => {
        assert.calledOnceWithExactly(
          logResponseStub,
          res,
          false,
          "Internal server error."
        );
      });
  });
});
