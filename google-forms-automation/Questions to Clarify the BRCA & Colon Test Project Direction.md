## **QUESTIONS TO CLARIFY THE BRCA & COLON TEST PROJECT DIRECTION**

### **1. APPLICATION PURPOSE & SCOPE**

**Q1:** Is this BRCA tool meant to be:
- **A)** A simple demo/marketing tool that prospects can use immediately (like a calculator on your website)
- **B)** A full SaaS product that clients will use for actual patient evaluations after they sign up
- **C)** An internal tool for MedMinds staff to evaluate patients for your clients
- **Other:** _(please specify)_

**Q2:** Who is the PRIMARY user?
- Healthcare providers (doctors, genetic counselors)
- Insurance pre-authorization staff
- Patients themselves
- MedMinds employees only
- **Other:** _(please specify)_

---

### **2. AUTHENTICATION & USER MANAGEMENT**

**Q3:** Do users NEED to log in to use this tool?
- **YES** - We want to capture leads (email, contact info)
- **NO** - Should be completely anonymous and instant
- **OPTIONAL** - Can use without login, but login unlocks extra features (like saving history)
- **Other:** _(please specify)_

**Q4:** If login is required, do you need TWO roles (admin + visitor)?
- **YES** - Admins manage policies, visitors use the tool
- **NO** - Everyone just uses the tool (no admin portal needed)
- Not sure / Depends on Q3 answer
- **Other:** _(please specify)_

---

### **3. POLICY/CRITERIA MANAGEMENT**

**Q5:** How often do insurance payer BRCA criteria change?
- Monthly (need easy updates)
- Quarterly (can handle manual code updates)
- Rarely (once or twice a year)
- Not sure
- **Other:** _(please specify)_

**Q6:** Who will maintain the BRCA criteria when they change?
- **Option A:** Developers (requires code deployment each time)
- **Option B:** MedMinds staff via admin portal (no developer needed)
- **Option C:** Automated AI extraction from PDFs (this plan's approach)
- Not sure yet
- **Other:** _(please specify)_

**Q7:** Do you actually have insurance policy PDFs that need to be processed?
- YES - We have dozens of PDFs and need AI to extract criteria
- NO - We already know the criteria and can enter them manually
- SOME - We have a few PDFs but manual entry is fine
- Not applicable / Don't have PDFs
- **Other:** _(please specify)_

---

### **4. DATA STORAGE & PRIVACY**

**Q8:** Should patient submissions be stored in a database?
- **YES - Store forever** (for analytics, reporting)
- **YES - Store temporarily** (30 days, then auto-delete)
- **NO - Never store** (evaluate and show results, then discard immediately)
- **Other:** _(please specify)_

**Q9:** What data do you want to track about visitors? _(Check all that apply)_
- Nothing (completely anonymous)
- Just basic analytics (which state, which payer accessed most)
- Full submissions (patient data + results) for follow-up
- Contact info (email, phone) for sales leads

---

### **5. DEPLOYMENT & SCALE**

**Q10:** Expected traffic volume?
- **Low:** 10-50 visitors/day (demo tool on your website)
- **Medium:** 100-500 visitors/day (actively marketed tool)
- **High:** 1,000+ visitors/day (production medical tool)
- Not sure yet
- **Other:** _(please specify)_

**Q11:** How much are you willing to spend per month on hosting and cloud services for this application?

_This covers costs like website hosting, database storage, AI services, and server usage. Think of it like a monthly subscription fee to keep the app running._

- $0/month - Keep it completely free (we'll use only free tier services)
- Up to $25/month - Small budget for basic cloud services
- Up to $50/month - Moderate budget for better performance and features
- Up to $100/month - Good budget for production-ready application
- $100+/month - No budget concerns, prioritize quality and performance
- Not sure - Help me understand what I need
- **Other:** _(please specify)_

---

### **6. FEATURES & COMPLEXITY**

**Q12:** Should the tool support STATE-SPECIFIC policies?
- **YES - Critical** (California rules differ from Texas, etc.)
- **NO - Same rules nationwide** (simpler approach)
- Not sure / Need clarification
- **Other:** _(please specify)_

**Q13:** Do you want an ADMIN PORTAL for managing policies?
- **YES - Essential** (non-technical staff need to update criteria)
- **NO - Not needed** (developers can update via code)
- **MAYBE - Later phase** (not for initial launch)
- **Other:** _(please specify)_

**Q14:** Should visitors be able to: _(Check all that apply)_
- Save their evaluation history
- Export results as PDF
- Share results with doctors/insurance
- Compare multiple payers side-by-side
- None of these features needed

---

### **7. INTEGRATION WITH OTHER MEDMINDS PRODUCTS**

**Q15:** Does this BRCA tool need to integrate with: _(Check all that apply)_
- Your main MedMinds website (for navigation, branding)
- Any existing MedMinds backend/database
- Other MedMinds demo tools
- CRM system for lead capture
- None - Standalone application

---

### **8. TIMELINE & PRIORITY**

**Q16:** When do you need this completed?
- ASAP (within 1-2 weeks)
- Flexible (4-6 weeks is fine)
- No rush (can take months)

**Q21:** What's the MINIMUM VIABLE PRODUCT (MVP)?
- Just the patient form + evaluation results (no login, no database)
- Login + form + results + lead capture
- Full system with admin portal + AI PDF processing

---

### **10. TECHNICAL PREFERENCES**

**Q22:** Do you have preferences on:
- Continuing with React + TypeScript (current stack)?
- Using Firebase specifically (or open to alternatives)?
- AI processing (Gemini vs manual entry)?

**Q23:** Development team:
- You're building this yourself
- You have a team of developers
- You'll hire contractors/freelancers

---

## **PLEASE ANSWER THESE QUESTIONS**

You can respond in this format:
```
Q1: A (simple demo tool)
Q2: Healthcare providers
Q3: YES - We want to capture leads
...
```

Or just answer narratively - I'll adapt the plan based on your responses.

**Once I have these answers, I'll create a REVISED, REALISTIC plan that fits your actual needs rather than over-engineering.**

---

## **SUMMARY OF CHANGES**

This questionnaire has been streamlined from 23 questions to **17 questions** across **8 sections**:

**Removed:**
- Section 2: Current Application Status (Q3-Q4) - Will be decided based on client answers
- Q12: Hosting/deployment location - Developers will decide
- Q19: Branding/design consistency - Will maintain brand consistency
- Section 9: Technical Preferences (Q22-Q23) - Developers will decide

**Enhanced:**
- Q11: More detailed budget question with clear explanations for non-technical users
- All multiple choice questions now have "Other" option for custom responses