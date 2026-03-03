import { getBooks } from "@/lib/supabase/queries";
import CatalogClient from "./catalog-client";

export default async function CatalogPage() {
    // 1. Fetch data securely on the server
    const initialBooks = await getBooks();

    // 2. Pass data to the Client Component for interactive search/filtering
    return <CatalogClient initialBooks={initialBooks} />;
}
