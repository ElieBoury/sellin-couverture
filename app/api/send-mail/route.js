import { getWebSite } from "@/lib/webSite";
import Mailjet from "node-mailjet";

export async function POST(request) {
  const { subject, message, email } = await request.json();

  try {
    const mailjetClient = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY,
    );
    const webSite = await getWebSite();
    const toEmail = webSite?.email;

    if (toEmail) {
      const emailData = {
        Messages: [
          {
            From: {
              Email: "elie@artilis.fr",
            },
            ReplyTo: {
              Email: email,
            },
            To: [
              {
                Email: toEmail,
              },
            ],
            Subject: subject,
            TextPart: message,
          },
        ],
      };
      const res = await mailjetClient
        .post("send", { version: "v3.1" })
        .request(emailData);
      return Response.json(res.body);
    } else {
      return Response.json({ message: "Email not configured" });
    }
  } catch (error) {
    return Response.error(error);
  }
}
