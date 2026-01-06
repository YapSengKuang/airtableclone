//import TableTabs from "~/app/_components/TableTabs";
import TableView from "~/app/_components/TableView";
import { getBaseById } from "~/server/queries/getBaseById";
//import { getTablesByBaseId } from "~/server/queries/getTablesByBaseId";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BasePage(props: PageProps<"/base/[id]">) {
    const { userId } = await auth();
    if (!userId) {
        
        redirect("/sign-in")
        
    }

    const { id } = await props.params;

    const base = await getBaseById(id);
    //const tables = await getTablesByBaseId(id);

    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold mb-6">{base.base_name}</h1>
        
        {/* Airtable-style table view */}
        <TableView baseId={base.id} />
        </main>
    );
}
