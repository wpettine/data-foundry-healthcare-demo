export function createValidator(scenarioId: string) {
  const errors: string[] = [];

  function check(condition: boolean, message: string) {
    if (!condition) errors.push(message);
  }

  function finish() {
    if (errors.length > 0) {
      throw new Error(
        `[${scenarioId}] ${errors.length} validation error(s):\n${errors.map(e => `  - ${e}`).join('\n')}`
      );
    }
  }

  return { check, finish };
}
