# OpenAPI for Azure Functions [![Publish a release](https://github.com/aaronpowell/azure-functions-nodejs-openapi/actions/workflows/release.yaml/badge.svg)](https://github.com/aaronpowell/azure-functions-nodejs-openapi/actions/workflows/release.yaml) [![npm version](https://img.shields.io/npm/v/@aaronpowell/azure-functions-nodejs-openapi)](https://www.npmjs.org/package/@aaronpowell/azure-functions-nodejs-openapi)

This is an extension for [Azure Functions](https://azure.microsoft.com/services/functions/?WT.mc_id=javascript-48109-aapowell#overview) that gives support for generating [OpenAPI](https://www.openapis.org/) spec files from annotated Azure Functions. To make this easier, the extension is written in TypeScript and provided TypeScript typings for the objects needing ot be created.

The plugin supports the three major releases of OpenAPI/Swagger, v2, v3 and v3.1, via specific imports, with the default export being OpenAPI 3.1.

The plugin was inspired by [the .NET extension](https://github.com/Azure/azure-functions-openapi-extension).

## Usage

### Step 1 - Annotate an Azure Function

Import the desired version helper to annotate an Azure Function with the metadata for OpenAPI.

```ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { mapOpenApi3_1 } from "@aaronpowell/azure-functions-nodejs-openapi";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const name = req.query.name;
  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    body: responseMessage,
  };
};

export default mapOpenApi3_1(httpTrigger, "/get-message", {
  get: {
    parameters: [
      {
        name: "name",
        in: "query",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      "200": {
        description: "Gets a message from the Function",
        content: {
          "application/json": {
            example:
              "Hello Aaron. This is a HTTP triggered function executed successfully.",
          },
        },
      },
    },
  },
});
```

For the case where a function contains multiple endpoints, you can pass an array into the ```routes``` and ```specs``` parameters.

```
export default mapOpenApi3_1(httpTrigger, ["/get-message-1", "/get-message-2"], [
  {
    get: {
      ...
    },
  },
  {
    get: {
      ...
    },
    post: {
      ...
    },
  }
]);
```

### Step 2 - Create the OpenAPI endpoint

Create a new HTTP Trigger Azure Functions and name it how you want it exposed to consumers (eg `swagger`), and import the function to generate the spec file:

```ts
import { generateOpenApi3_1Spec } from "@aaronpowell/azure-functions-nodejs-openapi";

export default generateOpenApi3_1Spec({
  info: {
    title: "Azure Function Swagger v3.1 demo",
    version: "1.0.0",
  },
});
```

**Note: You'll need to edit the `function.json` to have the `out` parameter named `res`, as the generator function will assign it to that on `context`.**

## Examples

You find examples for the different OpenAPI version in the folder `example`. They are running on Azure Functions Runtime version 3.x.
If you want to run them on version 4.x, adjust the extension bundle reference in the `host.json` to:

```json
"extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[2.*, 3.0.0)"
  }
```

## Scaffolding Function descriptions

_The following is very much a work in progress._

To get started in generating the OpenAPI annotations for Functions, there's a CLI tool provided as part of this package, `openapi-func`.

This will look at the `function.json` for a Function and give some of the boilerplate required to get you started.

```bash
cd example/trivia-app
npx openapi-func endpoint -f ./game-get
```

This will output the following for you to add to your Function:

```
Here's a starting point for your OpenAPI enabled Function

Change the default export from the Azure Function to the following:

export default mapOpenApi3_1(httpTrigger, "/game-get", {
  get: {
    responses: { '200': { description: 'The response from the Azure Function' } }
  }
})
```

## License

MIT
