require("dotenv").config();
const path = require("path");
const prisma = require("./db/prisma");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const swaggerJSDoc = YAML.load('./docs/api.yaml');
const port = process.env.PORT || 5001;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.use('/docs', (req, res)=>{
  res.send(swaggerJSDoc);
})
app.use("/api/v1", router);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc))

app.use(errorHandler);
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
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
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
