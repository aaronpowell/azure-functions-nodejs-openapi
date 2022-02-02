import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { mapOpenApi3_1 } from "@aaronpowell/azure-functions-nodejs-openapi";
import { games } from "../data";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id: string = req.params.id;
  const game = games.find((g) => g.id === id);

  if (!game) {
    context.res = {
      status: 404,
    };
  } else {
    context.res = {
      body: game,
    };
  }
};

export default mapOpenApi3_1(httpTrigger, "/game/{gameId}", {
  get: {
    parameters: [
      {
        name: "gameId",
        in: "path",
        required: true,
        description: "Gets a game that's being played",
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              allOf: [
                {
                  $ref: "#/components/schemas/Game",
                },
              ],
            },
          },
        },
      },
      "404": {
        description: "Unable to find a game with that id",
      },
    },
  },
});
