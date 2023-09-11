require("dotenv").config();
const path = require("path");
const prisma = require("./src/db/prisma");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./src/config/corsOptions");
const router = require("./src/routes/routes");
const errorHandler = require("./src/middlewares/errorHandler");
const port = process.env.PORT || 5001;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"))
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "views", "index.html"));
});
app.use("/api/v1", router);
app.use(errorHandler)
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "src", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      title: "Request Error",
      message: "The request is not valid or the router is not found!!",
    });
  } else {
    res
      .type("text")
      .send("The request is not valid or the router is not found!!");
  }
});
prisma
  .$connect()
  .then(() => {
    console.log("Database connected");
    // Démarrer le serveur une fois la connexion établie
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });