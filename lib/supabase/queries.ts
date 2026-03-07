import { createClient as createServerClient } from './server';
import { createClient as createBrowserClient } from './client';

// Type definitions for our database
export type Book = {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    language: string | null;
    category: string | null;
    shelf_location: string | null;
    call_number: string | null;
    barcode: string | null;
    cover_image_url: string | null;
    total_copies: number;
    available_copies: number;
    created_at: string;
};

export type Member = {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    barcode: string | null;
    address: string | null;
    place: string | null;
    password: string | null;
    membership_type: 'Student' | 'Faculty' | 'Public';
    status: 'Active' | 'Suspended';
    created_at: string;
};

// SERVER-SIDE QUERIES (Use these inside React Server Components)
export async function getBooks() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching books:', error.message || error);
        return [];
    }

    return data as Book[];
}

export async function getRecentBooks(limit: number = 5) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent books:', error.message || error);
        return [];
    }

    return data as Book[];
}

export async function getMembers() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching members:', error.message || error);
        return [];
    }

    return data as Member[];
}

// BROWSER-SIDE QUERIES (Use these inside Client Components if needed)
export async function searchBooksClient(query: string) {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('title');

    if (error) {
        console.error('Error searching books:', error.message || error);
        return [];
    }

    return data as Book[];
}

export interface CirculationRecord {
    id: string;
    book_id: string;
    member_id: string;
    checkout_date: string;
    due_date?: string;
    return_date?: string;
    status: 'Borrowed' | 'Returned';
    books?: Book;
    members?: Member;
}

// ----------------------
// Analytics / Dashboard Data
// ----------------------
export async function getTopReaders() {
    const supabase = await createServerClient();

    const { data: records, error } = await supabase
        .from("circulation")
        .select(`
            member_id,
            members ( full_name, membership_type )
        `);

    if (error || !records) {
        console.error("Error fetching for top readers:", error?.message || error);
        return [];
    }

    // Aggregate counts
    const counts = records.reduce((acc: any, record: any) => {
        const id = record.member_id;
        if (!acc[id]) {
            acc[id] = {
                id,
                name: Array.isArray(record.members) ? record.members[0]?.full_name : record.members?.full_name,
                category: Array.isArray(record.members) ? record.members[0]?.membership_type : record.members?.membership_type,
                count: 0
            };
        }
        acc[id].count++;
        return acc;
    }, {});

    // Convert to array and sort descending
    return Object.values(counts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 8); // Return top 8
}

export async function getPopularBooks() {
    const supabase = await createServerClient();

    const { data: records, error } = await supabase
        .from("circulation")
        .select(`
            book_id,
            books ( title, author )
        `);

    if (error || !records) {
        console.error("Error fetching for popular books:", error?.message || error);
        return [];
    }

    // Aggregate counts
    const counts = records.reduce((acc: any, record: any) => {
        const id = record.book_id;
        if (!acc[id]) {
            acc[id] = {
                id,
                title: Array.isArray(record.books) ? record.books[0]?.title : record.books?.title,
                author: Array.isArray(record.books) ? record.books[0]?.author : record.books?.author,
                borrows: 0
            };
        }
        acc[id].borrows++;
        return acc;
    }, {});

    // Convert to array and sort descending
    return Object.values(counts)
        .sort((a: any, b: any) => b.borrows - a.borrows)
        .slice(0, 8); // Return top 8
}
