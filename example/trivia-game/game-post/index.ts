import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { mapOpenApi3_1 } from "@aaronpowell/azure-functions-nodejs-openapi";
import { GameModel, games } from "../data";
import { idGenerator } from "../utils";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const game: GameModel = req.body;
  game.id = idGenerator();

  games.push(game);

  context.res = {
    status: 201,
  };
};

export default mapOpenApi3_1(httpTrigger, "/game", {
  post: {
    requestBody: {
      description: "The game that you're wishing to save",
      content: {
        "application/json": {
          schema: {
            type: "object",
            $ref: "#/components/schemas/Game",
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Successful operation",
        content: {},
      },
      "405": {
        description: "Invalid input",
        content: {},
      },
    },
  },
});
