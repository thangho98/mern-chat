import mongoose from "mongoose";
import AppConfig from "../../../configs";
/**
 * init database connection
 * to be called once when starting app
 * and use connection for all transactions
 * @returns {Promise<void>}
 */
const mongoConnect = async () => {
  await mongoose.connect(AppConfig.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default mongoConnect;
