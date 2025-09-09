import { NextRequest, NextResponse } from "next/server";
import { addEventToGoogleCalendar } from "@/lib/googleCalender";

interface AddEventRequestBody {
  accessToken: string;
  event: {
    title: string;
    date: string;
    end:string
    activity: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AddEventRequestBody;
    console.log("Received body:", body);
    const { accessToken, event } = body;
    const result = await addEventToGoogleCalendar(accessToken, event);
    console.log("Google Calendar API result:", result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      console.error("API error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    // fallback for non-Error exceptions
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}
