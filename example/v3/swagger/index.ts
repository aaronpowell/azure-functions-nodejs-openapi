import { generateOpenApi3Spec } from "azure-functions-nodejs-openapi";

export default generateOpenApi3Spec({
  info: {
    title: "Azure Function Swagger v3 demo",
    version: "1.0.0",
  },
});
