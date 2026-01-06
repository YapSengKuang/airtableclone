import "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
            update?: (cell: Cell<TData, TValue>, value: TValue) => void;
            type?: "text" | "number";
    }
}

