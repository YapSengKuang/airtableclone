import { api } from "~/trpc/server";

export async function getUserBases() {
  return await api.base.getAll();
}
