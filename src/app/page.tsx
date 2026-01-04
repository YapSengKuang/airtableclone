
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";

export default async function Home() {
    const { userId } = await auth();
    const user = await currentUser();
    console.log("Auth Data:", userId);
    console.log("Current User:", user);

  return (
    <div>
     
      
    </div>
  );
}
