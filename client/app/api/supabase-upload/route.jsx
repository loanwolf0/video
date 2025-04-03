import { supabase } from "@/configs/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const fileExt = file.name.split(".").pop();
    const filePath = `uploads/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage.from("uploads").upload(filePath, file);

    if (error) throw error;

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.log(err.message, "PPP");
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
