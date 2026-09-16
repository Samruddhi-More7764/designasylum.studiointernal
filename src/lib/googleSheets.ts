import { readFileSync } from "node:fs";
import { JWT } from "google-auth-library";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

const COMPANY_LABELS: Record<string, string> = {
  startup: "Startup",
  enterprise: "Enterprise",
  agency: "Agency",
};

export type ContactLead = {
  fullName: string;
  workEmail: string;
  mobileNumber: string;
  companyType: string;
  message: string;
};

export type ContactLeadResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

function loadServiceAccount(): ServiceAccount {
  const inline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (inline) {
    const parsed = JSON.parse(inline) as ServiceAccount;
    return normalizeAccount(parsed);
  }

  const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as ServiceAccount;
    return normalizeAccount(parsed);
  }

  throw new Error("Google service account is not configured.");
}

function normalizeAccount(parsed: ServiceAccount): ServiceAccount {
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Google service account JSON is missing client_email or private_key.");
  }

  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

function sheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim() || "Sheet1";

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set.");
  }

  return { spreadsheetId, sheetName };
}

export function validateContactLead(
  input: Partial<ContactLead>,
): ContactLeadResult & { lead?: ContactLead } {
  const fullName = input.fullName?.trim() ?? "";
  const workEmail = input.workEmail?.trim() ?? "";
  const mobileNumber = input.mobileNumber?.trim() ?? "";
  const companyType = input.companyType?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!fullName || !workEmail || !mobileNumber || !companyType || !message) {
    return { ok: false, error: "Please fill in every field.", status: 400 };
  }

  if (fullName.length > 120 || workEmail.length > 254 || message.length > 4000) {
    return { ok: false, error: "One of the fields is too long.", status: 400 };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    return { ok: false, error: "Enter a valid work email.", status: 400 };
  }

  const digits = mobileNumber.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    return { ok: false, error: "Enter a valid mobile number.", status: 400 };
  }

  if (!COMPANY_LABELS[companyType]) {
    return { ok: false, error: "Select a company type.", status: 400 };
  }

  return {
    ok: true,
    lead: {
      fullName,
      workEmail,
      mobileNumber: digits,
      companyType,
      message,
    },
  };
}

export async function appendContactLead(lead: ContactLead): Promise<void> {
  const account = loadServiceAccount();
  const { spreadsheetId, sheetName } = sheetsConfig();
  const auth = new JWT({
    email: account.client_email,
    key: account.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const { token } = await auth.getAccessToken();
  if (!token) {
    throw new Error("Could not get a Google access token.");
  }

  const range = `${sheetName}!A:E`;
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append`,
  );
  // RAW so values like "+91 9…" stay as text instead of becoming formulas.
  url.searchParams.set("valueInputOption", "RAW");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [
        [
          lead.fullName,
          lead.workEmail,
          `+91 ${lead.mobileNumber}`,
          COMPANY_LABELS[lead.companyType],
          lead.message,
        ],
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Google Sheets append failed", response.status, detail);
    throw new Error("Google Sheets append failed.");
  }
}
