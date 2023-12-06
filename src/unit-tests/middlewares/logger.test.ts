import { SinonStub, stub, assert, spy } from "sinon";
import { Logger } from "../../middlewares/logger";
import * as loggerHelper from "../../helpers/logger";

describe("Logger Middleware", () => {
  let writeLogStub: SinonStub;
  const logger = new Logger();
  const res = {} as Response;

  const logObject = {
    url: "/test",
    method: "GET",
    params: { id: 1 },
  };
  let req = logObject;

  beforeEach(() => {
    writeLogStub = stub(loggerHelper, "writeLog");
  });

  afterEach(() => {
    writeLogStub.restore();
  });

  it("Should store the new GET request and their values", async () => {
    // GIVEN
    const next = spy();

    // WHEN
    logger
      .logRequest()(req, res, next)
      .then(() => {
        // THEN
        assert.calledOnceWithExactly(
          writeLogStub,
          `REQUEST: ${JSON.stringify(logObject)}\n`
        );
      });
  });

  it("Should store the new POST request and their values", async () => {
    // GIVEN
    const next = spy();
    req.method = "POST";

    // WHEN
    logger
      .logRequest()(req, res, next)
      .then(() => {
        // THEN
        assert.calledOnceWithExactly(
          writeLogStub,
          `REQUEST: ${JSON.stringify(logObject)}\n`
        );
      });
  });
});
