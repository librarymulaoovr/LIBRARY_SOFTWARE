import { getBooks } from '@/lib/supabase/queries';
import CatalogClient from './catalog-client';

export const revalidate = 0;

export default async function CatalogPage() {
    const books = await getBooks();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <CatalogClient
                initialBooks={books}
            />
        </div>
    );
}
