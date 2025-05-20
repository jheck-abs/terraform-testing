// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { MyStack } from "../main";
import { Container } from "../.gen/providers/docker/container";

function fullSynthesizeStack() {
  const app = Testing.app();
  const stack = new MyStack(app, "myStack");

  const fullSynth = Testing.fullSynth(stack);

  return fullSynth;
}

function synthesizeStack() {
  const app = Testing.app();
  const stack = new MyStack(app, "myStack");

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