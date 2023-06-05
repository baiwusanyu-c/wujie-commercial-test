export interface ListItem {
  label: string;
  value: any;
}
export interface HelloWorldProps<T> {
  msg: string;
  list: T[];
}
