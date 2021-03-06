const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const setHeaders = require("./middleware/setHeaders");
const database = require("./database");
const dotenv = require("dotenv");
const router = require("./routes");
const serverPort = 5000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./utils/swagger.json");

const app = express();

//use swagger ui docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//allow usage of environment variables
dotenv.config();

//connect to mongodb
database.connect();

//use middleware for accepting json in request body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//to parse cookies
app.use(cookieParser());

//use docs route

//set general response headers
app.use(setHeaders);

//handle global errors
app.use(errorHandler);

//use all routes
app.use("/", router);

app.listen(process.env.PORT || serverPort, function () {
  console.log(
    `Server listening on port ${this.address().port} in ${
      app.settings.env
    } mode`
  );
  console.log(`Swagger-UI is available on /api-docs`);
});
