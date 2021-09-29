import mongoose ,{ConnectOptions} from "mongoose";
import server from "./server";
import log from "../logger/logger";



function connect() {
  const dbUri = server.db as string;
  

  return mongoose
    .connect(dbUri, {
      useNewUrlParser : true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      log.info("Database connected");
    })
    .catch((error) => {
      log.error("db error", error);
      process.exit(1);
    });
}

export default connect;