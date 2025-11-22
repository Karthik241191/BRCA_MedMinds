# BRCA Project Questionnaire - Google Form Automation

This folder contains the Apps Script code to automatically generate a Google Form with all the clarification questions for the BRCA project.

## Prerequisites

1. Node.js and npm installed
2. Google account with access to Google Drive/Forms
3. clasp (Google Apps Script CLI) - already installed locally in this project

## Setup Instructions

### Step 1: Enable Google Apps Script API

1. Go to https://script.google.com/home/usersettings
2. Turn ON "Google Apps Script API"

### Step 2: Login to clasp

```bash
cd google-forms-automation
npx clasp login
```

This will open a browser window. Sign in with your Google account and authorize clasp.

### Step 3: Create a new Apps Script project

```bash
npx clasp create --title "BRCA Questionnaire Form Generator" --type standalone
```

This will:
- Create a new Apps Script project in your Google Drive
- Update `.clasp.json` with the script ID
- Show you the script URL

### Step 4: Push the code to Google Apps Script

```bash
npx clasp push
```

This uploads `createForm.js` to your Apps Script project.

### Step 5: Run the script to create the form

Option A - Via Web Interface (Recommended):
1. Run: `npx clasp open`
2. This opens the Apps Script editor in your browser
3. Select function: `getFormDetails`
4. Click "Run" (▶️)
5. Authorize the script when prompted
6. Check "Execution log" for the form URLs

Option B - Via Command Line:
```bash
npx clasp run getFormDetails
```

### Step 6: Get the form URLs

After running the script, you'll see output like:

```
Published URL (share with client): https://docs.google.com/forms/d/abc123.../viewform
Edit URL (for you): https://docs.google.com/forms/d/abc123.../edit
```

**Share the Published URL with your client!**

## What the Script Does

The script creates a comprehensive Google Form with:

- **23 questions** organized into 10 sections
- Multiple choice, checkbox, and text response questions
- Required vs optional questions
- Email collection enabled
- Custom confirmation message
- All questions from the `Questions to Clarify the BRCA & Colon Test Project Direction.md` document

## Viewing Responses

1. Go to the Edit URL
2. Click the "Responses" tab
3. View individual responses or create a Google Sheet with all responses
4. Export to Excel if needed

## Troubleshooting

**Error: "User has not enabled the Google Apps Script API"**
- Solution: Go to https://script.google.com/home/usersettings and enable the API

**Error: "Authorization required"**
- Solution: Run `npx clasp login` again

**Script not appearing in Apps Script editor**
- Solution: Run `npx clasp push --force`

**Need to update the form?**
1. Edit `createForm.js`
2. Run `npx clasp push`
3. Run the script again (it will create a new form)

## Files

- `createForm.js` - Main script that creates the Google Form
- `appsscript.json` - Apps Script project manifest
- `.clasp.json` - Clasp configuration (contains your script ID)
- `README.md` - This file

## Next Steps After Client Responds

1. Collect responses from the Google Form
2. Review the answers
3. Update the `TECHNICAL_PLAN.md` based on client feedback
4. Create a revised implementation plan that matches their actual needs
5. Get final approval before starting development

---

**Created:** 2025-11-22
**For:** MedMinds BRCA Project
