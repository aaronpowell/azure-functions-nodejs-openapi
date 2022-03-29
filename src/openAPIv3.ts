import { AzureFunction, Context } from "@azure/functions";
import { OpenAPIV3 } from "openapi-types";

const paths: {
  [key: string]: OpenAPIV3.PathItemObject;
} = {};

function mapOpenApi(
  func: AzureFunction,
  route: string,
  spec: OpenAPIV3.PathItemObject
) {
  paths[route] = spec;
  return func;
}

const generateOpenApiSpec =
  (doc: Omit<OpenAPIV3.Document, "paths" | "openapi">): AzureFunction =>
  (context: Context) => {
    const body: OpenAPIV3.Document = { ...doc, openapi: "3.0.3", paths };
    context.res = { body };
    context.done();
  };

export { mapOpenApi, generateOpenApiSpec };
