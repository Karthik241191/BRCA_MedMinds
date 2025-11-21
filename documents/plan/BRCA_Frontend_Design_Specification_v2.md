# BRCA Medical-Necessity Tool
## Frontend Design Specification v2.0
### Based on Existing HTML Implementation

---

## Document Purpose
This specification documents the **existing design system** from `brca_web_based_criteria_checker.html` and provides guidance for converting it to React + TypeScript while maintaining visual consistency.

---

## 1. Current Design System (From Existing HTML)

### 1.1 Color Palette (Actual Implementation)

```css
/* CSS Custom Properties (from existing HTML) */
:root {
  --accent: #0b71eb;      /* Primary blue for buttons */
  --muted: #6b7280;       /* Gray for labels and secondary text */
  --card: #ffffff;        /* White for card backgrounds */
  --bg: #f3f4f6;          /* Light gray page background */
}

/* Additional colors used in code */
--success-bg: #e6ffed;
--success-border: #2ecc71;
--success-text: #064c2e;

--error-bg: #fff6f6;
--error-border: #ff6b6b;
--error-text: #7b1d1d;

--pill-bg: #f3f4f6;
--border-gray: #e6e6e6;
--border-light: #efefef;
--table-header-bg: #fbfbfb;
--card-border: #f0f0f0;
```

### 1.2 Typography (Actual Implementation)

```css
/* Font Family */
font-family: Inter, system-ui, 'Segoe UI', Roboto, Arial, sans-serif;

/* Font Sizes */
body: default (16px)
h1: 20px
h3: default (approximately 18px browser default)
label: 13px
input/select: 14px
th, td: 13px
.small: 12px
```

### 1.3 Spacing (Actual Implementation)

```css
/* Container & Layout */
.wrap: max-width 1100px, margin 28px auto, padding 20px
.grid: gap 18px, margin-top 18px
.card: padding 14px

/* Form elements */
label: margin-bottom 6px
input/select: padding 8px
table th/td: padding 8px

/* Buttons */
.btn: padding 8px 12px
.pill: padding 6px 10px

/* Grid spacing */
.payers grid: gap 10px
form grid: gap 10px
```

### 1.4 Border Radius (Actual Implementation)

```css
.card: border-radius 10px
input/select: border-radius 6px
.btn: border-radius 8px
.result: border-radius 8px
.payer-card: border-radius 8px
.pill: border-radius 999px (fully rounded)
```

### 1.5 Shadows (Actual Implementation)

```css
.card: box-shadow 0 6px 20px rgba(16, 24, 40, 0.06)
/* Single subtle shadow used throughout */
```

---

## 2. Layout Structure (Current Implementation)

### 2.1 Application Layout

```
┌────────────────────────────────────────────────────────────┐
│  .wrap (max-width: 1100px, centered)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  header (flex, gap 16px)                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │ h1: BRCA Criteria Checker — Web tool          │  │  │
│  │  │ .small: Runs in your browser. No data sent... │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  .grid (2 columns: 1fr + 420px, gap 18px)           │  │
│  │  ┌─────────────────────┐  ┌────────────────────┐    │  │
│  │  │                      │  │                     │    │  │
│  │  │  LEFT COLUMN         │  │  RIGHT COLUMN       │    │  │
│  │  │  (Patient inputs +   │  │  (Results +         │    │  │
│  │  │   Family history)    │  │   Export)           │    │  │
│  │  │                      │  │                     │    │  │
│  │  └─────────────────────┘  └────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  footer (margin-top 18px, font-size 13px)           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 2.2 Grid System

**Desktop (> 900px):**
- Main grid: `grid-template-columns: 1fr 420px`
- Left column: Dynamic width (flexible)
- Right column: Fixed 420px
- Gap: 18px

**Mobile (≤ 900px):**
- Main grid: `grid-template-columns: 1fr` (single column)
- Payers grid: `grid-template-columns: 1fr 1fr` (2 columns instead of 3)

---

## 3. Component Designs (Actual Implementation)

### 3.1 Cards

**Visual:**
```
┌──────────────────────────────────────────┐
│  h3: Card Title                          │  ← No horizontal rule
│                                           │
│  Card content...                         │
│                                           │
└──────────────────────────────────────────┘
```

**CSS:**
```css
.card {
  background: #ffffff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 6px 20px rgba(16, 24, 40, 0.06);
}
```

**Usage:**
- Patient inputs card
- Family history card
- Result card
- Export/Share card

### 3.2 Patient Input Form

**Actual Layout:**
```
┌────────────────────────────────────────────────────────┐
│  h3: Patient inputs                                    │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ label: Patient name │  │ label: Age (years)  │     │
│  │ input: Jane Doe     │  │ input: 45           │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ label: Sex assigned │  │ label: Ashkenazi    │     │
│  │ select: F           │  │ select: N           │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  [Similar 2-column grid continues...]                  │
│                                                         │
│  strong: Personal cancer history                       │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ label: Personal     │  │ label: Age at       │     │
│  │        breast cancer│  │        breast dx    │     │
│  │ select: Y           │  │ input: 43           │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ────────────────────────────────────────────────      │  ← hr
│                                                         │
│  ┌──────┐ ┌──────┐        ┌──────┐ ┌──────────┐       │
│  │ Add  │ │Clear │   ...  │Eval. │ │Export JSON│       │
│  │ rel. │ │ rels.│        │      │ │          │       │
│  └──────┘ └──────┘        └──────┘ └──────────┘       │
│   ^^^^      ^^^^                      ^^^^              │
│   blue    secondary                  secondary         │
└────────────────────────────────────────────────────────┘
```

**Grid:**
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 10px;
```

**Full-width elements:**
```css
grid-column: 1/3; /* Spans both columns */
```

### 3.3 Form Inputs

#### Text Input
```css
input[type=text], input[type=number], select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  font-size: 14px;
}
```

**No focus states defined in current implementation** (browser default)

#### Select Dropdown
- Same styling as text input
- No custom dropdown arrow in current implementation
- Uses browser default select styling

#### Labels
```css
label {
  display: block;
  font-size: 13px;
  color: #6b7280; /* muted gray */
  margin-bottom: 6px;
}
```

### 3.4 Buttons

#### Primary Button (.btn)
```css
.btn {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  background: #0b71eb; /* blue accent */
  color: #fff;
  border: none;
  cursor: pointer;
}
```

**Used for:**
- Add relative
- Evaluate
- Delete (in table rows)

#### Secondary Button (.btn.secondary)
```css
.btn.secondary {
  background: #f3f4f6; /* light gray */
  color: #111; /* black text */
}
```

**Used for:**
- Clear relatives
- Export JSON
- Delete buttons in some contexts

**Button Layout:**
```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐        ┌──────┐ ┌──────────┐      │
│ │ Add  │ │Clear │  ····  │Eval. │ │Export JSON│      │
│ │ rel. │ │ rels.│        │      │ │          │      │
│ └──────┘ └──────┘        └──────┘ └──────────┘      │
└──────────────────────────────────────────────────────┘

display: flex;
gap: 8px;
align-items: center;
```

**No hover states defined** (browser default)

### 3.5 Family History Table

**Actual Implementation:**
```
┌──────────────────────────────────────────────────────────────────┐
│ Relative  │ Degree │ Side     │ Cancer  │ Age dx │ Affected │   │
├───────────┼────────┼──────────┼─────────┼────────┼──────────┼───┤
│ [input]   │ [sel.] │ [select] │ [sel.]  │ [input]│ [select] │[X]│
│ Mother    │   1    │ Maternal │ Breast  │   48   │    Y     │[X]│
├───────────┼────────┼──────────┼─────────┼────────┼──────────┼───┤
│ Paternal  │   2    │ Paternal │ Ovarian │   60   │    Y     │[X]│
│  aunt     │        │          │         │        │          │   │
└──────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #efefef;
  font-size: 13px;
}

th {
  background: #fbfbfb;
  text-align: left;
}
```

**Table Structure:**
- 7 columns: Relative, Degree, Side, Cancer, Age dx, Affected, Actions
- Inputs directly in table cells (inline editing)
- Delete button in last column
- No row hover effect in current implementation
- No zebra striping

**Dynamic rows:**
- JavaScript adds/removes `<tr>` elements
- Max 40 relatives enforced in JS

### 3.6 Results Display

#### Main Verdict

**Meets Criteria:**
```
┌──────────────────────────────────────────┐
│ MEETS CRITERIA                           │  ← Bold
│ ────────────────────────────────────────│
│ • Personal breast cancer diagnosed at    │
│   age <=50                               │
│ • First-degree relative with ovarian     │
│   cancer                                 │
└──────────────────────────────────────────┘

background: #e6ffed; (light green)
border: 1px solid #2ecc71; (green)
color: #064c2e; (dark green text)
```

**Does Not Meet:**
```
┌──────────────────────────────────────────┐
│ DOES NOT MEET CRITERIA                   │
│ ────────────────────────────────────────│
│ No qualifying personal or family         │
│ criteria met. Consider verifying...      │
└──────────────────────────────────────────┘

background: #fff6f6; (light red)
border: 1px solid #ff6b6b; (red)
color: #7b1d1d; (dark red text)
```

**CSS:**
```css
.result {
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
}

.meets {
  background: #e6ffed;
  border: 1px solid #2ecc71;
  color: #064c2e;
}

.not {
  background: #fff6f6;
  border: 1px solid #ff6b6b;
  color: #7b1d1d;
}
```

#### Pill Badge
```
  Payer verdicts
  ^^^^^^^^^^^^^^

.pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px; /* fully rounded */
  background: #f3f4f6;
  font-weight: 600;
  margin-right: 8px;
}
```

### 3.7 Payer Cards Grid

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   UHC    │  │ Evicore  │  │   BCBS   │          │
│  │          │  │          │  │          │          │
│  │ Verdict: │  │ Verdict: │  │ Verdict: │          │
│  │    Y     │  │    N     │  │    Y     │          │
│  │          │  │          │  │          │          │
│  │ (reason) │  │ (reason) │  │ (reason) │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Aetna   │  │ Regence  │  │ Carelon  │          │
│  │          │  │          │  │          │          │
│  │ Verdict: │  │ Verdict: │  │ Verdict: │          │
│  │    Y     │  │    Y     │  │    Y     │          │
│  │          │  │          │  │          │          │
│  │ (reason) │  │ (reason) │  │ (reason) │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└──────────────────────────────────────────────────────┘
```

**CSS:**
```css
.payers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.payer-card {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

/* Mobile */
@media (max-width: 900px) {
  .payers {
    grid-template-columns: 1fr 1fr; /* 2 columns */
  }
}
```

**Content Structure:**
```html
<strong>UHC</strong>
<div style="margin-top:6px">
  Verdict: <strong>Y</strong>
</div>
<div class="small" style="margin-top:6px">
  Personal breast cancer diagnosed at age <=50, ...
</div>
```

### 3.8 Export Textarea

```
┌────────────────────────────────────────────────────┐
│  h3: Export / Share                                │
│                                                     │
│  .small: You can export the current patient and    │
│          family data as JSON.                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐│
│  │ {                                              ││
│  │   "patient": {                                 ││
│  │     "name": "Jane Doe",                        ││
│  │     ...                                        ││
│  │   }                                            ││
│  │ }                                              ││
│  └───────────────────────────────────────────────┘│
│   ^^^^^ textarea, width 100%, height 120px         │
└────────────────────────────────────────────────────┘
```

**CSS:**
```css
textarea {
  width: 100%;
  height: 120px;
}
/* Uses browser default styling otherwise */
```

---

## 4. Responsive Behavior (Actual Implementation)

### 4.1 Breakpoint

**Single breakpoint:**
```css
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr; /* Single column */
  }
  .payers {
    grid-template-columns: 1fr 1fr; /* 2 columns instead of 3 */
  }
}
```

### 4.2 Mobile Changes

**Layout:**
- Main grid collapses to single column
- Left and right sections stack vertically
- Patient inputs card appears first
- Family history card second
- Results card third
- Export card last

**Payer Cards:**
- 3 columns → 2 columns
- Better fit for narrow screens

**No other responsive changes:**
- Form grid stays 2 columns (may be tight on very small screens)
- Font sizes don't change
- Padding/margins don't adjust
- No hamburger menu or mobile nav

---

## 5. Current User Flow

### 5.1 Initial State

**Pre-loaded data:**
- Sample relative 1: Mother, Degree 1, Maternal, Breast, Age 48, Affected Y
- Sample relative 2: Paternal aunt, Degree 2, Paternal, Ovarian, Age 60, Affected Y

**Empty fields:**
- All patient input fields empty
- Export textarea empty
- Results area empty

### 5.2 User Journey

```
1. User fills patient information
   ↓
2. User adds/edits family members
   - Click "Add relative" → New row appears
   - Fill in relative details in table
   - Click "Delete" → Row removed
   ↓
3. User clicks "Evaluate"
   ↓
4. JavaScript reads all inputs
   ↓
5. Evaluation logic runs (client-side)
   ↓
6. Results appear:
   - Main verdict (meets/doesn't meet)
   - Matched reasons listed
   - 6 payer verdicts shown in grid
   ↓
7. (Optional) User clicks "Export JSON"
   ↓
8. JSON data appears in export textarea
   ↓
9. User can copy JSON, edit data, re-evaluate
```

### 5.3 Interactions

**No auto-evaluation:**
- User must click "Evaluate" button
- No real-time updates as inputs change

**No validation:**
- All fields optional
- No error messages for invalid inputs
- No required field indicators

**No navigation:**
- Single-page application
- No steps or progression
- All inputs visible at once

---

## 6. JavaScript Architecture (Current)

### 6.1 Data Model

**Patient Object:**
```javascript
{
  name: string,
  age: number | null,
  sex: 'F' | 'M',
  ash: 'Y' | 'N',        // Ashkenazi ancestry
  famvar: 'Y' | 'N',     // Familial variant
  gc: 'Y' | 'N',         // Genetic counseling
  breast: 'Y' | 'N',
  breastAge: number | null,
  tnbc: 'Y' | 'N',       // Triple-negative
  multiple: 'Y' | 'N',   // Multiple primary
  ovarian: 'Y' | 'N',
  pancreas: 'Y' | 'N',
  prostate: 'Y' | 'N',
  gleason: number | null,
  prometa: 'Y' | 'N'     // Prostate metastatic
}
```

**Family Array:**
```javascript
[
  {
    name: string,
    degree: 1 | 2 | 3,
    side: 'Maternal' | 'Paternal',
    cancer: 'Breast' | 'Ovarian' | 'Pancreatic' | 'Prostate' | 'Male breast' | 'Other',
    age: number | null,
    affected: boolean
  },
  ...
]
```

### 6.2 Evaluation Logic

**Criteria checked:**

1. **Known familial pathogenic variant** → Auto-meet
2. **Personal history:**
   - Breast cancer ≤50
   - Triple-negative breast cancer
   - Multiple primary breast cancers
   - Male breast cancer
   - Ovarian/fallopian/peritoneal cancer
   - Pancreatic cancer
   - Metastatic prostate (Gleason ≥7)

3. **Family history:**
   - First-degree relative with breast ≤50
   - First/second-degree relative with ovarian
   - First-degree relative with pancreatic
   - Male relative with breast (1st/2nd degree)
   - ≥3 breast/prostate on same side of family
   - Ashkenazi + close relative with BRCA-related cancer

**Verdict logic:**
```javascript
if (reasons.length > 0) {
  verdict = "MEETS CRITERIA"
} else {
  verdict = "DOES NOT MEET CRITERIA"
}
```

**Payer-specific:**
- **UHC, BCBS, Aetna, Regence, Carelon**: Same criteria (if meets any → Y)
- **Evicore**: Requires genetic counseling documented OR familial variant

### 6.3 DOM Manipulation

**Vanilla JavaScript:**
- Direct DOM queries: `document.querySelector()`
- Event listeners: `.addEventListener()`
- Dynamic table rows: `createElement()`, `appendChild()`
- No framework or library
- No state management
- No virtual DOM

---

## 7. Design Gaps & Missing Features

### 7.1 What's NOT in Current Implementation

**Missing UI elements:**
- ❌ Loading states
- ❌ Error states
- ❌ Validation messages
- ❌ Tooltips
- ❌ Help icons
- ❌ Progress indicators
- ❌ Modals/dialogs
- ❌ Toast notifications
- ❌ Hover effects
- ❌ Focus states (custom)
- ❌ Active states (custom)
- ❌ Disabled states

**Missing interactions:**
- ❌ Auto-save
- ❌ Real-time validation
- ❌ Real-time evaluation
- ❌ Edit patient data after evaluation
- ❌ Clear all data
- ❌ Import JSON
- ❌ Print functionality
- ❌ Copy to clipboard buttons
- ❌ Undo/redo

**Missing features:**
- ❌ Multi-step wizard
- ❌ Progress stepper
- ❌ Payer selection (evaluates all 6 payers at once)
- ❌ Detailed payer criteria view
- ❌ Prior authorization letter generation
- ❌ User authentication
- ❌ Data persistence
- ❌ History/audit trail

### 7.2 Accessibility Gaps

**Missing:**
- ❌ ARIA labels
- ❌ Screen reader announcements
- ❌ Keyboard shortcuts
- ❌ Focus management
- ❌ Skip links
- ❌ Error announcements
- ❌ Live regions

**Present:**
- ✅ Semantic HTML (mostly)
- ✅ Form labels associated with inputs
- ✅ Keyboard navigation (browser default)

---

## 8. Migration to React + TypeScript

### 8.1 Component Mapping

**Current HTML sections → React components:**

| HTML Section | React Component |
|--------------|-----------------|
| `.wrap` | `<App />` |
| `header` | `<Header />` |
| `.grid` | `<MainLayout />` |
| Patient inputs card | `<PatientInputForm />` |
| Family history card | `<FamilyHistoryTable />` |
| Result card | `<ResultsDisplay />` |
| Export card | `<ExportPanel />` |
| `footer` | `<Footer />` |

**Subcomponents needed:**
- `<TextInput />` - Reusable text input
- `<SelectInput />` - Reusable select dropdown
- `<Button />` - Primary/secondary buttons
- `<Card />` - Card container
- `<VerdictBadge />` - Meets/doesn't meet result
- `<PayerCard />` - Individual payer verdict
- `<FamilyMemberRow />` - Table row for relative

### 8.2 State Management

**Global state (Context or Zustand):**
```typescript
interface AppState {
  patient: PatientData;
  family: FamilyMember[];
  evaluationResults: EvaluationResults | null;
}
```

**Component state:**
- Form input values (controlled components)
- Table row editing states
- Export textarea content

### 8.3 Styling Approach

**Option 1: CSS Modules (Recommended)**
- Maintain existing CSS structure
- Convert to module imports
- Minimal refactoring

**Option 2: Styled Components**
- Convert CSS to JavaScript
- More React-idiomatic
- Dynamic styling easier

**Option 3: Tailwind CSS**
- Utility-first approach
- Requires significant refactoring
- Fastest development after setup

**Recommendation:** Use **CSS Modules** with same color variables to maintain visual consistency.

### 8.4 Design System Setup

**Create design tokens:**
```typescript
// src/styles/tokens.ts
export const colors = {
  accent: '#0b71eb',
  muted: '#6b7280',
  card: '#ffffff',
  bg: '#f3f4f6',
  successBg: '#e6ffed',
  successBorder: '#2ecc71',
  successText: '#064c2e',
  errorBg: '#fff6f6',
  errorBorder: '#ff6b6b',
  errorText: '#7b1d1d',
};

export const spacing = {
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  '2xl': '18px',
  '3xl': '28px',
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  full: '999px',
};
```

---

## 9. Recommendations for React Version

### 9.1 Keep From Current Design

✅ **Visual consistency:**
- Same color palette
- Same spacing scale
- Same border radius values
- Same card shadow
- Same typography sizes

✅ **Layout structure:**
- Two-column layout (desktop)
- Single column (mobile)
- Same breakpoint (900px)

✅ **Component hierarchy:**
- Patient inputs → Family history → Results → Export
- Logical top-to-bottom flow

### 9.2 Enhance in React Version

🔧 **Add:**
- Form validation with error messages
- Loading states during evaluation
- Hover/focus/active states for better UX
- ARIA labels and accessibility
- Import JSON functionality (not just export)
- Clear all data with confirmation
- Real-time validation feedback
- Better mobile experience (optimize form grid)

🔧 **Improve:**
- Payer selection (choose which payers to evaluate)
- Results display (expandable details per payer)
- Family member input (modal form instead of inline table)
- Export options (copy button, download file)

### 9.3 New Features to Add

**Phase 1 (MVP):**
- Multi-step wizard with progress indicator
- Prior authorization letter generation
- Print functionality
- Better mobile responsiveness

**Phase 2:**
- Admin portal for PDF upload
- Backend integration
- User authentication
- Data persistence

---

## 10. Visual Comparison Table

| Aspect | Current HTML | Proposed React |
|--------|--------------|----------------|
| **Colors** | 4 CSS vars | Same + semantic palette |
| **Typography** | 4 sizes | Same + more scale |
| **Spacing** | Inline values | Design tokens |
| **Layout** | CSS Grid | CSS Grid (same) |
| **Forms** | Inline in table | Modal + inline options |
| **Validation** | None | Real-time + on submit |
| **States** | Default only | Hover/focus/active/disabled |
| **Responsive** | 1 breakpoint | 3-4 breakpoints |
| **A11y** | Basic | WCAG AA compliant |
| **Interactions** | Click only | Keyboard + click + gestures |

---

## 11. Design Checklist for React Implementation

### Phase 1: Visual Parity
- [ ] Implement exact color palette from HTML
- [ ] Match font sizes and weights
- [ ] Match spacing values
- [ ] Match border radius values
- [ ] Match shadow style
- [ ] Maintain two-column layout
- [ ] Maintain mobile responsive behavior

### Phase 2: Enhanced States
- [ ] Add hover states to buttons
- [ ] Add focus states to inputs
- [ ] Add active states to interactive elements
- [ ] Add disabled states
- [ ] Add loading states

### Phase 3: Accessibility
- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add focus management
- [ ] Ensure color contrast compliance
- [ ] Add screen reader support

### Phase 4: New Features
- [ ] Multi-step wizard
- [ ] Form validation
- [ ] Prior auth letter generation
- [ ] Import/export improvements
- [ ] Admin PDF upload portal

---

## Appendix A: Exact CSS from HTML

```css
:root{
  --accent:#0b71eb;
  --muted:#6b7280;
  --card:#ffffff;
  --bg:#f3f4f6
}
body{
  font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;
  background:var(--bg);
  margin:0;
  color:#111
}
.wrap{max-width:1100px;margin:28px auto;padding:20px}
header{display:flex;align-items:center;gap:16px}
h1{margin:0;font-size:20px}
.grid{display:grid;grid-template-columns:1fr 420px;gap:18px;margin-top:18px}
.card{background:var(--card);border-radius:10px;padding:14px;box-shadow:0 6px 20px rgba(16,24,40,0.06)}
label{display:block;font-size:13px;color:var(--muted);margin-bottom:6px}
input[type=text],input[type=number],select{width:100%;padding:8px;border-radius:6px;border:1px solid #e6e6e6;font-size:14px}
table{width:100%;border-collapse:collapse}
th,td{padding:8px;border-bottom:1px solid #efefef;font-size:13px}
th{background:#fbfbfb;text-align:left}
.small{font-size:12px;color:var(--muted)}
.btn{display:inline-block;padding:8px 12px;border-radius:8px;background:var(--accent);color:#fff;border:none;cursor:pointer}
.btn.secondary{background:#f3f4f6;color:#111}
.row-buttons{display:flex;gap:8px}
.result{padding:12px;border-radius:8px;margin-top:12px}
.meets{background:#e6ffed;border:1px solid #2ecc71;color:#064c2e}
.not{background:#fff6f6;border:1px solid #ff6b6b;color:#7b1d1d}
.pill{display:inline-block;padding:6px 10px;border-radius:999px;background:#f3f4f6;font-weight:600;margin-right:8px}
.payers{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.payer-card{background:#fff;padding:10px;border-radius:8px;border:1px solid #f0f0f0}
footer{margin-top:18px;font-size:13px;color:var(--muted)}
@media (max-width:900px){
  .grid{grid-template-columns:1fr}
  .payers{grid-template-columns:1fr 1fr}
}
```

---

**Document Version**: 2.0
**Last Updated**: 2025-11-21
**Author**: BRCA Tool Design Team
**Status**: Based on Actual Implementation
**Changes from v1.0**: Complete rewrite based on existing HTML file analysis
