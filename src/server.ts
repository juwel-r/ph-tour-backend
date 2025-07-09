/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env";


let server: Server;

async function main() {
  try {
    await mongoose.connect(envVar.DB_URL);
    console.log("Mongoose connected.");

    server = app.listen(envVar.PORT, () => {
      console.log(`Server is listening on port ${envVar.PORT}`);
    });
  } catch (error: any) {
    console.log(error);
  }
}

main();

//==>> Error Handler
// See details about error handler => '../___notes.js'

process.on("uncaughtException", (error) => {
  console.log(
    "uncaughtException error detected, server shutting down!",
    error.name
  );
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("unhandledRejection", (error:any) => {
  console.log(
    "unhandledRejection error detected, server shutting down!",
    error.name
  );
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});
