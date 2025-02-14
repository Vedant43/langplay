import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import videoRouter from "./routes/video"
import errorHandler from "./utils/errorHandler";
import dotenv from 'dotenv';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config()

app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter)

app.use(errorHandler)

app.listen(3000);

export { app };

// "scripts": {
//     "start": "node dist/index.js",
//     "dev": "npm start && nodemon --exec tsc.cmd",
//   },

//  "dev": "npx tsc && npx nodemon dist/server.js
// ts-node allows you to skip the compilation step and run TypeScript directly in a Node.js environment.
// Nodemon watches the files and restarts the server on any changes (with --exec ts-node, it automatically handles .ts files)