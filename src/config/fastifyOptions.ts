import humanId from "human-id";
export default {
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l o",
        ignore:
          process.env.NODE_ENV === "production" ? "res, req, reqId" : "reqId",
      },
    },
  },
  disableRequestLogging: true,
  genReqId() {
    return humanId({
      addAdverb: true,
      separator: " ",
    });
  },
}