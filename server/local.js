const app = require("./main");

app.listen(8080, function () {
  console.log(
    `Server listening on port ${this.address().port} in ${
      app.settings.env
    } mode`
  );
  console.log(`Swagger-UI is available on /api-docs`);
});
