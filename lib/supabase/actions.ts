"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

export async function addBook(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const language = formData.get("language") as string;
    const category = formData.get("category") as string;
    const shelf_location = formData.get("shelf_location") as string;
    const call_number = formData.get("call_number") as string;
    const barcode = formData.get("barcode") as string;

    if (!title || !author || !barcode) {
        return { error: "Title, Author, and Barcode are required." };
    }

    // Default copies to 1 for new single books
    const total_copies = 1;

    const { error } = await supabase.from("books").insert([
        {
            title,
            author,
            language,
            category,
            shelf_location,
            call_number,
            barcode,
            total_copies,
            available_copies: total_copies,
        },
    ]);

    if (error) {
        if (error.code === "23505") { // Unique violation, likely barcode
            return { error: "A book with this barcode already exists." };
        }
        console.error("Error adding book:", error);
        return { error: "Failed to add book. Please try again." };
    }

    // Revalidate routes that show books so they update immediately
    revalidatePath("/catalog");
    revalidatePath("/dashboard");
    revalidatePath("/books");

    return { success: true };
}

export async function getBookByBarcode(barcode: string) {
    const supabase = await createClient();

    if (!barcode) return { error: "Barcode is required to search." };

    const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("barcode", barcode)
        .single();

    if (error || !data) {
        return { error: "Book not found." };
    }

    return { success: true, book: data };
}

export async function updateBook(barcode: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const language = formData.get("language") as string;
    const category = formData.get("category") as string;
    const shelf_location = formData.get("shelf_location") as string;
    const call_number = formData.get("call_number") as string;
    const newBarcode = formData.get("barcode") as string; // in case they edit the barcode itself

    if (!title || !author || !newBarcode) {
        return { error: "Title, Author, and Barcode are required." };
    }

    const { error } = await supabase
        .from("books")
        .update({
            title,
            author,
            language,
            category,
            shelf_location,
            call_number,
            barcode: newBarcode,
        })
        .eq("barcode", barcode);

    if (error) {
        if (error.code === "23505") {
            return { error: "Another book is already using this barcode." };
        }
        console.error("Error updating book:", error);
        return { error: "Failed to update book. Please try again." };
    }

    revalidatePath("/catalog");
    revalidatePath("/dashboard");
    revalidatePath("/books");

    return { success: true };
}

export async function deleteBooks(barcodesString: string) {
    const supabase = await createClient();

    if (!barcodesString.trim()) {
        return { error: "Please provide at least one barcode." };
    }

    const barcodes = barcodesString.split(",").map((b) => b.trim()).filter((b) => b.length > 0);

    if (barcodes.length === 0) {
        return { error: "Invalid barcode format." };
    }

    const { data, error } = await supabase
        .from("books")
        .delete()
        .in("barcode", barcodes)
        .select();

    if (error) {
        console.error("Error deleting books:", error);
        return { error: "Failed to delete books. They might be currently borrowed." };
    }

    revalidatePath("/catalog");
    revalidatePath("/dashboard");
    revalidatePath("/books");

    return {
        success: true,
        message: `Successfully deleted ${data?.length || 0} book(s).`
    };
}

export async function bulkAddBooks(books: Record<string, unknown>[]) {
    const supabase = await createClient();

    if (!books || books.length === 0) {
        return { error: "No valid books found to upload." };
    }

    // Default necessary fields for each row if they are missing
    const formattedBooks = books.map(book => ({
        title: book.title || "Unknown Title",
        author: book.author || "Unknown Author",
        language: book.language || null,
        category: book.category || null,
        shelf_location: book.shelf_location || null,
        call_number: book.call_number || null,
        barcode: book.barcode || `AUTO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        total_copies: 1,
        available_copies: 1,
    }));

    // Perform bulk insertion using the arrays of data
    const { error } = await supabase.from("books").insert(formattedBooks);

    if (error) {
        console.error("Error in bulk upload:", error);
        if (error.code === "23505") {
            return { error: "One or more barcodes are already in use. Upload failed." };
        }
        return { error: "Failed to upload books. Please check data format." };
    }

    // Revalidate routes that show books so they update immediately
    revalidatePath("/catalog");
    revalidatePath("/dashboard");
    revalidatePath("/books");

    return {
        success: true,
        message: `Successfully added ${formattedBooks.length} book(s)!`
    };
}

export async function addMember(formData: FormData) {
    const supabase = await createClient();

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const place = formData.get("place") as string;
    const barcode = formData.get("barcode") as string;
    const password = formData.get("password") as string;

    if (!full_name || !barcode || !password) {
        return { error: "Name, Barcode, and Password are required." };
    }

    const { error } = await supabase.from("members").insert([
        {
            full_name,
            phone: phone || null,
            address: address || null,
            place: place || null,
            barcode,
            password,
            membership_type: "Public", // default
            status: "Active", // default
        },
    ]);

    if (error) {
        if (error.code === "23505") {
            return { error: "A member with this barcode already exists." };
        }
        console.error("Error adding member:", error);
        return { error: "Failed to add member. Please try again." };
    }

    revalidatePath("/members");

    return { success: true };
}

export async function loginMember(barcode: string, pass: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("barcode", barcode)
        .eq("password", pass)
        .single();

    if (error || !data) {
        return { error: "Invalid barcode or password." };
    }

    return { success: true, member: data };
}

export async function bulkAddMembers(members: Record<string, unknown>[]) {
    const supabase = await createClient();

    const formattedMembers = members
        .filter(b => b.full_name && b.barcode && b.password)
        .map(b => ({
            full_name: b.full_name as string,
            phone: (b.phone as string) || null,
            address: (b.address as string) || null,
            place: (b.place as string) || null,
            barcode: String(b.barcode).trim(),
            password: String(b.password).trim(),
            membership_type: "Public", // default
            status: "Active", // default
        }));

    if (formattedMembers.length === 0) {
        return { error: "No valid members found in CSV. Missing Full Name, Barcode, or Password." };
    }

    const { error } = await supabase.from('members').insert(formattedMembers);

    if (error) {
        if (error.code === "23505") {
            return { error: "One or more barcodes already exist in the database." };
        }
        console.error('Error inserting members:', error);
        return { error: `Failed to upload members: ${error.message}` };
    }

    // Revalidate routes that show members
    revalidatePath("/members");

    return {
        success: true,
        message: `Successfully added ${formattedMembers.length} patron(s)!`
    };
}

export async function editMember(id: string, formData: FormData) {
    const supabase = await createClient();

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const place = formData.get("place") as string;
    const barcode = formData.get("barcode") as string;
    const password = formData.get("password") as string;

    if (!full_name || !barcode || !password) {
        return { error: "Name, Barcode, and Password are required." };
    }

    const { error } = await supabase.from("members").update({
        full_name,
        phone: phone || null,
        address: address || null,
        place: place || null,
        barcode,
        password,
    }).eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return { error: "A member with this barcode already exists." };
        }
        console.error("Error updating member:", error);
        return { error: "Failed to update member. Please try again." };
    }

    revalidatePath("/members");

    return { success: true, message: "Member successfully updated" };
}

export async function deleteMember(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
        console.error("Error deleting member:", error);
        return { error: "Failed to delete member. Please try again." };
    }

    revalidatePath("/members");
    return { success: true, message: "Patron successfully deleted!" };
}

export async function processCheckOut(memberBarcode: string, bookBarcode: string) {
    const supabase = await createClient();

    // 1. Verify Member
    const { data: member, error: memberErr } = await supabase
        .from("members")
        .select("id, full_name")
        .eq("barcode", memberBarcode)
        .single();

    if (memberErr || !member) return { error: "Member not found. Please check barcode." };

    // 2. Verify Book and Availability
    const { data: book, error: bookErr } = await supabase
        .from("books")
        .select("id, title, available_copies")
        .eq("barcode", bookBarcode)
        .single();

    if (bookErr || !book) return { error: "Book not found. Please check barcode." };
    if (book.available_copies <= 0) return { error: "No available copies for this book currently." };

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // 3. Insert Circulation Record
    const { error: circErr } = await supabase.from("circulation").insert({
        book_id: book.id,
        member_id: member.id,
        status: "Borrowed",
        borrow_date: borrowDate.toISOString(),
        due_date: dueDate.toISOString()
    });

    if (circErr) {
        console.error("Error creating circulation record:", circErr);
        return { error: "Failed to process checkout transaction." };
    }

    // 4. Update Book available_copies (-1)
    const { error: updateErr } = await supabase
        .from("books")
        .update({ available_copies: book.available_copies - 1 })
        .eq("id", book.id);

    if (updateErr) console.error("Error updating book copies:", updateErr);

    revalidatePath("/check-in-out");
    revalidatePath("/catalog");

    return {
        success: true,
        message: "Book checked out successfully!",
        details: {
            member: member.full_name,
            book: book.title,
            checkoutDate: borrowDate.toLocaleDateString(),
            returnDate: dueDate.toLocaleDateString()
        }
    };
}

export async function processCheckIn(bookBarcode: string) {
    const supabase = await createClient();

    // 1. Find Book
    const { data: book, error: bookErr } = await supabase
        .from("books")
        .select("id, available_copies")
        .eq("barcode", bookBarcode)
        .single();

    if (bookErr || !book) return { error: "Book not found." };

    // 2. Find Active 'Borrowed' Circulation Record
    const { data: circRecord, error: findCircErr } = await supabase
        .from("circulation")
        .select("id")
        .eq("book_id", book.id)
        .eq("status", "Borrowed")
        .order("borrow_date", { ascending: false })
        .limit(1)
        .single();

    if (findCircErr || !circRecord) return { error: "No active checkout found for this book." };

    // 3. Update Circulation Record (Set block to 'Returned')
    const { error: circErr } = await supabase
        .from("circulation")
        .update({
            status: "Returned",
            return_date: new Date().toISOString()
        })
        .eq("id", circRecord.id);

    if (circErr) {
        console.error("Error returning book:", circErr);
        return { error: "Failed to process check-in transaction." };
    }

    // 4. Update Book available_copies (+1)
    const { error: updateErr } = await supabase
        .from("books")
        .update({ available_copies: book.available_copies + 1 })
        .eq("id", book.id);

    if (updateErr) console.error("Error updating book copies:", updateErr);

    revalidatePath("/check-in-out");
    revalidatePath("/catalog");

    return { success: true, message: "Book returned successfully!" };
}

export async function getAllTransactions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("circulation")
        .select(`
            id,
            borrow_date,
            return_date,
            due_date,
            status,
            books ( title, barcode ),
            members ( full_name, barcode )
        `)
        .order("borrow_date", { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    return data;
}

export async function getMemberDashboardStats(memberBarcode: string) {
    const supabase = await createClient();

    // Find the member's ID
    const { data: member, error: memberErr } = await supabase
        .from("members")
        .select("id")
        .eq("barcode", memberBarcode)
        .single();

    if (memberErr || !member) return { error: "Member not found" };

    // Fetch all circulation records for this member
    const { data: records, error: recordsErr } = await supabase
        .from("circulation")
        .select(`
            id,
            borrow_date,
            due_date,
            return_date,
            status,
            books ( title, author, barcode )
        `)
        .eq("member_id", member.id)
        .order("borrow_date", { ascending: false });

    if (recordsErr) return { error: "Failed to fetch data" };

    const today = new Date();

    let totalRead = 0;
    let currentlyBorrowed = 0;
    let returnedHistory = 0;
    let dueThisWeek = 0;
    const activeBorrows: any[] = [];
    const returnedBooks: any[] = [];
    const allBooks: any[] = [];

    records?.forEach(r => {
        totalRead++;
        allBooks.push(r);

        if (r.status === "Returned") {
            returnedHistory++;
            returnedBooks.push(r);
        } else if (r.status === "Borrowed") {
            currentlyBorrowed++;

            const dueDate = new Date(r.due_date);
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7 && diffDays >= 0) {
                dueThisWeek++;
            }

            activeBorrows.push({
                ...r,
                daysUntilDue: diffDays
            });
        }
    });

    return {
        success: true,
        stats: {
            totalRead,
            currentlyBorrowed,
            returnedHistory,
            dueThisWeek
        },
        activeBorrows,
        returnedBooks,
        allBooks
    };
}

export async function processRenew(bookBarcode: string) {
    const supabase = await createClient();

    // 1. Find Book
    const { data: book, error: bookErr } = await supabase
        .from("books")
        .select("id, title")
        .eq("barcode", bookBarcode)
        .single();

    if (bookErr || !book) return { error: "Book not found. Please check barcode." };

    // 2. Find Active 'Borrowed' Circulation Record
    const { data: circRecord, error: findCircErr } = await supabase
        .from("circulation")
        .select(`
            id,
            due_date,
            members ( full_name )
        `)
        .eq("book_id", book.id)
        .eq("status", "Borrowed")
        .order("borrow_date", { ascending: false })
        .limit(1)
        .single();

    if (findCircErr || !circRecord) return { error: "No active checkout found for this book to renew." };

    // 3. Calculate New Due Date (+30 days from the current due date, or from today?)
    // Given the user description "if a member has not completed reading within 30 days... extend due date". Let's extend it 30 days from today.
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 30);

    // 4. Update Circulation Record
    const { error: circErr } = await supabase
        .from("circulation")
        .update({
            due_date: newDueDate.toISOString()
        })
        .eq("id", circRecord.id);

    if (circErr) {
        console.error("Error renewing book:", circErr);
        return { error: "Failed to process renewal." };
    }

    revalidatePath("/check-in-out");
    revalidatePath("/member/dashboard-mem");
    revalidatePath("/transactions");

    return {
        success: true,
        message: "Book renewed successfully!",
        details: {
            member: Array.isArray(circRecord.members) ? (circRecord.members[0] as any)?.full_name : (circRecord.members as any)?.full_name,
            book: book.title,
            newDueDate: newDueDate.toLocaleDateString()
        }
    };
}

// -------------------------------------------------------------
// SYSTEM BACKUP ACTION
// -------------------------------------------------------------
export async function generateSystemBackup() {
    const supabase = await createClient();

    // Fetch all records joining books and members
    const { data, error } = await supabase
        .from('circulation')
        .select(`
            id,
            borrow_date,
            due_date,
            return_date,
            status,
            book_id,
            books ( title, author, barcode ),
            member_id,
            members ( full_name, membership_type, barcode )
        `)
        .order('borrow_date', { ascending: false });

    if (error) {
        console.error("Backup generation failed:", error);
        return { error: error.message };
    }

    return { success: true, data: data || [] };
}


