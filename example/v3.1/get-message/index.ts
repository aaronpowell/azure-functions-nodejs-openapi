import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { mapOpenApi3_1 } from "azure-functions-nodejs-openapi";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    // status: 200, /* Defaults to 200 */
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
