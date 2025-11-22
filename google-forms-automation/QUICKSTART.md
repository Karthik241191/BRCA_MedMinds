# Quick Start Guide - Create Google Form in 3 Steps

## Step 1: Enable Google Apps Script API

Visit this link and turn ON the API:
👉 https://script.google.com/home/usersettings

## Step 2: Run These Commands

```bash
cd google-forms-automation

# Login to Google
npx clasp login

# Create project
npx clasp create --title "BRCA Questionnaire" --type standalone

# Upload the form creation script
npx clasp push

# Open in browser to run
npx clasp open
```

## Step 3: Run the Script

In the browser that opens:

1. In the dropdown next to "Debug", select **`getFormDetails`**
2. Click **Run** (▶️ button)
3. Click **Review permissions** when prompted
4. Choose your Google account
5. Click **Advanced** → **Go to BRCA Questionnaire (unsafe)** → **Allow**
6. Check the **Execution log** at the bottom

You'll see output like:

```
Published URL (share with client): https://docs.google.com/forms/d/...
Edit URL (for you): https://docs.google.com/forms/d/...
```

## Done!

✅ Copy the **Published URL** and share it with your client
✅ Keep the **Edit URL** for yourself to view responses

---

## Alternative: Manual Creation (No Code)

If you prefer not to use Apps Script, I can also provide you with:

1. **Option A:** A step-by-step guide to manually create the form in Google Forms UI
2. **Option B:** A CSV/spreadsheet you can import into Google Forms
3. **Option C:** A Typeform/JotForm template

Let me know which you prefer!
