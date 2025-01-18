/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from "child_process";
import * as fs from "fs";
import * as yaml from "js-yaml";

// Function to run a command in a specific directory
export function runCommand(command: string, directory: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    exec(command, { cwd: directory }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      console.log(`Stdout: ${stdout}`);
      resolve();
    });
  });
}

export function parsePrivateKey(filePath: string): string | undefined {
  try {
    const data = parseYaml(filePath);
    if (data && data.profiles && data.profiles.default) {
      return data.profiles.default.private_key;
    } else {
      throw new Error("Invalid YAML structure");
    }
  } catch (error: any) {
    console.error(`Error reading or parsing YAML file: ${error.message}`);
    return undefined;
  }
}

export function parseYaml(filePath: string) {
  const yamlContent = fs.readFileSync(filePath, "utf-8");
  return yaml.load(yamlContent) as any;
}

export function convertToAmount(amount: number) {
  return amount * Math.pow(10, 9);
}

export function dateToSeconds(date: Date | undefined) {
  if (!date) return;
  const dateInSeconds = Math.floor(+date / 1000);
  return dateInSeconds;
}
