import { NextRequest, NextResponse } from "next/server";
import { sendEmailNotification, type SecurityIncident } from "@/lib/elvis";

export async function POST(req: NextRequest) {
  try {
    const incident = await req.json() as SecurityIncident;

    // Validate incident structure
    if (!incident.id || !incident.type || !incident.severity || !incident.ip) {
      return NextResponse.json(
        { error: "Invalid incident data" },
        { status: 400 }
      );
    }

    // Send email notifications to both addresses
    const emails = [
      "studio@yas-arc.com",
      "vg.gianmarco@gmail.com",
    ];

    await sendEmailNotification(incident, emails);

    // Log webhook received
    console.log(`[ELVIS] Webhook received: ${incident.type} from ${incident.ip}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ELVIS] Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
