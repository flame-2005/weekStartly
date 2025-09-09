import { NextRequest, NextResponse } from "next/server";
import { updateGoogleCalendarEvent } from "@/lib/googleCalender";

interface UpdateEventRequestBody {
  accessToken: string;
  eventId: string;
  event: {
    title?: string;
    date?: string;
    activity?: string;
    end?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UpdateEventRequestBody;
    const { accessToken, eventId, event } = body;
    const result = await updateGoogleCalendarEvent(accessToken, eventId, event);
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