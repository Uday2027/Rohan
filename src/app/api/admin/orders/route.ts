import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { validTokens, TOKEN_NAME } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

async function isAuthed() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    return !!token && validTokens.has(token);
}

export async function GET() {
    if (!(await isAuthed())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: "Database not configured. Please set Supabase credentials in .env.local" },
            { status: 503 }
        );
    }
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!(await isAuthed())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: "Database not configured" },
            { status: 503 }
        );
    }
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
        }

        return NextResponse.json({ message: "Order updated successfully", order: data[0] });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAuthed())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: "Database not configured" },
            { status: 503 }
        );
    }
    try {
        const { id } = await req.json();

        if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ message: "Order deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
