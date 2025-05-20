## Current state

When using the `fullSynth()` from cdktf Testing, the generated JSON is invalid.

Nested quotes are escaped twice when a JSON string is passed in a variable.

This results in `toBeValidTerraform()` to fail every time.

## Expected state

When testing with `fullSynth()` from cdktf Testing, the output should not differ from the synthesis done by `cdktf synch` or `cdktf deploy`.

`fullSynth()` should generate valid JSON.

## Reproduce

### Generate valid terraform-json

To generate the valid JSON execute:

```bash
cdktf synch
```

See the generated code in `cdktf.out/stacks/MainStack/cdk.tf.json`.

### Generate invalid terraform-json

Open the Debugger and set a breakpoint in `__tests__/main.test.ts` at line 32 and observe the `content` variable.

Start the test suite by running:

```bash
npm run test
```

The `content` variable will contain the invalid synthesised stack.

### Info

Both versions (valid and invalid JSON) are also stored in the `tf-data` folder.