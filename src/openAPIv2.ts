import { AzureFunction, Context } from "@azure/functions";
import { OpenAPIV2 } from "openapi-types";

const paths: {
  [key: string]: OpenAPIV2.PathItemObject;
} = {};

function mapOpenApi(
  func: AzureFunction,
  route: string,
  spec: OpenAPIV2.PathItemObject
) {
  paths[route] = { ...paths[route], ...spec };
  return func;
}

const generateOpenApiSpec =
  (
    doc: Omit<OpenAPIV2.Document, "paths" | "swagger" | "basePath">
  ): AzureFunction =>
  (context: Context) => {
    const body: OpenAPIV2.Document = {
      ...doc,
      swagger: "2.0",
      basePath: "/api",
      paths,
    };
    context.res = { body };
    context.done();
  };

export { mapOpenApi, generateOpenApiSpec };
