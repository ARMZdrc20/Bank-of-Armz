const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transaction.router.js");
const informationRoutes = require("./routes/information.router.js");
const { synchronizingPrice } = require("./services/information.service.js");
const { walletSync } = require("./services/transaction.service.js");

// Basic setting
dotenv.config();
const app = express();
const port = process.env.PORT;

// Stress Cors
app.use(cors({ origin: "*" }));

// BodyParser For JSON I/O
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router
app.use("/api/transaction", transactionRoutes);
app.use("/api/information", informationRoutes);
/*
const options = {
  key: fs.readFileSync('./private-key.pem'),
  cert: fs.readFileSync('./certificate.pem')
};
*/
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    console.log("err");
  });

// Server start
app.listen(port, async () => {
   console.log(`Server is running in PORT ${port}`);
   synchronizingPrice();
 });
/*
https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server is running on port ${port}`);
    synchronizingPrice();
    walletSync();
});
*/

module.exports = app; 