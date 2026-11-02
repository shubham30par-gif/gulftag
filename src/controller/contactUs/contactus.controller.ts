import { Response } from "express";
import StatusCodes from "http-status-codes";
import Joi, { isError } from "joi";
import { get as _get } from "lodash";
import { ContactUs, saveContactUs } from "../../modules/contactUs";
import { Request } from "../../request";
import { sendEmail } from "../../helper/sendEmail";
export default class Controller {
  private contactUsSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
    message: Joi.string().required(),
  });
  private readonly escapeHtml = (unsafe: string) => {
    if (!unsafe) return "";
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  protected readonly create = async (req: Request, res: Response) => {
    try {
      const payloadValue = await this.contactUsSchema
        .validateAsync(req.body)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });

      if (!payloadValue) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid or Empty Payload" });
      }
      const contact = await saveContactUs(new ContactUs({ ...payloadValue }));
      await sendEmail(
        payloadValue.email,
        `✨ Your Inquiry Has Been Received — Gulf Laser Tag`,
        `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Thanks for contacting us — Gulf Laser Tag</title>
  <style>
    body,html{margin:0;padding:0;background:#f3f6fb;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
    .wrap{max-width:680px;margin:28px auto;padding:24px;}
    .card{background:linear-gradient(180deg,#ffffff 0%, #fbfdff 100%); border-radius:14px; box-shadow:0 10px 30px rgba(23,43,77,0.08); overflow:hidden;}
    .header{padding:28px 28px 12px; display:flex; gap:16px; align-items:center;}
    .logo {width:56px;height:56px;flex:0 0 56px;border-radius:12px;background:linear-gradient(135deg,#0ea5e9,#7c3aed);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;}
    h1{font-size:20px;margin:0;color:#0f172a;}
    p.lead{margin:8px 0 0;color:#334155;font-size:15px;}
    .body{padding:18px 28px 28px;color:#475569;line-height:1.5;font-size:15px;}
    .message-box{background:#f8fafc;border:1px solid #e6eef8;padding:14px;border-radius:10px;margin:14px 0;white-space:pre-wrap;}
    .btn{display:inline-block;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:10px;border:0;}
    .primary{background:linear-gradient(90deg,#7c3aed,#0ea5e9);color:white;}
    .meta{font-size:13px;color:#94a3b8;margin-top:18px;}
    .footer{padding:18px 28px 26px;font-size:13px;color:#94a3b8;background:linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.01));border-top:1px solid rgba(15,23,42,0.03);}
    .social{display:flex;gap:10px;margin-top:8px;}
    @media (max-width:520px){ .header{padding:20px} .body{padding:16px} .footer{padding:14px} }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card" role="article" aria-roledescription="email">
      <div class="header">
        <div>
          <h1>Thanks for contacting Gulf Laser Tag ✨</h1>
          <p class="lead">Hi ${this.escapeHtml(
            payloadValue.firstName || "there"
          )} — we got your message and will reply soon.</p>
        </div>
      </div>

      <div class="body">
        <p>📨 <strong>Your message:</strong></p>
        <div class="message-box">${this.escapeHtml(
          payloadValue.message || "—"
        )}</div>

        <p>If you included a question, we'll do our best to answer within 24–48 hours. If this is urgent, you can reach us at <a href="mailto:${
          process.env.OWNER_EMAIL || "mohammedyussuf@gulflasertag.net"
        }">${
          process.env.OWNER_EMAIL || "mohammedyussuf@gulflasertag.net"
        }</a>.</p>

        <a class="btn primary" href="mailto:${
          process.env.OWNER_EMAIL || "mohammedyussuf@gulflasertag.net"
        }">Contact Support ✉️</a>

        <p class="meta">Thanks again for reaching out — the <strong>Gulflasertag</strong> team 👍</p>
      </div>

      <div class="footer">
        <div style="margin-top:12px">© ${new Date().getFullYear()} Gulf Laser Tag — All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>`
      );
      await sendEmail(
        process.env.OWNER_EMAIL || "mohammedyussuf@gulflasertag.net",
        `📥 New Inquiry Received — Gulf Laser Tag`,
        `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>New contact submission — Gulf Laser Tag</title>
        <style>
          body,html{margin:0;padding:0;background:#f2f6fb;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;}
          .wrap{max-width:700px;margin:24px auto;padding:20px;}
          .card{background:#ffffff;border-radius:12px;box-shadow:0 12px 30px rgba(20,30,60,0.06);overflow:hidden;}
          .top{background:linear-gradient(90deg,#111827,#0f172a);color:white;padding:18px 20px;display:flex;align-items:center;gap:14px}
          .mark{width:48px;height:48px;border-radius:10px;background:linear-gradient(45deg,#f97316,#ef4444);display:flex;align-items:center;justify-content:center;font-weight:700}
          .top h2{margin:0;font-size:18px}
          .content{padding:18px 20px;color:#0b1220}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .field{background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e6eef8;}
          .label{font-size:12px;color:#64748b;margin-bottom:6px}
          .val{font-size:14px;color:#0b1220}
          .message{background:#fff7ed;border:1px solid #ffedd5;padding:14px;border-radius:8px;margin-top:12px;white-space:pre-wrap}
          .actions{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap}
          .btn{padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:600;border:0}
          .btn-action{background:linear-gradient(90deg,#06b6d4,#7c3aed);color:white}
          .btn-secondary{background:#eef2ff;color:#3730a3}
          .meta{margin-top:14px;font-size:13px;color:#64748b}
          @media (max-width:560px){ .grid{grid-template-columns:1fr} }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card" role="article" aria-roledescription="email">
            <div class="top">
              <div>
                <h2>New Contact — ${this.escapeHtml(
                  payloadValue.firstName || "Unknown"
                )}</h2>
                <div style="font-size:13px;opacity:0.9">${new Date().toLocaleString()}}</div>
              </div>
            </div>

            <div class="content">
              <div class="grid">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="val">${this.escapeHtml(
                    payloadValue.firstName || "Unknown"
                  )}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="val"><a href="mailto:${this.escapeHtml(
                    payloadValue.email || ""
                  )}">${this.escapeHtml(payloadValue.email || "—")}</a></div>
                </div>

                <div class="field">
                  <div class="label">Phone</div>
                  <div class="val">${this.escapeHtml(
                    payloadValue.phoneNumber || "—"
                  )}</div>
                </div>

              </div>

              <div style="margin-top:12px">
                <div class="label">Message</div>
                <div class="message">${this.escapeHtml(
                  payloadValue.message || "—"
                )}</div>
              </div>

              <div class="actions">
                <a class="btn btn-action" href="mailto:${this.escapeHtml(
                  payloadValue.email || ""
                )}?subject=Re: ${encodeURIComponent(
          payloadValue.message || "Thanks for contacting Gulf Laser Tag"
        )}">Reply to sender ✉️</a>
                <a class="btn btn-secondary" target="_blank" href="https://admin.gulflasertag.net/dashboard/contacts" onclick="return false">Open Dashboard 🔎</a>
              </div>

                <div style="margin-top:6px;color:#94a3b8">This is an automated alert. — Gulflasertag</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>`
      );
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Thank you for contact us", result: contact });
    } catch (error) {
      console.log("error in Contact Us", error);
      res.status(500).json({
        message: "Something happened wrong try again after sometime.",
        error: _get(error, "message"),
      });
    }
  };
}
