import { AzureFunction, Context } from "@azure/functions";
import { OpenAPIV2 } from "openapi-types";

const paths: {
  [key: string]: OpenAPIV2.PathItemObject;
} = {};

function mapOpenApi(
  func: AzureFunction,
  routes: string | string[],
  specs: OpenAPIV2.PathItemObject | OpenAPIV2.PathItemObject[]
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
