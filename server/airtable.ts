import { ReplitConnectors } from "@replit/connectors-sdk";
import type { Question } from "@shared/schema";

const airtableBaseId = process.env.AIRTABLE_BASE_ID?.trim();
const airtableTableId = process.env.AIRTABLE_TABLE_ID?.trim();

type AirtableSyncResult =
  | { synced: true; recordId: string | null }
  | { synced: false; skipped: true; reason: string }
  | { synced: false; skipped: false; reason: string };

function getAirtableFields(question: Question): Record<string, string | boolean> {
  return {
    "Question ID": question.id,
    Question: question.questionText,
    Email: question.email,
    ...(question.firstName ? { "First name": question.firstName } : {}),
    ...(question.company ? { Company: question.company } : {}),
    ...(question.role ? { Role: question.role } : {}),
    "Keep anonymous": question.keepAnonymous,
    "Marketing consent": question.marketingConsent,
    Status: question.status,
    "Submitted at": (question.createdAt || new Date()).toISOString(),
  };
}

export async function syncQuestionToAirtable(question: Question): Promise<AirtableSyncResult> {
  if (!airtableBaseId || !airtableTableId) {
    console.warn("[airtable] question sync skipped: AIRTABLE_BASE_ID or AIRTABLE_TABLE_ID is not configured");
    return {
      synced: false,
      skipped: true,
      reason: "Airtable base or table is not configured",
    };
  }

  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy(
      "airtable",
      `/v0/${encodeURIComponent(airtableBaseId)}/${encodeURIComponent(airtableTableId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: [{ fields: getAirtableFields(question) }],
          typecast: true,
        }),
      },
    );

    if (!response.ok) {
      console.error("[airtable] question sync failed", {
        questionId: question.id,
        status: response.status,
        statusText: response.statusText,
      });
      return {
        synced: false,
        skipped: false,
        reason: `Airtable returned ${response.status}`,
      };
    }

    const result = await response.json() as { records?: Array<{ id?: string }> };
    const recordId = result.records?.[0]?.id || null;
    console.log("[airtable] question synced", {
      questionId: question.id,
      recordId,
    });
    return { synced: true, recordId };
  } catch (error) {
    console.error("[airtable] question sync request failed", {
      questionId: question.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      synced: false,
      skipped: false,
      reason: error instanceof Error ? error.message : "Unknown Airtable error",
    };
  }
}