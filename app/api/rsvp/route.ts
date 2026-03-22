import { NextResponse } from "next/server";
import { Resend } from "resend";

type RSVPBody = {
  name?: string;
  email?: string;
  attendance?: "yes" | "no";
  guests?: string;
  message?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL;
const resendTo = process.env.RESEND_TO_EMAIL;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RSVPBody;

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!resendApiKey || !resendFrom || !resendTo) {
      return NextResponse.json(
        { error: "Resend is not configured. Add RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const attendanceText = body.attendance === "no" ? "Regretfully Declines" : "Joyfully Accepts";

    await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      replyTo: body.email,
      subject: `New Wedding RSVP - ${body.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>New RSVP Submission</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Attendance:</strong> ${attendanceText}</p>
          <p><strong>Guests:</strong> ${body.guests || "-"}</p>
          <p><strong>Message:</strong> ${body.message || "-"}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit RSVP." }, { status: 500 });
  }
}
