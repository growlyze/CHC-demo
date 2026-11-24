# CHC Payroll Dashboard (demo)

Next.js frontend for the CHC payroll automation. It talks only to the n8n
workflow **"CHC Payroll Demo - 10. Dashboard API"**, which reads and writes the
"CHC Payroll Demo - Tracker & Config" Google Sheet and runs "2. Run Payroll".

## Screens
- **Review queue**: flagged timesheet lines, original scan beside the AI-read values, corrections, Approve / Reject.
- **Payroll run**: pick the period, run payroll (~30 s), download the ADP, contractor and QuickBooks CSVs, see the tracker and invoice checks.

## Deploy to Vercel
1. Create a new GitHub repository and upload these files (everything in this folder).
2. In Vercel: Add New -> Project -> import the repository. Framework is detected as Next.js.
3. Add these Environment Variables:
   - `N8N_WEBHOOK_BASE` = `https://n8n.srv1268571.hstgr.cloud/webhook`
   - `N8N_API_KEY` = the key set in the Dashboard API workflow (see `.env.example`)
   - `DASHBOARD_PASSWORD` = any password (turns on a browser password prompt; leave empty to disable)
4. Click Deploy.

The Run Payroll call can take up to 60 seconds, so use Vercel Pro (Hobby is for non-commercial use anyway).

Alternative without GitHub: run `npx vercel` in this folder and add the same variables when asked.

## Run locally
```
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## How it connects
Browser -> Next.js API routes (`app/api/*`, server side, holds the key) -> n8n webhooks:
- `GET  chc-dashboard/data`         sheet data and output files
- `POST chc-dashboard/review`       approve / reject a line, with corrections
- `POST chc-dashboard/run-payroll`  runs "2. Run Payroll" for a period
- `GET  chc-dashboard/file?id=`     streams a Drive file (scan or CSV)

Requests to n8n carry the header `x-chc-key`; n8n ignores calls without it.
To change the key, update it in all four webhook nodes and in `N8N_API_KEY`.
