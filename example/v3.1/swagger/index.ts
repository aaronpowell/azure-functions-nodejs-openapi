import { generateOpenApi3_1Spec } from "@aaronpowell/azure-functions-nodejs-openapi";

export default generateOpenApi3_1Spec({
  info: {
    title: "Azure Function Swagger v3.1 demo",
    version: "1.0.0",
  },
});
