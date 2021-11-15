import { generateOpenApi3_1Spec } from "azure-functions-nodejs-openapi";

export default generateOpenApi3_1Spec({
  info: {
    title: "Awesome trivia game API",
    version: "1.0.0",
  },
  components: {
    schemas: {
      Game: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the game",
          },
          state: {
            type: "string",
            description: "The status of the game",
            enum: ["WaitingForPlayers", "Started", "Complete"],
          },
          questions: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Question",
            },
          },
          players: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Player",
            },
          },
          answers: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PlayerAnswer",
            },
          },
        },
      },
      Question: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the question",
          },
          question: {
            type: "string",
            description: "The question to present to the user",
          },
          answers: {
            type: "array",
            description: "The answers (corrent and incorrect) for the question",
            items: {
              type: "string",
            },
          },
          correctAnswer: {
            type: "string",
            description: "The correct answer for the question",
          },
        },
      },
      Player: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the player",
          },
          name: {
            type: "string",
            description: "The name of the player",
          },
        },
      },
      PlayerAnswer: {
        type: "object",
        properties: {
          playerId: {
            type: "string",
          },
          questionId: {
            type: "string",
          },
          answer: {
            type: "string",
            description: "The answer the user submitted",
          },
        },
      },
    },
  },
});
