import "cdktf/lib/testing/adapters/jest";
import { Testing } from "cdktf";
import { mainStack } from "../srv/mainStack";
import { Container } from "../.gen/providers/docker/container";

function fullSynthesizeStack() {
  const app = Testing.app();
  const stack = new mainStack(app, "mainStack");

  const fullSynth = Testing.fullSynth(stack);

  return fullSynth;
}

function synthesizeStack() {
  const app = Testing.app();
  const stack = new mainStack(app, "mainStack");

  return Testing.synth(stack);
}

describe("main", () => {
  it("should be valid terraform data", () => {
    const synthesized = fullSynthesizeStack();

    expect(Testing.toBeValidTerraform(synthesized)).toBeTruthy();
  });
});

describe("main", () => {
  it("should contain provider-docker", () => {
    const synthesized = synthesizeStack();

    Testing.toHaveProvider(synthesized, Container.tfResourceType);
  });
});
