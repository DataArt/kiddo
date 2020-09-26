export type ConsoleVariableValue = string | number;

export interface ConsoleVariable {
  name: string;
  value: ConsoleVariableValue;
  readOnly: boolean;
  formula?: string;
}

export interface ConsoleNumberVariable extends ConsoleVariable {
  range?: [number, number];
  set?: [];
}

export interface ConsoleStringVariable extends ConsoleVariable {
  set?: [];
}

export interface ConsoleObjectVariable {
  fields: ConsoleVariable[];
  // will be implemented on demand
}
