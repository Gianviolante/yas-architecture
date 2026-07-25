import { NextRequest, NextResponse } from "next/server";
import { sendEmailNotification, type SecurityIncident } from "@/lib/elvis";

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Validate webhook authentication token
    const authHeader = req.headers.get("authorization");
    const webhookToken = process.env.ELVIS_WEBHOOK_TOKEN;

    if (!webhookToken || !authHeader?.startsWith("Bearer ")) {
      console.warn("[ELVIS] Webhook rejected: missing or invalid authorization");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix
    if (token !== webhookToken) {
      console.warn("[ELVIS] Webhook rejected: invalid token");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
