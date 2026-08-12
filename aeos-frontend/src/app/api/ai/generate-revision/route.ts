import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jarvisUrl = process.env.JARVISLABS_API_URL;

    if (!jarvisUrl) {
      return NextResponse.json({ error: "JARVISLABS_API_URL is not defined in environment variables" }, { status: 500 });
    }

    const response = await fetch(`${jarvisUrl}/api/v1/revision/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Core Revision Gen Error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in AI revision generator proxy:", error);
    return NextResponse.json({ error: error.message || "Failed to contact AI core" }, { status: 500 });
  }
}
