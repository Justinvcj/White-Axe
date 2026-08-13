import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const jarvisUrl = process.env.JARVISLABS_API_URL;

    if (!jarvisUrl) {
      return NextResponse.json({ error: "JARVISLABS_API_URL is not defined in environment variables" }, { status: 500 });
    }

    // Forward the exact FormData to FastAPI
    const response = await fetch(`${jarvisUrl}/api/v1/curriculum/ingest`, {
      method: "POST",
      body: formData,
      // Note: fetch will automatically set the correct Content-Type with the boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Core Curriculum Error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in Curriculum proxy:", error);
    return NextResponse.json({ error: error.message || "Failed to contact AI core" }, { status: 500 });
  }
}
