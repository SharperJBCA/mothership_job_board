# Job brief markdown files

Create one markdown file per job slug:

- `briefs/<slug>.md`

Example: if job slug is `escort-convoy`, the app loads `briefs/escort-convoy.md` on the job detail page.

If no markdown file exists, the app falls back to the `brief` value stored in the database.
