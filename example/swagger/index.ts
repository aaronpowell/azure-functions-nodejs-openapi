import { generateOpenApi2Spec } from "azure-functions-nodejs-openapi";

export default generateOpenApi2Spec({
  info: {
    title: "Azure Function Swagger v2 demo",
    version: "1.0.0",
  },
  host: "localhost:7071",
  schemes: ["http"],
});
