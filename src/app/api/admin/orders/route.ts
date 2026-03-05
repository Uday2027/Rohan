import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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
