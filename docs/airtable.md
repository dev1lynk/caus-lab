# Airtable question sync

Ask Anything remains backed by PostgreSQL. After a question is validated and saved there, the server mirrors it to Airtable through the connected Replit Airtable integration.

## One-time setup

1. Connect Airtable to the Repl through the Replit integration.
2. Create or select a base and table that the connected Airtable account can edit.
3. Add the following environment variables in the Repl:

   - `AIRTABLE_BASE_ID` — the Airtable base ID, usually starting with `app`.
   - `AIRTABLE_TABLE_ID` — the Airtable table ID, usually starting with `tbl`.

4. Create these Airtable fields with the exact names below:

   - `Question ID` — single line text
   - `Question` — long text
   - `Email` — email or single line text
   - `First name` — single line text
   - `Company` — single line text
   - `Role` — single select or single line text
   - `Keep anonymous` — checkbox
   - `Marketing consent` — checkbox
   - `Status` — single select or single line text
   - `Submitted at` — date/time or single line text

The connector must have record-create permission for the selected base. Base and table IDs should be stored as environment variables, not in client code or committed files.

## Sync behavior

- PostgreSQL is the source of truth.
- Airtable sync runs only after the PostgreSQL insert succeeds.
- If Airtable is unavailable or not configured, the user still receives a successful submission response and the server logs the question ID and failure reason.
- The public form never sends Airtable credentials or calls Airtable directly.
- Airtable edits do not change the PostgreSQL question, admin status, answer, or published content.

Historical PostgreSQL questions are not backfilled automatically.