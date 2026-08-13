// Config for SalesScout AI
export const GOOGLE_CLIENT_ID = ((import.meta as any).env && (import.meta as any).env.VITE_GOOGLE_CLIENT_ID) || "YOUR_GOOGLE_CLIENT_ID";

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/gmail.send",
].join(" ");
