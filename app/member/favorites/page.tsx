import { getBooks } from "@/lib/supabase/queries";
import FavoritesClient from "./favorites-client";

export const revalidate = 0;

export default async function FavoritesPage() {
    const initialBooks = await getBooks();

    return <FavoritesClient initialBooks={initialBooks} />;
}
