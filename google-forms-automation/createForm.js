/**
 * Creates a Google Form with questions to clarify BRCA & Colon Test Project Direction
 *
 * This script will:
 * 1. Create a new Google Form
 * 2. Add all questions from the requirements document
 * 3. Set up proper question types (multiple choice, checkboxes, text)
 * 4. Return the form URL for sharing with the client
 */

function createBRCAProjectQuestionnaireForm() {
  // Create a new form
  const form = FormApp.create('BRCA & Colon Test Project - Client Questionnaire');

  // Set form description
  form.setDescription(
    'Thank you for taking the time to answer these questions! Your responses will help us build exactly what you need. ' +
    'Please answer as many questions as possible - this will ensure we create the right solution for your business.'
  );

  // Set to collect email addresses
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(false);

  // Configure confirmation message
  form.setConfirmationMessage(
    'Thank you! We\'ve received your responses and will create a customized plan based on your answers.'
  );

  // Add all questions
  addAllQuestions(form);

  // Get the form URL
  const formUrl = form.getPublishedUrl();
  const editUrl = form.getEditUrl();

  // Log the URLs
  Logger.log('Form created successfully!');
  Logger.log('Published URL (share with client): ' + formUrl);
  Logger.log('Edit URL (for you): ' + editUrl);

  return {
    formUrl: formUrl,
    editUrl: editUrl,
    formId: form.getId()
  };
}

/**
 * Helper function to add all questions to a form
 */
function addAllQuestions(form) {
  // ===== SECTION 1: APPLICATION PURPOSE & SCOPE =====
  form.addSectionHeaderItem()
    .setTitle('1. APPLICATION PURPOSE & SCOPE')
    .setHelpText('Let\'s understand what you want to build and who will use it.');

  // Q1: Application purpose
  form.addMultipleChoiceItem()
    .setTitle('Q1: Is this BRCA tool meant to be:')
    .setChoiceValues([
      'A) A simple demo/marketing tool that prospects can use immediately (like a calculator on your website)',
      'B) A full SaaS product that clients will use for actual patient evaluations after they sign up',
      'C) An internal tool for MedMinds staff to evaluate patients for your clients'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q2: Primary user
  form.addMultipleChoiceItem()
    .setTitle('Q2: Who is the PRIMARY user?')
    .setChoiceValues([
      'Healthcare providers (doctors, genetic counselors)',
      'Insurance pre-authorization staff',
      'Patients themselves',
      'MedMinds employees only'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== SECTION 2: AUTHENTICATION & USER MANAGEMENT =====
  form.addSectionHeaderItem()
    .setTitle('2. AUTHENTICATION & USER MANAGEMENT')
    .setHelpText('Do users need to log in? What roles do we need?');

  // Q3: Login requirement
  form.addMultipleChoiceItem()
    .setTitle('Q3: Do users NEED to log in to use this tool?')
    .setChoiceValues([
      'YES - We want to capture leads (email, contact info)',
      'NO - Should be completely anonymous and instant',
      'OPTIONAL - Can use without login, but login unlocks extra features (like saving history)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q4: Role-based access
  form.addMultipleChoiceItem()
    .setTitle('Q4: If login is required, do you need TWO roles (admin + visitor)?')
    .setChoiceValues([
      'YES - Admins manage policies, visitors use the tool',
      'NO - Everyone just uses the tool (no admin portal needed)',
      'Not sure / Depends on Q5 answer'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== SECTION 3: POLICY/CRITERIA MANAGEMENT =====
  form.addSectionHeaderItem()
    .setTitle('3. POLICY/CRITERIA MANAGEMENT')
    .setHelpText('How often do criteria change and who maintains them?');

  // Q5: Update frequency
  form.addMultipleChoiceItem()
    .setTitle('Q5: How often do insurance payer BRCA criteria change?')
    .setChoiceValues([
      'Monthly (need easy updates)',
      'Quarterly (can handle manual code updates)',
      'Rarely (once or twice a year)',
      'Not sure'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q6: Maintenance responsibility
  form.addMultipleChoiceItem()
    .setTitle('Q6: Who will maintain the BRCA criteria when they change?')
    .setChoiceValues([
      'Option A: Developers (requires code deployment each time)',
      'Option B: MedMinds staff via admin portal (no developer needed)',
      'Option C: Automated AI extraction from PDFs (this plan\'s approach)',
      'Not sure yet'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q7: PDF processing need
  form.addMultipleChoiceItem()
    .setTitle('Q7: Do you actually have insurance policy PDFs that need to be processed?')
    .setChoiceValues([
      'YES - We have dozens of PDFs and need AI to extract criteria',
      'NO - We already know the criteria and can enter them manually',
      'SOME - We have a few PDFs but manual entry is fine',
      'Not applicable / Don\'t have PDFs'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== SECTION 4: DATA STORAGE & PRIVACY =====
  form.addSectionHeaderItem()
    .setTitle('4. DATA STORAGE & PRIVACY')
    .setHelpText('How should we handle patient data and visitor information?');

  // Q8: Data storage
  form.addMultipleChoiceItem()
    .setTitle('Q8: Should patient submissions be stored in a database?')
    .setChoiceValues([
      'YES - Store forever (for analytics, reporting)',
      'YES - Store temporarily (30 days, then auto-delete)',
      'NO - Never store (evaluate and show results, then discard immediately)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q9: Visitor tracking
  form.addCheckboxItem()
    .setTitle('Q9: What data do you want to track about visitors? (Check all that apply)')
    .setChoiceValues([
      'Nothing (completely anonymous)',
      'Just basic analytics (which state, which payer accessed most)',
      'Full submissions (patient data + results) for follow-up',
      'Contact info (email, phone) for sales leads'
    ])
    .setRequired(true);

  // ===== SECTION 5: DEPLOYMENT & SCALE =====
  form.addSectionHeaderItem()
    .setTitle('5. DEPLOYMENT & SCALE')
    .setHelpText('Expected traffic and budget constraints.');

  // Q10: Traffic volume
  form.addMultipleChoiceItem()
    .setTitle('Q10: Expected traffic volume?')
    .setChoiceValues([
      'Low: 10-50 visitors/day (demo tool on your website)',
      'Medium: 100-500 visitors/day (actively marketed tool)',
      'High: 1,000+ visitors/day (production medical tool)',
      'Not sure yet'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q11: Budget
  form.addMultipleChoiceItem()
    .setTitle('Q11: How much are you willing to spend per month on hosting and cloud services for this application?')
    .setHelpText('This covers costs like website hosting, database storage, AI services, and server usage. Think of it like a monthly subscription fee to keep the app running.')
    .setChoiceValues([
      '$0/month - Keep it completely free (we\'ll use only free tier services)',
      'Up to $25/month - Small budget for basic cloud services',
      'Up to $50/month - Moderate budget for better performance and features',
      'Up to $100/month - Good budget for production-ready application',
      '$100+/month - No budget concerns, prioritize quality and performance',
      'Not sure - Help me understand what I need'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== SECTION 6: FEATURES & COMPLEXITY =====
  form.addSectionHeaderItem()
    .setTitle('6. FEATURES & COMPLEXITY')
    .setHelpText('What features are essential vs nice-to-have?');

  // Q12: State-specific policies
  form.addMultipleChoiceItem()
    .setTitle('Q12: Should the tool support STATE-SPECIFIC policies?')
    .setChoiceValues([
      'YES - Critical (California rules differ from Texas, etc.)',
      'NO - Same rules nationwide (simpler approach)',
      'Not sure / Need clarification'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q13: Admin portal
  form.addMultipleChoiceItem()
    .setTitle('Q13: Do you want an ADMIN PORTAL for managing policies?')
    .setChoiceValues([
      'YES - Essential (non-technical staff need to update criteria)',
      'NO - Not needed (developers can update via code)',
      'MAYBE - Later phase (not for initial launch)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q14: Visitor features
  form.addCheckboxItem()
    .setTitle('Q14: Should visitors be able to: (Check all that apply)')
    .setChoiceValues([
      'Save their evaluation history',
      'Export results as PDF',
      'Share results with doctors/insurance',
      'Compare multiple payers side-by-side',
      'None of these features needed'
    ])
    .setRequired(true);

  // ===== SECTION 7: INTEGRATION =====
  form.addSectionHeaderItem()
    .setTitle('7. INTEGRATION WITH OTHER MEDMINDS PRODUCTS')
    .setHelpText('Does this need to connect with existing systems?');

  // Q15: Integration needs
  form.addCheckboxItem()
    .setTitle('Q15: Does this BRCA tool need to integrate with: (Check all that apply)')
    .setChoiceValues([
      'Your main MedMinds website (for navigation, branding)',
      'Any existing MedMinds backend/database',
      'Other MedMinds demo tools',
      'CRM system for lead capture',
      'None - Standalone application'
    ])
    .setRequired(true);

  // ===== SECTION 8: TIMELINE & PRIORITY =====
  form.addSectionHeaderItem()
    .setTitle('8. TIMELINE & PRIORITY')
    .setHelpText('When do you need this and what\'s the minimum viable product?');

  // Q16: Timeline
  form.addMultipleChoiceItem()
    .setTitle('Q16: When do you need this completed?')
    .setChoiceValues([
      'ASAP (within 1-2 weeks)',
      'Flexible (4-6 weeks is fine)',
      'No rush (can take months)'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // Q17: MVP
  form.addMultipleChoiceItem()
    .setTitle('Q17: What\'s the MINIMUM VIABLE PRODUCT (MVP)?')
    .setChoiceValues([
      'Just the patient form + evaluation results (no login, no database)',
      'Login + form + results + lead capture',
      'Full system with admin portal + AI PDF processing',
      'Not sure - help me decide'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== FINAL SECTION: ADDITIONAL COMMENTS =====
  form.addSectionHeaderItem()
    .setTitle('ADDITIONAL COMMENTS')
    .setHelpText('Any other information that would help us build the right solution?');

  form.addParagraphTextItem()
    .setTitle('Any additional comments, concerns, or requirements we should know about?')
    .setRequired(false);
}

/**
 * Helper function to get the form details after creation
 */
function getFormDetails() {
  const result = createBRCAProjectQuestionnaireForm();

  // Create a summary document
  const summary = `
BRCA Project Questionnaire Form Created
========================================

✅ Form has been created successfully!

📋 Share this URL with your client:
${result.formUrl}

✏️ Edit the form here (keep this private):
${result.editUrl}

📊 To view responses:
1. Go to the edit URL above
2. Click "Responses" tab
3. View in Google Sheets or summary view

Form ID: ${result.formId}
Created: ${new Date().toLocaleString()}
`;

  Logger.log(summary);
  return summary;
}

/**
 * Update an existing Google Form
 * Use this to modify questions in your existing form without creating a new one
 */
function updateExistingForm() {
  const FORM_ID = '1OcZEJ_YSzr2eq2Lnx0RkL55g0FR7E2jJjv0akS9eGfo'; // Your existing form ID
  
  try {
    const form = FormApp.openById(FORM_ID);
    
    Logger.log('Updating form: ' + form.getTitle());
    
    // Get all items
    const items = form.getItems();
    
    // Example: Update the description
    form.setDescription(
      'Thank you for taking the time to answer these questions! Your responses will help us build exactly what you need. ' +
      'Please answer as many questions as possible - this will ensure we create the right solution for your business.\n\n' +
      '⏱️ Estimated time: 10-15 minutes'
    );
    
    // Example: Find and update a specific question
    // Uncomment and modify as needed:
    /*
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = item.getTitle();
      
      if (title.includes('Q1:')) {
        const mcItem = item.asMultipleChoiceItem();
        mcItem.setTitle('Q1: UPDATED - Is this BRCA tool meant to be:');
        // Update choices if needed
        // mcItem.setChoiceValues(['New Option 1', 'New Option 2']);
      }
    }
    */
    
    Logger.log('✅ Form updated successfully!');
    Logger.log('Edit URL: ' + form.getEditUrl());
    Logger.log('Published URL: ' + form.getPublishedUrl());
    
    return {
      success: true,
      editUrl: form.getEditUrl(),
      publishedUrl: form.getPublishedUrl()
    };
    
  } catch (error) {
    Logger.log('❌ Error updating form: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete all questions from the form (useful for complete rebuild)
 */
function clearAllQuestions() {
  const FORM_ID = '1OcZEJ_YSzr2eq2Lnx0RkL55g0FR7E2jJjv0akS9eGfo';
  
  const form = FormApp.openById(FORM_ID);
  const items = form.getItems();
  
  Logger.log('Deleting ' + items.length + ' items...');
  
  for (let i = items.length - 1; i >= 0; i--) {
    form.deleteItem(i);
  }
  
  Logger.log('✅ All questions deleted. Form is now empty.');
  return form.getEditUrl();
}

/**
 * Rebuild the existing form with all updated questions
 * This keeps your existing form URLs but replaces all questions
 */
function rebuildExistingForm() {
  const FORM_ID = '1OcZEJ_YSzr2eq2Lnx0RkL55g0FR7E2jJjv0akS9eGfo';
  
  try {
    const form = FormApp.openById(FORM_ID);
    
    Logger.log('🔄 Rebuilding form: ' + form.getTitle());
    
    // Step 1: Delete all existing items
    const items = form.getItems();
    Logger.log('Deleting ' + items.length + ' existing items...');
    for (let i = items.length - 1; i >= 0; i--) {
      form.deleteItem(i);
    }
    
    // Step 2: Update form settings
    form.setDescription(
      'Thank you for taking the time to answer these questions! Your responses will help us build exactly what you need. ' +
      'Please answer as many questions as possible - this will ensure we create the right solution for your business.'
    );
    
    form.setCollectEmail(true);
    form.setLimitOneResponsePerUser(false);
    form.setConfirmationMessage(
      'Thank you! We\'ve received your responses and will create a customized plan based on your answers.'
    );
    
    // Step 3: Add all questions (copy from createBRCAProjectQuestionnaireForm)
    Logger.log('Adding questions...');
    addAllQuestions(form);
    
    Logger.log('✅ Form rebuilt successfully!');
    Logger.log('Published URL: ' + form.getPublishedUrl());
    Logger.log('Edit URL: ' + form.getEditUrl());
    
    return {
      success: true,
      publishedUrl: form.getPublishedUrl(),
      editUrl: form.getEditUrl()
    };
    
  } catch (error) {
    Logger.log('❌ Error rebuilding form: ' + error.message);
    Logger.log('Stack trace: ' + error.stack);
    throw error;
  }
}
