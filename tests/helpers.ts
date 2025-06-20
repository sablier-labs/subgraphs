export function shouldRunTest(envVarKey: string) {
  return Boolean(process.env.CI) && Boolean(process.env[envVarKey]);
}
