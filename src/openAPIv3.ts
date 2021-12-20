import { AzureFunction } from "@azure/functions";
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
  async () => {
    const body: OpenAPIV3.Document = { ...doc, openapi: "3.0.0", paths };
    return body;
  };

export { mapOpenApi, generateOpenApiSpec };
