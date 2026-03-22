/** Generate a minimal .ics file for Save the Date / wedding day. */
export function buildWeddingIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AnupamAastha//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding-anupam-aastha-20260503@wedding-invite",
    "DTSTAMP:20260101T120000Z",
    "DTSTART;VALUE=DATE:20260503",
    "DTEND;VALUE=DATE:20260504",
    "SUMMARY:Anupam & Aastha — Wedding Day",
    "DESCRIPTION:Celebrations 30 April – 5 May. Marriage at sunset — Hotel Taj Theog\\, Shimla.",
    "LOCATION:Hotel Taj Theog\\, Shimla\\, Himachal Pradesh",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const WHATSAPP_SHARE_TEXT =
  "You're invited to celebrate Anupam & Aastha — wedding celebrations 30 April to 5 May in Shimla & Chandigarh. Details on the invitation site.";
