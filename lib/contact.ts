// /app/actions/contact.ts
"use server";

import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    // 1. Send Notification to Admin (You)
    await sendSubscribeEmail({
      to: "ambrins.fabricstore@gmail.com", // Your admin email
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #A67B5B;">New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 2. Send Confirmation to User
    await sendSubscribeEmail({
      to: email,
      subject: "We received your message - ELDA",
      html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h1 style="color: #A67B5B; font-family: serif;">ELDA</h1>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out. We have received your message and will get back to you as soon as possible.</p>
          <br/>
          <p style="color: #888; font-size: 12px;">This is an automated confirmation.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}