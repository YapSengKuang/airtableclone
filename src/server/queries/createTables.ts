import { api } from "~/trpc/server";

export async function createTable(baseId: string, tableName: string) {
  return await api.table.create({ baseId, tableName });
}
