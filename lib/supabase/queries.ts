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
    email: string;
    phone: string | null;
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
        console.error('Error fetching books:', error);
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
        console.error('Error fetching recent books:', error);
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
        console.error('Error fetching members:', error);
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
        console.error('Error searching books:', error);
        return [];
    }

    return data as Book[];
}
