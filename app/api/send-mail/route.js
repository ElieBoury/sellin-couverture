import Mailjet from "node-mailjet";

const mailjetClient = Mailjet.apiConnect(
  "62e10bb6cbe7ccc023674fcecd107de7",
  "9530aee91f8d8365e4d3cab688a3f8df",
);

export async function POST(request) {
  const { subject, message, email, toEmail } = await request.json();

  try {
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
