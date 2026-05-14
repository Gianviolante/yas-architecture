import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, cognome, email, messaggio, telefono } = body;

  if (!email || !messaggio) {
    return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
  }

  // Send via Resend when API key is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YAS Architecture <noreply@yas-arch.com>",
        to: ["info@yas-arch.com"],
        reply_to: email,
        subject: `Nuovo messaggio da ${nome} ${cognome}`.trim(),
        html: `
          <p><strong>Nome:</strong> ${nome} ${cognome}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${telefono ? `<p><strong>Telefono:</strong> ${telefono}</p>` : ""}
          <p><strong>Messaggio:</strong></p>
          <p>${messaggio.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
    }
  } else {
    // Development: log the submission
    console.log("Contact form submission (no RESEND_API_KEY):", body);
  }

  return NextResponse.json({ success: true });
}
