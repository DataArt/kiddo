export type ConsoleVariableValue = string | number;

export interface ConsoleVariable {
  name: string;
  value: ConsoleVariableValue;
  readOnly: boolean;
}

