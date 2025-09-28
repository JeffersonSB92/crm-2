import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!; 
// exemplo: http://localhost:4000/auth/google/callback

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Gera URL para login no Google
export function getAuthUrl() {
  const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

// Troca "code" por tokens
export async function getTokens(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

// Configura cliente com tokens
export function setCredentials(tokens: any) {
  oAuth2Client.setCredentials(tokens);
  return google.gmail({ version: "v1", auth: oAuth2Client });
}
