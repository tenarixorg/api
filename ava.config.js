export default {
  files: ["test/**/*", "!test/helper/*"],
  verbose: true,
  timeout: "30s",
  extensions: {
    ts: "module",
  },
  environmentVariables: {
    AWS_BUCKET: "tenarix-ava-test",
  },
  nodeArguments: ["--loader=ts-node/esm", "--no-warnings"],
};
