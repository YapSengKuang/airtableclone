import { api } from "~/trpc/server";

export async function getTablesByBaseId(baseId: string) {
  return await api.table.getByBaseId({ id: baseId });
}
