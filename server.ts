import path from "node:path";
import compression from "compression";
import { App } from "@tinyhttp/app";
import sirv from "sirv";
import { pino } from "pino";
import { pinoHttp } from "pino-http";
import { createRequestHandler } from "./remix-adapter";

const BUILD_DIR = path.join(process.cwd(), "build");
const isDev = () => process.env.NODE_ENV === "development";
const app = new App({
  settings: {
    xPoweredBy: false,
  },
});

const logger = pino(
  {
    level: isDev() ? "debug" : "info",
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  },
  isDev()
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "yyyy-mm-dd HH:MM:ss.l",
        },
      })
    : undefined
);

const compressor = compression();
app.use((req, res, next) => compressor(req as any, res as any, next));

// Remix fingerprints its assets so we can cache forever.
app.use("/build", sirv("public/build", { immutable: true, maxAge: 31536000, etag: true }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(sirv("public", { maxAge: 3600, immutable: true, etag: true }));

const httpLogger = pinoHttp({
  logger: logger,
});
app.use(httpLogger);

app.all(
  "*",
  createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  })
);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
