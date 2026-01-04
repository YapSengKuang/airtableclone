
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import BaseCards from "./_components/BaseCard";
import CreateBaseButton from "./_components/CreateBaseButton";

export default async function Home() {
    const { userId } = await auth();
    const user = await currentUser();
    //const data = await api.base.getAll();

    console.log("Auth Data:", userId);
    console.log("Current User:", user);


    
    //console.log("Fetched Data:", data);
  return (
    <div>
      {/* {bases.data?.map((base) => (
        <div key={base.id}>
          <h2>{base.base_id}</h2>
          <h2>{base.user_id}</h2>
        </div>
      ))
      } */}

        <BaseCards />
        <CreateBaseButton/>
      
    </div>
  );
}
