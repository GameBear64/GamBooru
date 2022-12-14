const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const settings = require("./../settings.json");

mongoose
  .connect(`mongodb://127.0.0.1:${settings.mongoPort}/${settings.mongoDbName}`)
  .then(async () => {
    console.log(`Connected to ${settings.mongoDbName} in MongoDB`);
  })
  .catch((e) => {
    console.log("Something went wrong", e);
  });

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send(
    `Express server using MongoDB to serve GamBooru's backend, \nchange port from ${settings.expressPort} to 4200 to go to site`
  );
  // res
  //   .status(303)
  //   .redirect(
  //     `http://${window.location.protocol}//${window.location.hostname}:4200`
  //   );
});

app.get("/about", (req, res) => {
  res.send(
    `Express server using MongoDB to serve GamBooru's backend, \nchange port from ${settings.expressPort} to 4200 to go to site`
  );
});

require("./routes/index")(app);

app.listen(settings.expressPort, () => {
  console.log(
    `Listening on port ${settings.expressPort} at http://localhost:${settings.expressPort}`
  );
});
