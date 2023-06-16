export interface ListItem {
  label: string
  value: any
  color: string
}
export interface HelloWorldProps<T> {
  msg: string
  list: T[]
}
