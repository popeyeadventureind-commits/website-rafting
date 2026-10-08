import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("services")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase keep-alive error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Supabase connection failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase is active",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Keep-alive error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Keep-alive failed",
      },
      { status: 500 }
    );
  }
}