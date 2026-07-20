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
  // Get client IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Troppi tentativi. Riprova più tardi." },
      { status: 429 }
    );
  }

  // Verify CSRF token
  const csrfTokenCookie = req.cookies.get("csrf-token")?.value;
  const body = await req.json();
  const { nome, cognome, email, messaggio, telefono, csrfToken } = body;

  if (!csrfTokenCookie || csrfToken !== csrfTokenCookie) {
    return NextResponse.json(
      { error: "Validazione sessione fallita. Ricarica la pagina." },
      { status: 403 }
    );
  }

  // Validate input
  const validation = validateInput(nome, cognome, email, messaggio, telefono);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Sanitize input to prevent XSS
  const safeNome = escapeHtml(nome?.trim() || "");
  const safeCognome = escapeHtml(cognome?.trim() || "");
  const safeEmail = escapeHtml(email.trim());
  const safeMessaggio = escapeHtml(messaggio.trim());
  const safeTelefono = escapeHtml(telefono?.trim() || "");

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
    if (!res.ok) {
      return NextResponse.json({ error: "Errore invio email" }, { status: 500 });
    }
  } else {
    // Development: log the submission
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
