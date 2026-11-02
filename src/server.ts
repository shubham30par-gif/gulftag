import { config } from "dotenv";
import { connectDB } from "./dbConnection";
import App from "./app";

config();

process.env.TZ = "UTC";
const serverPort = process.env.PORT || 6000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    App.start(serverPort as number);
    App.instance.listen(serverPort, async function () {
      console.log(
        "App Listening on environment:",
        process.env.NODE_ENV,
        serverPort
      );
    });
  })
  .catch((error) => console.log("Error while connect database"));
