import { NextRequest, NextResponse } from "next/server";
import { deleteGoogleCalendarEvent } from "@/lib/googleCalender";

interface DeleteEventRequestBody {
  accessToken: string;
  eventId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DeleteEventRequestBody;
    const { accessToken, eventId } = body;
    const result = await deleteGoogleCalendarEvent(accessToken, eventId);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      console.error("API error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}