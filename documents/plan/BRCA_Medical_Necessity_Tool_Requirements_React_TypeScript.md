# BRCA Medical-Necessity Tool Requirements
## React + TypeScript Implementation

---

## 1. Overview

### 1.1 Purpose
A web-based application to evaluate patient eligibility for BRCA genetic testing based on medical necessity criteria from multiple insurance payers. The tool provides real-time determination of coverage likelihood and generates documentation for prior authorization.

### 1.2 Technology Stack
- **Frontend Framework**: React 18+
- **Language**: TypeScript 5+
- **Build Tool**: Vite or Create React App
- **Styling**: CSS Modules / Styled Components / Tailwind CSS
- **State Management**: React Context API / Zustand / Redux Toolkit
- **Form Management**: React Hook Form with Zod validation
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

---

## 2. Functional Requirements

### 2.1 Patient Information Collection

#### 2.1.1 Basic Patient Data
**Component**: `PatientInfoForm`

**Required Fields** (TypeScript interfaces):
```typescript
interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  memberId: string;
  payer: PayerType;
}

type PayerType = 'UHC' | 'Evicore' | 'BCBS' | 'Aetna' | 'Regence' | 'Carelon';
```

**Validation Requirements**:
- All fields required
- Date of birth must be valid date in the past
- Member ID format validation per payer requirements
- Real-time validation feedback

#### 2.1.2 Personal Cancer History
**Component**: `PersonalCancerHistory`

**Data Structure**:
```typescript
interface PersonalHistory {
  hasPersonalHistory: boolean;
  cancerTypes: CancerType[];
  ageAtDiagnosis?: number;
  isAshkenaziJewish: boolean;
}

type CancerType =
  | 'breast'
  | 'ovarian'
  | 'pancreatic'
  | 'prostate'
  | 'melanoma'
  | 'colorectal'
  | 'endometrial'
  | 'other';

interface CancerDetails {
  type: CancerType;
  ageAtDiagnosis: number;
  isTripleNegative?: boolean; // For breast cancer
  isMetastatic?: boolean;
  additionalDetails?: string;
}
```

**Features**:
- Dynamic form based on cancer type selection
- Conditional fields (e.g., triple-negative status for breast cancer)
- Multiple cancer diagnoses support
- Age validation (must be <= current age)

#### 2.1.3 Family Cancer History
**Component**: `FamilyHistoryManager`

**Data Structure**:
```typescript
interface FamilyMember {
  id: string;
  relationship: RelationType;
  side: 'maternal' | 'paternal' | 'both';
  cancerHistory: CancerDetails[];
  isAlive: boolean;
  currentAge?: number;
  ageAtDeath?: number;
  hasTestedForBRCA?: boolean;
  brcaStatus?: 'positive' | 'negative' | 'vus';
}

type RelationType =
  | 'mother'
  | 'father'
  | 'sister'
  | 'brother'
  | 'daughter'
  | 'son'
  | 'maternal_grandmother'
  | 'maternal_grandfather'
  | 'paternal_grandmother'
  | 'paternal_grandfather'
  | 'maternal_aunt'
  | 'maternal_uncle'
  | 'paternal_aunt'
  | 'paternal_uncle'
  | 'cousin';
```

**Features**:
- Dynamic family member addition/removal
- Family tree visualization (optional enhancement)
- Degree of relation calculation
- Maternal vs. paternal lineage tracking
- Real-time criteria evaluation as family members added

---

### 2.2 Payer-Specific Criteria Evaluation

#### 2.2.1 Criteria Engine
**Component**: `CriteriaEngine` (Service/Hook)

**Core Logic**:
```typescript
interface CriteriaRule {
  id: string;
  payer: PayerType;
  description: string;
  evaluate: (data: PatientData) => boolean;
  weight: number;
  category: 'personal' | 'family' | 'ancestry' | 'other';
}

interface EvaluationResult {
  payer: PayerType;
  verdict: 'approved' | 'likely_approved' | 'requires_review' | 'denied';
  matchedCriteria: CriteriaRule[];
  unmatchedCriteria: CriteriaRule[];
  confidence: number;
  documentation: string[];
}
```

**Payer-Specific Rules** (from existing implementation):

##### UHC (UnitedHealthcare)
- Personal history of breast cancer diagnosed ≤ 45 years
- Personal history of ovarian, pancreatic, or metastatic prostate cancer
- First-degree relative with breast cancer ≤ 45 years
- Two or more relatives with breast, ovarian, or pancreatic cancer
- Ashkenazi Jewish ancestry with relevant cancer history

##### Evicore
- Personal diagnosis of breast cancer ≤ 50 years
- Personal ovarian/fallopian tube cancer at any age
- Male breast cancer
- Triple-negative breast cancer ≤ 60 years
- Known BRCA mutation in family
- ≥3 breast cancers in close relatives (same lineage)

##### BCBS (Blue Cross Blue Shield)
- Personal breast cancer ≤ 50 years
- Bilateral breast cancer
- Personal ovarian/pancreatic cancer
- Two first-degree relatives with breast/ovarian cancer
- Known pathogenic variant in family

##### Aetna
- Personal breast cancer ≤ 45 years or triple-negative ≤ 60 years
- Ovarian/pancreatic cancer (any age)
- Male breast cancer
- ≥2 blood relatives with BRCA-related cancers
- Ashkenazi Jewish with breast cancer ≤ 50 years

##### Regence
- Personal breast cancer ≤ 46 years
- Personal ovarian/pancreatic/metastatic prostate cancer
- First/second-degree relative with ovarian/pancreatic cancer
- Two relatives with breast cancer (one ≤ 50 years)

##### Carelon
- Personal breast cancer ≤ 50 years
- Triple-negative breast cancer ≤ 60 years
- Ovarian/pancreatic cancer
- Male breast cancer
- Known BRCA variant in family
- Multiple family members with relevant cancers

#### 2.2.2 Real-Time Evaluation
**Hook**: `useCriteriaEvaluation`

```typescript
function useCriteriaEvaluation(patientData: PatientData) {
  const [results, setResults] = useState<EvaluationResult[]>([]);

  useEffect(() => {
    // Re-evaluate whenever patient data changes
    const newResults = evaluateAllPayers(patientData);
    setResults(newResults);
  }, [patientData]);

  return results;
}
```

---

### 2.3 Results Display

#### 2.3.1 Verdict Component
**Component**: `VerdictDisplay`

**Features**:
- Color-coded results per payer:
  - Green: Approved
  - Yellow: Likely Approved / Requires Review
  - Red: Denied
- Matched criteria list
- Confidence percentage
- Documentation rationale

#### 2.3.2 Comparison View
**Component**: `PayerComparison`

**Features**:
- Side-by-side payer comparison
- Highlight best coverage option
- Export comparison table

---

### 2.4 Documentation Generation

#### 2.4.1 Prior Authorization Letter
**Component**: `PriorAuthGenerator`

**Output Format**:
```typescript
interface PriorAuthLetter {
  patientInfo: PatientInfo;
  payer: PayerType;
  testingIndication: string;
  clinicalJustification: string[];
  matchedCriteria: string[];
  cptCodes: string[];
  icdCodes: string[];
  generatedDate: Date;
}
```

**Features**:
- Auto-populated based on evaluation results
- Editable template
- PDF export
- Print functionality

#### 2.4.2 Medical Necessity Documentation
**Component**: `MedicalNecessityReport`

**Includes**:
- Complete patient history summary
- Family pedigree (textual or visual)
- All matched criteria with references
- Payer policy citations
- Recommended CPT/ICD codes

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Initial load time: < 2 seconds
- Form interaction latency: < 100ms
- Evaluation calculation: < 500ms
- Smooth 60fps animations

### 3.2 Accessibility (WCAG 2.1 AA)
- Keyboard navigation support
- Screen reader compatible
- ARIA labels and roles
- Sufficient color contrast (4.5:1)
- Focus indicators
- Error announcements

### 3.3 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 3.4 Responsive Design
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Touch-friendly controls

### 3.5 Data Privacy & Security
- No server-side data storage (client-side only)
- No PHI transmission
- Local storage encryption (if used)
- Clear data on session end
- HIPAA compliance considerations

### 3.6 Code Quality
- TypeScript strict mode
- 80%+ test coverage
- ESLint with no errors
- Documented component interfaces
- Storybook component documentation

---

## 4. Technical Architecture

### 4.1 Project Structure
```
brca-tool/
├── src/
│   ├── components/
│   │   ├── PatientInfo/
│   │   │   ├── PatientInfoForm.tsx
│   │   │   ├── PatientInfoForm.test.tsx
│   │   │   └── PatientInfoForm.module.css
│   │   ├── PersonalHistory/
│   │   │   ├── PersonalCancerHistory.tsx
│   │   │   └── CancerTypeSelector.tsx
│   │   ├── FamilyHistory/
│   │   │   ├── FamilyHistoryManager.tsx
│   │   │   ├── FamilyMemberForm.tsx
│   │   │   └── FamilyTree.tsx
│   │   ├── Results/
│   │   │   ├── VerdictDisplay.tsx
│   │   │   ├── PayerComparison.tsx
│   │   │   └── CriteriaList.tsx
│   │   ├── Documentation/
│   │   │   ├── PriorAuthGenerator.tsx
│   │   │   └── MedicalNecessityReport.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── hooks/
│   │   ├── useCriteriaEvaluation.ts
│   │   ├── usePatientData.ts
│   │   └── useFormPersistence.ts
│   ├── services/
│   │   ├── criteriaEngine.ts
│   │   ├── payerRules/
│   │   │   ├── uhc.ts
│   │   │   ├── evicore.ts
│   │   │   ├── bcbs.ts
│   │   │   ├── aetna.ts
│   │   │   ├── regence.ts
│   │   │   └── carelon.ts
│   │   └── documentGenerator.ts
│   ├── types/
│   │   ├── patient.ts
│   │   ├── criteria.ts
│   │   └── payers.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── calculations.ts
│   ├── context/
│   │   └── PatientDataContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 4.2 State Management

**Global State** (Context API):
```typescript
interface AppState {
  patientInfo: PatientInfo | null;
  personalHistory: PersonalHistory | null;
  familyHistory: FamilyMember[];
  selectedPayer: PayerType | null;
  evaluationResults: EvaluationResult[];
}

interface AppActions {
  updatePatientInfo: (info: PatientInfo) => void;
  updatePersonalHistory: (history: PersonalHistory) => void;
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  setSelectedPayer: (payer: PayerType) => void;
  clearAllData: () => void;
}
```

### 4.3 Form Validation

**Using Zod Schemas**:
```typescript
import { z } from 'zod';

const patientInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date().max(new Date(), 'Date must be in the past'),
  memberId: z.string().min(1, 'Member ID is required'),
  payer: z.enum(['UHC', 'Evicore', 'BCBS', 'Aetna', 'Regence', 'Carelon'])
});

type PatientInfoFormData = z.infer<typeof patientInfoSchema>;
```

### 4.4 Component Patterns

- Functional components with hooks
- Custom hooks for business logic
- Compound components for complex UIs
- Controlled components for forms
- Error boundaries for error handling
- Lazy loading for route-based code splitting

---

## 5. User Experience Flow

### 5.1 Multi-Step Form Flow
1. **Welcome Screen**
   - Payer selection
   - Disclaimer/consent

2. **Patient Information**
   - Basic demographics
   - Progress indicator (Step 1 of 4)

3. **Personal Cancer History**
   - Cancer type selection
   - Conditional detailed questions
   - Progress indicator (Step 2 of 4)

4. **Family Cancer History**
   - Add multiple family members
   - Visual progress feedback
   - Progress indicator (Step 3 of 4)

5. **Results & Documentation**
   - Real-time evaluation results
   - Generate documentation
   - Progress indicator (Step 4 of 4)

### 5.2 Navigation
- Stepper component showing current step
- Previous/Next buttons
- Form validation before progression
- Ability to go back and edit
- Save draft functionality (localStorage)

### 5.3 Error Handling
- Inline validation errors
- Toast notifications for system errors
- Graceful degradation
- Clear error messages with recovery actions

---

## 6. Testing Requirements

### 6.1 Unit Tests
- All utility functions
- Criteria evaluation logic
- Form validation rules
- Data transformations

### 6.2 Component Tests
- User interaction flows
- Form submissions
- Conditional rendering
- Accessibility checks

### 6.3 Integration Tests
- Multi-step form completion
- Criteria evaluation accuracy
- Documentation generation
- State persistence

### 6.4 E2E Tests (Optional)
- Complete user journey
- Cross-browser testing
- Responsive design verification

---

## 7. Deployment & DevOps

### 7.1 Build Configuration
- Production build optimization
- Environment variables for configuration
- Source maps for debugging
- Bundle size monitoring

### 7.2 Deployment Options
- Static hosting (Netlify, Vercel, AWS S3)
- CDN integration
- HTTPS enforcement
- Caching strategy

### 7.3 Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics (optional, privacy-compliant)

---

## 8. Future Enhancements

### 8.1 Phase 2 Features
- [ ] Backend API integration for data persistence
- [ ] User authentication and profiles
- [ ] Multi-language support (i18n)
- [ ] Advanced family tree visualization
- [ ] Integration with EMR systems
- [ ] PDF generation with custom branding
- [ ] Historical case tracking
- [ ] Batch processing for multiple patients

### 8.2 Phase 3 Features
- [ ] Machine learning for improved predictions
- [ ] Real-time payer policy updates
- [ ] Collaborative features for care teams
- [ ] Mobile native apps (React Native)
- [ ] Automated faxing to payers
- [ ] Appeal letter generation for denials

---

## 9. Acceptance Criteria

### 9.1 Functional Acceptance
- [ ] All payer criteria accurately implemented
- [ ] Form accepts and validates all required data
- [ ] Evaluation results match expected outcomes for test cases
- [ ] Documentation generates correctly with all data
- [ ] No data loss during navigation

### 9.2 Technical Acceptance
- [ ] TypeScript with no type errors
- [ ] All tests passing with >80% coverage
- [ ] No ESLint errors or warnings
- [ ] Lighthouse score >90 for all metrics
- [ ] Accessibility audit passing (WCAG AA)
- [ ] Works on all supported browsers
- [ ] Responsive on all device sizes

### 9.3 Performance Acceptance
- [ ] Initial load < 2s on 3G connection
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB (gzipped)
- [ ] No console errors in production

---

## 10. Dependencies

### 10.1 Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "react-hook-form": "^7.45.0",
  "zod": "^3.21.0",
  "@hookform/resolvers": "^3.1.0"
}
```

### 10.2 Development Dependencies
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vite": "^4.3.0",
  "eslint": "^8.42.0",
  "prettier": "^2.8.8",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^5.16.5",
  "vitest": "^0.32.0"
}
```

### 10.3 Optional Dependencies
- `react-router-dom` - Multi-page routing
- `zustand` / `redux-toolkit` - State management
- `tailwindcss` - Utility-first CSS
- `styled-components` - CSS-in-JS
- `date-fns` - Date manipulation
- `react-pdf` - PDF generation
- `framer-motion` - Animations

---

## 11. Success Metrics

### 11.1 User Success
- Task completion rate >95%
- Average completion time <10 minutes
- User satisfaction score >4.5/5
- Error rate <2%

### 11.2 Technical Success
- Zero critical bugs in production
- 99.9% uptime
- Page load time <2s for 95th percentile
- No accessibility violations

---

## Appendix A: Test Cases

### Test Case 1: UHC Approval
**Input:**
- Female, age 40
- Personal breast cancer diagnosis at age 43
- Mother with ovarian cancer at age 55

**Expected Output:**
- UHC: Approved (personal history ≤45 years)
- Multiple matched criteria
- High confidence score

### Test Case 2: Multiple Payer Comparison
**Input:**
- Male, age 35
- Personal prostate cancer (metastatic) at age 34
- Father with pancreatic cancer at age 60

**Expected Output:**
- All payers evaluate based on male with metastatic prostate cancer
- Documentation includes both personal and family history

### Test Case 3: Family History Only
**Input:**
- Female, age 30
- No personal cancer history
- Sister with breast cancer at age 32
- Maternal aunt with ovarian cancer at age 48
- Maternal grandmother with breast cancer at age 50

**Expected Output:**
- Evicore: Likely approved (≥3 breast cancers, same lineage)
- Other payers evaluated based on family criteria

---

## Appendix B: Payer Policy References

- **UHC**: Medical Policy 2023.T.145.07
- **Evicore**: BRCA Genetic Testing Guidelines v4.2
- **BCBS**: Technology Evaluation Center Assessment
- **Aetna**: Clinical Policy Bulletin 0140
- **Regence**: Medical Policy 91
- **Carelon**: Oncology Management Program Guidelines

(Note: These are example references; actual implementation should use current policy documents)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-21
**Author**: BRCA Tool Development Team
**Status**: Draft - Ready for Review
