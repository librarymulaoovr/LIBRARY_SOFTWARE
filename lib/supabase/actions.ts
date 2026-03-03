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
