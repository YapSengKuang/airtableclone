import { getBaseById } from "~/server/queries/getBaseById";
import { getTablesByBaseId } from "~/server/queries/getTablesByBaseId";
import  CreateTableButton  from "~/app/_components/CreateTableButton";

export default async function BasePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {



    const base = await getBaseById(params.id);
    const tables = await getTablesByBaseId(params.id);
    console.log("tables:");
    console.log(tables);
    const nextTableNumber = tables.length + 1;


    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">{base.base_name}</h1>

        <div className="text-gray-500">
            This base is currently empty.  
            Soon you’ll be able to add tables, fields, and rows here.
        </div>

        <div className="mt-6 p-6 border rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">
            Base ID: <span className="font-mono">{base.id}</span>
            </p>
        </div>
        <CreateTableButton baseId={base.id} nextTableNumber={nextTableNumber} />
        </main>
    );
}
