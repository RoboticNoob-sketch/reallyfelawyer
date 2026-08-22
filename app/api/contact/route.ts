import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  description: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactPayload>;

  if (!body.name || !body.phone || !body.email || !body.description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO before launch: wire this up to real email delivery, e.g. Resend
  // (https://resend.com) or SendGrid. Example with Resend:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "RealLyfe Lawyer <intake@reallyfelawyer.online>",
  //     to: "info@taylormadelaw.com",
  //     subject: `New case review request from ${body.name}`,
  //     text: `Name: ${body.name}\nPhone: ${body.phone}\nEmail: ${body.email}\n\n${body.description}`,
  //   });
  //
  // For now this just logs server-side so the form is testable end-to-end.
  console.log("New case review request:", body);

  return NextResponse.json({ ok: true });
}
