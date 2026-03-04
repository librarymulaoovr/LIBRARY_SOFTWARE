import { getMembers } from "@/lib/supabase/queries";
import MembersClient from "./members-client";

export default async function MembersPage() {
    const initialMembers = await getMembers();
    return <MembersClient initialMembers={initialMembers} />;
}
