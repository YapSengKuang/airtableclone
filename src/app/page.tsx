
import { auth, currentUser } from "@clerk/nextjs/server";
import BaseCards from "./_components/BaseCard";
import CreateBaseButton from "./_components/CreateBaseButton";
import { redirect } from "next/navigation";

export default async function Home() {
    const { userId } = await auth();
    if (!userId) {
        return (
            redirect("/sign-in")
        );
    }
  return (
    <div>
    
        <div className="p-13">
          <h1>Home</h1>
          <BaseCards />
          <div className="pt-5">
            <CreateBaseButton/>
          </div>
          
        </div>
        
        
      
    </div>
  );
}
