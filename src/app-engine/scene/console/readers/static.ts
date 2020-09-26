import { ConsoleVariable } from '../../common/entities';

export function parseConsoleRow(row: string, variables: ConsoleVariable[] = []): string {
  variables.forEach(variable => {
    row = row.replace(variable.name, variable.value.toString());
  });
  // tslint:disable-next-line:no-eval
  return eval(row).toString();
}
