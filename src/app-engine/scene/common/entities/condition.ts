export interface Condition {
  checkFunction: () => boolean;
  message: string;
}
