// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import bodyParser from "body-parser";

// const { json, urlencoded } = bodyParser;

// export const createServer = () => {
//   const app = express();

//   app
//     .disable("x-powered-by")
//     .use(morgan("dev"))
//     .use(cors())
//     .use(urlencoded({ extended: true }))
//     .use(json())
//     .get("/status", (_, res) => res.json({ ok: true }))
//     .get("/message/:name", (req, res) => {
//       res.json({ message: `hello ${req.params.name}` });
//     });

//   return app;
// };
// backend/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

export const createServer = () => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(cors())
    .use(morgan("dev"))
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/status", (_, res) => {
    res.json({ ok: true });
  });

  return app;
};
