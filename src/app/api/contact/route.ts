import { NextRequest, NextResponse } from "next/server";

// Sanitize HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate input length and content
function validateInput(
  nome: string | undefined,
  cognome: string | undefined,
  email: string | undefined,
  messaggio: string | undefined,
  telefono: string | undefined
): { valid: boolean; error?: string } {
  if (!email || !messaggio) {
    return { valid: false, error: "Campi obbligatori mancanti" };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: "Email non valida" };
  }

  if (messaggio.length < 10 || messaggio.length > 5000) {
    return { valid: false, error: "Messaggio deve essere tra 10 e 5000 caratteri" };
  }

  if (nome && nome.length > 100) {
    return { valid: false, error: "Nome troppo lungo" };
  }

  if (cognome && cognome.length > 100) {
    return { valid: false, error: "Cognome troppo lungo" };
  }

  if (telefono && telefono.length > 20) {
    return { valid: false, error: "Telefono troppo lungo" };
  }

  return { valid: true };
}

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 requests per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  let requests = rateLimitMap.get(ip) || [];
  requests = requests.filter((timestamp) => timestamp > windowStart);

  if (requests.length >= RATE_LIMIT_MAX) {
    return false;
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);
  return true;
}

export async function POST(req: NextRequest) {
  // Get client IP for rate limiting (trim whitespace from split)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Troppi tentativi. Riprova più tardi.", code: "RATE_LIMIT_EXCEEDED" },
      { status: 429 }
    );
  }

  // Verify CSRF token
  const csrfTokenCookie = req.cookies.get("csrf-token")?.value;
  const body = await req.json();
  const { nome, cognome, email, messaggio, telefono, csrfToken } = body;

  if (!csrfTokenCookie || csrfToken !== csrfTokenCookie) {
    return NextResponse.json(
      { error: "Validazione sessione fallita. Ricarica la pagina.", code: "CSRF_VALIDATION_FAILED" },
      { status: 403 }
    );
  }

  // Validate input
  const validation = validateInput(nome, cognome, email, messaggio, telefono);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error, code: "VALIDATION_FAILED" }, { status: 400 });
  }

  // Sanitize input to prevent XSS
  const safeNome = escapeHtml(nome?.trim() || "");
  const safeCognome = escapeHtml(cognome?.trim() || "");
  const safeEmail = escapeHtml(email.trim());
  const safeMessaggio = escapeHtml(messaggio.trim());
  const safeTelefono = escapeHtml(telefono?.trim() || "");

  // Generate confirmation email HTML
  const confirmationEmailHtml = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Richiesta ricevuta — YAS Architecture</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Logo -->
    <div style="padding: 60px 40px 40px; text-align: center; border-bottom: 1px solid #e5e5e5;">
      <img src="https://yas-architecture.vercel.app/logo.png" alt="YAS Architecture" style="max-width: 120px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
    </div>
    <!-- Contenuto -->
    <div style="padding: 60px 40px;">
      <h1 style="margin: 0 0 20px; font-size: 36px; font-weight: 300; text-align: center;">Grazie</h1>
      <p style="margin: 0 0 40px; font-size: 16px; text-align: center; color: #666; line-height: 1.8;">
        Abbiamo ricevuto la tua richiesta.<br>
        Ti risponderemo al più presto.
      </p>
      <div style="background-color: #f5f5f5; padding: 30px; margin: 0 0 40px; text-align: center;">
        <div style="margin-bottom: 25px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #999; margin-bottom: 8px;">Nome</div>
          <div style="font-size: 16px; color: #000;">${safeNome} ${safeCognome}</div>
        </div>
        <div style="margin-bottom: 25px;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #999; margin-bottom: 8px;">Email</div>
          <div style="font-size: 16px; color: #000;">${safeEmail}</div>
        </div>
        <div style="margin-bottom: 0;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #999; margin-bottom: 8px;">Messaggio</div>
          <div style="font-size: 16px; color: #000;">${safeMessaggio.replace(/\n/g, "<br>")}</div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding: 40px; text-align: center; border-top: 1px solid #e5e5e5; font-size: 13px; color: #999;">
      <p style="margin: 0 0 15px;">
        <a href="https://yas-arc.com" style="color: #000; text-decoration: none; border-bottom: 1px solid #000;">yas-arc.com</a>
      </p>
      <p style="margin: 0 0 20px; line-height: 1.6;">
        Piazza Marco Antonio Cavalerio, 21<br>
        72100 Brindisi, Italia
      </p>
      <div style="margin-bottom: 20px;">
        <a href="https://www.facebook.com/p/Y-A-S-architecture-100063041749591" style="display: inline-block; margin: 0 12px; color: #000; text-decoration: none; font-size: 12px;">Facebook</a>
        <a href="https://www.instagram.com/yas_architecture_/" style="display: inline-block; margin: 0 12px; color: #000; text-decoration: none; font-size: 12px;">Instagram</a>
      </div>
      <p style="margin: 0; color: #ccc;">
        © YAS Architecture Associati
      </p>
    </div>
  </div>
</body>
</html>`;

  // Send via Resend when API key is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      // Send confirmation email to customer
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "YAS Architecture <studio@yas-arc.com>",
          to: [safeEmail],
          subject: "Richiesta ricevuta — YAS Architecture",
          html: confirmationEmailHtml,
        }),
      });

      // Send notification to team
      const teamRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "YAS Architecture <studio@yas-arc.com>",
          to: ["studio@yas-arc.com"],
          reply_to: safeEmail,
          subject: `Nuovo messaggio da ${safeNome} ${safeCognome}`.trim(),
          html: `
            <p><strong>Nome:</strong> ${safeNome} ${safeCognome}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeTelefono ? `<p><strong>Telefono:</strong> ${safeTelefono}</p>` : ""}
            <p><strong>Messaggio:</strong></p>
            <p>${safeMessaggio.replace(/\n/g, "<br>")}</p>
          `,
        }),
      });

      if (!teamRes.ok) {
        const errorData = await teamRes.json();
        console.error("Resend error:", errorData);
        return NextResponse.json({ error: "Errore invio email", code: "EMAIL_SEND_FAILED" }, { status: 500 });
      }
    } catch (error) {
      console.error("Resend fetch error:", error);
      return NextResponse.json({ error: "Errore invio email", code: "EMAIL_SEND_FAILED" }, { status: 500 });
    }
  } else if (process.env.NODE_ENV === "development") {
    // Development only: log the submission
    console.log("Contact form submission (no RESEND_API_KEY):", {
      nome: safeNome,
      cognome: safeCognome,
      email: safeEmail,
      messaggio: safeMessaggio,
      telefono: safeTelefono,
    });
  }

  return NextResponse.json({ success: true });
}
