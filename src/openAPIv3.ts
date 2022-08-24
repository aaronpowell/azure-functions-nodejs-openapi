import { AzureFunction, Context } from "@azure/functions";
import { OpenAPIV3 } from "openapi-types";

const paths: {
  [key: string]: OpenAPIV3.PathItemObject;
} = {};

function mapOpenApi(
  func: AzureFunction,
  routes: string | string[],
  specs: OpenAPIV3.PathItemObject | OpenAPIV3.PathItemObject[]
) {

  if (Array.isArray(routes) && Array.isArray(specs)) {
    routes.map((route: string, index: number) => {
      paths[route] = { ...paths[route], ...specs[index] };
    })
  } else if (!Array.isArray(routes) && !Array.isArray(specs)) {
    paths[routes] = { ...paths[routes], ...specs };
  }
  
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
