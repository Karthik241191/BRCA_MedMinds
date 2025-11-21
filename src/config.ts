// Configuration for Google Sheets Integration
// After deploying your Google Apps Script, replace the URL below with your Web App URL

export const config = {
  // Google Apps Script Web App URL
  // Get this from: Extensions > Apps Script > Deploy > New deployment > Web app
  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbyj05fAaFdEgMDT31qx8zry2Nn00RaTeQxBgiXjcF66zlQ5UY-bHTiubRiN9WhQfuwp/exec",

  // Form configuration
  form: {
    // Fields marked as required
    requiredFields: ["firstName", "lastName", "email"],

    // Success message display duration (milliseconds)
    successMessageDuration: 5000,
  },
};

export default config;
