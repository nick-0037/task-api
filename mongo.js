const mongoose = require("mongoose");
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' 
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI;

// connection a mongoDB
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

process.on("uncaughtException", () => {
  mongoose.connection.close();
});