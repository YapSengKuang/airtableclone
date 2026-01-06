import type { Table } from "generated/prisma";
import { api } from "~/trpc/server";

export async function createTable(baseId: string, tableName: string): Promise<Table> {
  return await api.table.create({ baseId, tableName });
}
