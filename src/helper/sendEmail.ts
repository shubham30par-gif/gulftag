import { config } from "dotenv";
import { Resend } from "resend";
config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  const { data, error } = await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ||
      "Gulflasertag <contact@gulflasertag.net>",
    to: [email],
    subject: subject,
    html: text,
  });
  console.log(data);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
