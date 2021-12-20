import { AzureFunction } from "@azure/functions";
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
  (doc: Omit<OpenAPIV3_1.Document, "paths" | "openapi">): AzureFunction =>
  async () => {
    const body: OpenAPIV3_1.Document = { ...doc, openapi: "3.0.3", paths };
    return body;
  };

export { mapOpenApi, generateOpenApiSpec };
