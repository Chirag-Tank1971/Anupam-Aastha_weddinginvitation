import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Used when RSVP_EMAIL_ADDRESS is not set — replace with your inbox or always set the env var. */
const FALLBACK_RSVP_INBOX = "your.inbox@gmail.com";

const FROM_ADDRESS = "Wedding RSVP <onboarding@resend.dev>";

type RSVPBody = {
  name?: string;
  attending?: string;
  events?: string | string[];
  fun?: string | string[];
  wishes?: string;
  guests?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;

function normalizeStringArray(value: string | string[] | undefined): string[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
}

function formatList(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "None selected";
}

function safeSubjectPart(text: string): string {
  return text.replace(/[\r\n<>]/g, " ").slice(0, 120);
}

export async function POST(request: Request) {
  let body: RSVPBody;
  try {
    body = (await request.json()) as RSVPBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const attending = typeof body.attending === "string" ? body.attending.trim() : "";

  if (!name || !attending) {
    return NextResponse.json({ error: "Name and attending are required." }, { status: 400 });
  }

  if (!resendApiKey) {
    return NextResponse.json({ error: "Resend is not configured. Set RESEND_API_KEY." }, { status: 500 });
  }

  const recipientEmail = process.env.RSVP_EMAIL_ADDRESS?.trim() || FALLBACK_RSVP_INBOX;
  const eventsList = normalizeStringArray(body.events);
  const funList = normalizeStringArray(body.fun);
  const wishes = typeof body.wishes === "string" ? body.wishes.trim() : "";
  const guests = typeof body.guests === "string" ? body.guests.trim() : "";

  const eventsText = formatList(eventsList);
  const funText = formatList(funList);

  const resend = new Resend(resendApiKey);

  const newRsvpHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>New RSVP</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Attending:</strong> ${escapeHtml(attending)}</p>
          <p><strong>Number of guests:</strong> ${escapeHtml(guests || "—")}</p>
          <p><strong>Events:</strong> ${escapeHtml(eventsText)}</p>
          <p><strong>Fun / preferences:</strong> ${escapeHtml(funText)}</p>
          <p><strong>Wishes:</strong> ${escapeHtml(wishes || "—")}</p>
        </div>
      `;

  const { data: data1, error: error1 } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: recipientEmail,
    subject: `New RSVP — ${safeSubjectPart(name)}`,
    html: newRsvpHtml,
  });

  if (error1) {
    console.error("[Resend] New RSVP email failed:", error1);
    return NextResponse.json(
      { error: error1.message || "Failed to send RSVP notification." },
      { status: 502 }
    );
  }

  const thankYouHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>RSVP received (copy)</h2>
          <p>This confirms an RSVP was logged for <strong>${escapeHtml(name)}</strong>.</p>
          <p><strong>Attending:</strong> ${escapeHtml(attending)}</p>
          <p><strong>Number of guests:</strong> ${escapeHtml(guests || "—")}</p>
          <p><strong>Events:</strong> ${escapeHtml(eventsText)}</p>
          <p><strong>Fun / preferences:</strong> ${escapeHtml(funText)}</p>
          <p><strong>Wishes:</strong> ${escapeHtml(wishes || "—")}</p>
          <p style="margin-top:16px;color:#666;font-size:13px;">Anupam & Aastha — Wedding RSVP</p>
        </div>
      `;

  const { data: data2, error: error2 } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: recipientEmail,
    subject: `RSVP received — ${safeSubjectPart(name)}`,
    html: thankYouHtml,
  });

  if (error2) {
    console.error("[Resend] RSVP copy email failed:", error2);
    return NextResponse.json(
      {
        error: error2.message || "RSVP was saved but the second notification failed.",
        partial: true,
        id: data1?.id,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, ids: [data1?.id, data2?.id] });
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
