import { Appbar } from "@/components/Appbar";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function UserComponent() {
    const session = await getServerSession(NEXT_AUTH);

    // Redirect to homepage if not authenticated
    if (!session || !session.user) {
        redirect('/'); 
        return null; // Return null to ensure the component does not render anything after redirect
    }

    return (
        <div>
            <Appbar />
            <h1>User Component</h1>
            {session ? (
                <>
                    <img
                        src={session.user.image || '/default-avatar.png'}
                        alt={session.user.name || "User Image"}
                        className="rounded-full w-12 h-12" // Added styling for better appearance
                    />
                    <p>Welcome, {session.user.name || "User"}!</p>
                </>
            ) : (
                <p>You are not logged in.</p>
                
            )}
            {JSON.stringify(session)}
        </div>
        
    );
}
