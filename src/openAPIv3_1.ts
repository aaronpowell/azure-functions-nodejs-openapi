import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAPIV3_1 } from "openapi-types";

const paths: {
  [key: string]: OpenAPIV3_1.PathItemObject;
} = {};

function mapOpenApi(
  func: AzureFunction,
  route: string,
  spec: OpenAPIV3_1.PathItemObject
) {
  paths[route] = spec;
  return func;
}

const generateOpenApiSpec =
  (doc: Omit<OpenAPIV3_1.Document, "paths" | "swagger" | "basePath">) =>
  (context: Context, req: HttpRequest) => {
    context.res = {
      body: { ...doc, swagger: "3.0.1", basePath: "/api", paths },
    };
    context.done();
  };

export { mapOpenApi, generateOpenApiSpec };
