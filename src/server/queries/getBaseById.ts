import { api } from "~/trpc/server";

export async function getBaseById(id: string) {
  return await api.base.getById({ id });
}
