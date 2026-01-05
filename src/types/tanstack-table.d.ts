import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    update?: (cell: any, value: any) => void;
    type?: "text" | "number";
  }
}
