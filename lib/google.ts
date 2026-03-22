import { google } from "googleapis";

export function getGoogleClients(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });
  const analytics = google.analyticsdata({ version: "v1beta", auth });

  return { gmail, analytics };
}

export async function sendGmailMessage(accessToken: string, to: string, subject: string, bodyText: string) {
  const { gmail } = getGoogleClients(accessToken);
  
  // Encode as base64url format for Gmail API
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    bodyText,
  ];
  
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
  return res.data;
}

export async function getRecentAnalytics(accessToken: string, propertyId: string) {
  const { analytics } = getGoogleClients(accessToken);
  const response = await analytics.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    },
  });
  return response.data;
}
