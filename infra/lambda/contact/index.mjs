import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});

const {
  SENDER_EMAIL,
  RECIPIENT_EMAIL,
  CONFIG_SET,
  MIN_SUBMIT_MS = "3000",
} = process.env;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const ok = () => json(200, { message: "Message sent" });
const bad = (code, message) => json(code, { message });

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

export const handler = async (event) => {
  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return bad(400, "Invalid JSON");
  }

  const { name, email, phone, message, company, elapsedMs } = data;

  // Honeypot + speed trap. Return 200 so bots learn nothing.
  if (company) return ok();
  if (Number(elapsedMs) < Number(MIN_SUBMIT_MS)) return ok();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return bad(400, "Missing required fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad(400, "Invalid email");
  }
  if (message.length > 5000) return bad(400, "Message too long");

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    "",
    message,
  ].join("\n");

  const html = `
    <table style="font-family:system-ui,sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${esc(phone) || "—"}</td></tr>
    </table>
    <hr />
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px">${esc(message)}</p>
  `;

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: SENDER_EMAIL,
        Destination: { ToAddresses: [RECIPIENT_EMAIL] },
        ReplyToAddresses: [email],
        ConfigurationSetName: CONFIG_SET,
        Content: {
          Simple: {
            Subject: { Data: `New inquiry — ${name}` },
            Body: { Text: { Data: text }, Html: { Data: html } },
          },
        },
      }),
    );
    return ok();
  } catch (err) {
    console.error("SES send failed", err);
    return bad(502, "Could not send message");
  }
};
