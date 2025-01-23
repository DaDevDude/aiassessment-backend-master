const express = require("express");
require("dotenv").config();
const app = express();
const expressApp = require("./express-app");
const PORT = process.env.PORT || 4000;
const startServer = async () => {
  await expressApp(app);

  app.listen(PORT, async () => {
    try {
      console.log(`Server is running on port ${PORT}`);
    } catch {
      console.error("Error connecting to the database");
    }
  });
};
startServer();
