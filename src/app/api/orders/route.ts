import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    if (!isSupabaseConfigured) {
        return NextResponse.json(
            { error: "Database not configured. Please set Supabase credentials in .env.local" },
            { status: 503 }
        );
    }
    try {
        const { name, phone, address } = await req.json();

        if (!name || !phone || !address) {
            return NextResponse.json(
                { error: "সব ফিল্ড পূরণ করা আবশ্যক।" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('orders')
            .insert([
                { name, phone, address, status: 'Pending' }
            ])
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json(
                { error: "অর্ডার সংরক্ষণ করতে সমস্যা হয়েছে।" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!", order: data[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "সার্ভারে একটি অপ্রত্যাশিত সমস্যা হয়েছে।" },
            { status: 500 }
        );
    }
}
