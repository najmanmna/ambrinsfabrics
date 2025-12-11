// lib/sendSubscribeEmail.ts
"use server";

import { Resend } from "resend";

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}
// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendSubscribeEmail = async ({ to, subject, html }: EmailProps) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is missing");
  }

  try {
    const data = await resend.emails.send({
      // ✅ Sending from your verified domain
      from: "ELDA <no-reply@elda.lk>", 
      to,
      subject,
      html,
    });

    if (data.error) {
      console.error("Resend Error:", data.error);
      throw new Error("Failed to send email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Sending Failed:", error);
    // You might want to return an error object or throw, depending on how your frontend handles it
    throw error;
  }
};