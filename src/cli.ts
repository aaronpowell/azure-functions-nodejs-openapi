import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import { OpenAPIV3_1 } from "openapi-types";
import path from "path";
import { inspect } from "util";
const program = new Command();

type FunctionJson = {
  bindings: {
    authLevel: string;
    type: string;
    direction: "in" | "out";
    name: string;
    methods: ("get" | "post" | "put" | "delete")[];
    route?: string;
  }[];
};

program
  .name("OpenAPI for Azure Functions scaffolder")
  .description("Scaffold up various parts for Azure Functions OpenAPI support");

program
  .command("endpoint")
  .description(
    "Use the Function info to generate the starting for the OpenAPI docs"
  )
  .option("-f, --function-path <path>", "Path to the Function to generate for")
  .action(async ({ functionPath }: { functionPath: string }) => {
    try {
      const folder = await fs.stat(functionPath);

      if (!folder.isDirectory) {
        console.error(
          `${chalk.red(
            "Error:"
          )} the path provided is not a directory. Please provide the folder the Function lives in.`
        );
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.code === "ENOENT") {
        console.error(
          `${chalk.redBright("Error:")} The path provided does not exist`
        );
        return;
      }

      console.error(`${chalk.red("Error:")} an unknown error occurred.`, e);
      return;
    }

    try {
      const functionJSON: FunctionJson = JSON.parse(
        await fs.readFile(path.join(functionPath, "function.json"), "utf-8")
      );

      const bindings = functionJSON.bindings;
      const httpTrigger = bindings.find(
        (b) => b.type === "httpTrigger" && b.direction === "in"
      );

      if (!httpTrigger) {
        console.error(
          `${chalk.red(
            "Error:"
          )} The function does not have a input HTTP binding, unable to generate OpenAPI info for it`
        );
        return;
      }

      const openAPIInfo: OpenAPIV3_1.PathItemObject = {};

      for (const method of httpTrigger.methods) {
        openAPIInfo[method] = {
          responses: {
            "200": {
              description: "The response from the Azure Function",
            },
          },
        };
      }

      console.log(`
Here's a starting point for your OpenAPI enabled Function

Change the ${chalk.green(
        "default export"
      )} from the Azure Function to the following:

export default mapOpenApi3_1(httpTrigger, "/${
        httpTrigger.route || path.basename(functionPath)
      }", ${inspect(openAPIInfo, false, null, true)})
`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.code === "ENOENT") {
        console.error(
          `${chalk.redBright(
            "Error:"
          )} Could not locate function.json within the provided path.`
        );
        return;
      }

      console.error(`${chalk.red("Error:")} an unknown error occurred.`, e);
      return;
    }
  });

program.parse();
