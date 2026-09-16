export type ContactLeadPayload = {
  fullName: FormDataEntryValue | null;
  workEmail: FormDataEntryValue | null;
  mobileNumber: FormDataEntryValue | null;
  companyType: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
};

export async function submitContactLead(payload: ContactLeadPayload): Promise<{
  ok: boolean;
  error?: string;
}> {
  const response = await fetch("/api/contact-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as { ok?: boolean; error?: string };

  if (!response.ok || !result.ok) {
    return {
      ok: false,
      error: result.error || "Could not save your details. Please try again.",
    };
  }

  return { ok: true };
}
