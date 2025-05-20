import "cdktf/lib/testing/adapters/jest";
import { Testing } from "cdktf";
import { simpleStack } from "../srv/simpleStack";
import { CloudfoundryProvider } from "../.gen/providers/cloudfoundry/provider";
import * as fs from "fs";
import * as path from "path";

function fullSynthesizeStack() {
  const app = Testing.app();
  const stack = new simpleStack(app, "simpleStack");
  const synthDir = Testing.fullSynth(stack);

  const stacksDir = path.join(synthDir, "stacks");

  const stackDirs = fs.readdirSync(stacksDir);
  if (stackDirs.length !== 1) {
    throw new Error(
      `Expected exactly one stack in ${stacksDir}, found: ${stackDirs.join(
        ", "
      )}`
    );
  }

  const jsonPath = path.join(stacksDir, stackDirs[0], "cdk.tf.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error("cdk.tf.json not found!");
  }

  const content = fs.readFileSync(jsonPath, "utf8");

  return content;
}

function synthesizeStack() {
  const app = Testing.app();
  const stack = new simpleStack(app, "simpleStack");
  const synth = Testing.synth(stack);

  return synth;
}

describe("simpleStack", () => {
  it("should be valid terraform data", () => {
    const fullSynthesized = fullSynthesizeStack();

    expect(Testing.toBeValidTerraform(fullSynthesized)).toBeTruthy();
  });
});

describe("simpleStack", () => {
  it("should contain cloudfoundry", () => {
    const synthesized = synthesizeStack();

    expect(
      Testing.toHaveProvider(synthesized, CloudfoundryProvider.tfResourceType)
    ).toBeTruthy();
  });
});
