# BRCA Medical Necessity Tool - Technical Plan
## Single Source of Truth for Implementation

**Project Type**: Demo Application for MedMinds Prospects
**Purpose**: Showcase MedMinds value proposition before clients sign up
**Last Updated**: 2025-11-22
**Status**: Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Direct Technical Recommendations](#2-direct-technical-recommendations)
3. [System Architecture](#3-system-architecture)
4. [Authentication Flow](#4-authentication-flow)
5. [Database Design](#5-database-design)
6. [PDF Processing Pipeline](#6-pdf-processing-pipeline)
7. [Admin Workflow](#7-admin-workflow)
8. [Visitor Workflow](#8-visitor-workflow)
9. [Free Tier Analysis](#9-free-tier-analysis)
10. [Implementation Phases](#10-implementation-phases)
11. [Security & Compliance](#11-security--compliance)

---

## 1. Executive Summary

### 1.1 Project Overview

**What it is:**
A prospect-facing web application that demonstrates MedMinds' capabilities in analyzing insurance policies for BRCA genetic testing medical necessity. Visitors upload their patient information, and the system matches it against insurance policies to determine coverage eligibility.

**Who uses it:**
- **Admins** (MedMinds staff): Upload and manage state-specific insurance policy PDFs
- **Visitors** (Prospects): Register, submit patient information, get coverage insights

**Business Value:**
Prospects experience MedMinds' AI-powered policy analysis before becoming paying clients.

### 1.2 Key Requirements

✅ **Two-Role System**: Admin (policy management) + Visitor (form submission)
✅ **SSO Authentication**: Google SSO for both first-time registration and returning users
✅ **State-Specific Policies**: Admins upload PDFs by state, can replace/amend anytime
✅ **PDF AI Scanning**: Automatic extraction of coverage criteria from policy documents
✅ **Policy Matching**: Match visitor data against available policies
✅ **Free Tier Hosting**: Entire system runs on GCP/Firebase free tiers
✅ **Firebase Hosting**: Frontend already hosted on Firebase

---

## 2. Direct Technical Recommendations

### 2.1 The Stack (Final Decision)

| Component | Technology | Why | Free Tier |
|-----------|-----------|-----|-----------|
| **Database** | **Firestore (Native Mode)** | NoSQL perfect for document-based policies, easy querying, real-time updates | 1GB storage, 50K reads/day, 20K writes/day, 20K deletes/day |
| **Authentication** | **Firebase Authentication (Google Provider)** | Seamless SSO, role management via custom claims, zero maintenance | 50,000 monthly active users |
| **PDF Storage** | **Firebase Storage** | Direct integration with Firebase ecosystem, secure file uploads | 5GB storage, 1GB/day downloads |
| **PDF AI Scanner** | **Document AI + Gemini 2.0 Flash** | Document AI extracts text, Gemini parses structured criteria | Document AI: 1,000 pages/month<br>Gemini: Generous free tier |
| **Backend Logic** | **Firebase Cloud Functions (2nd Gen)** | Serverless, scales to zero, triggered by events | 2M invocations/month, 400K GB-seconds |
| **Hosting** | **Firebase Hosting** | Already in use, CDN included, free SSL | 10GB storage, 360MB/day transfer |

**Answer to Your Questions:**

1. **Do we need a database?** → **YES - Firestore**
2. **Do we need a PDF AI scanner?** → **YES - Document AI + Gemini 2.0 Flash**
3. **Do we need backend for logical operations?** → **YES - Firebase Cloud Functions**
4. **Can we stay within free tiers?** → **YES - 100% free for your use case**

### 2.2 Why This Stack

**Unified Firebase Ecosystem:**
- Single project management console
- Shared authentication across all services
- No CORS issues between frontend/backend
- Automatic security rule enforcement
- Already using Firebase Hosting

**Cost Optimization:**
- Firestore free tier: 50K reads/day = 1.5M reads/month
- Your use case: ~10-20 visitors/day = ~600/month (4% of free tier)
- Admin PDF uploads: ~2-4 PDFs/week = ~200 pages/month (20% of Document AI free tier)
- Cloud Functions: PDF processing + API calls = ~1,000 invocations/month (0.05% of free tier)

**State-Specific Policy Management:**
- Firestore allows easy versioning by state
- Replace PDFs without affecting other states
- Query policies by state, payer, effective date
- No migration needed when policies change

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE HOSTING                             │
│              (React + TypeScript Frontend)                      │
│                 https://brca.medminds.com                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ (Firebase SDK)
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  FIREBASE   │  │  FIRESTORE  │  │   FIREBASE  │
│    AUTH     │  │  DATABASE   │  │   STORAGE   │
│             │  │             │  │             │
│ • Google    │  │ • Users     │  │ • Policy    │
│   SSO       │  │ • Policies  │  │   PDFs      │
│ • Custom    │  │ • Submis-   │  │ • Logos     │
│   Claims    │  │   sions     │  │             │
│ • Roles     │  │ • Audit     │  │             │
└─────────────┘  └──────┬──────┘  └──────┬──────┘
                        │                 │
                        │                 │
                        ▼                 ▼
                ┌──────────────────────────────┐
                │  CLOUD FUNCTIONS (2nd Gen)   │
                │                              │
                │  • processPDF()              │◄─── Triggered on
                │    - Document AI OCR         │     PDF upload
                │    - Gemini extraction       │
                │    - Store in Firestore      │
                │                              │
                │  • matchPolicy()             │◄─── Called by
                │    - Query policies          │     visitor form
                │    - Evaluate criteria       │
                │    - Return verdict          │
                │                              │
                │  • manageUser()              │◄─── Auth triggers
                │    - Set custom claims       │
                │    - Initialize profile      │
                └──────────────────────────────┘
```

### 3.2 Data Flow

#### Admin Flow (PDF Upload)
```
1. Admin logs in via Google SSO
   ↓
2. Firebase Auth validates, checks role (admin)
   ↓
3. Admin selects: State, Payer, Effective Date
   ↓
4. Admin uploads PDF → Firebase Storage
   ↓
5. Storage triggers Cloud Function: processPDF()
   ↓
6. Function sends PDF to Document AI (OCR)
   ↓
7. Function sends text to Gemini 2.0 Flash (structured extraction)
   ↓
8. Function stores parsed criteria in Firestore
   ↓
9. Admin reviews extracted criteria (optional)
   ↓
10. Admin marks as "active" (overrides previous version for that state/payer)
```

#### Visitor Flow (Form Submission)
```
1. Visitor lands on homepage (public)
   ↓
2. Visitor clicks "Get Started" → SSO prompt
   ↓
3. New visitor: Registers via Google SSO (role: visitor)
   Returning visitor: Logs in via Google SSO
   ↓
4. Visitor fills patient information form
   - Personal history
   - Family history
   - State selection
   ↓
5. Visitor submits form → Cloud Function: matchPolicy()
   ↓
6. Function queries Firestore for active policies (by state)
   ↓
7. Function evaluates patient data against criteria
   ↓
8. Function returns: Verdict (approved/denied) + matched criteria
   ↓
9. Frontend displays results
   ↓
10. Visitor can export results as PDF
```

---

## 4. Authentication Flow

### 4.1 SSO Implementation (Google Provider)

**Firebase Authentication Configuration:**

```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "brca-medminds.firebaseapp.com",
  projectId: "brca-medminds",
  storageBucket: "brca-medminds.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

**Login Flow (Frontend):**

```typescript
// src/auth/loginWithGoogle.ts
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get custom claims (role)
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role || 'visitor';

    // Redirect based on role
    if (role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/visitor/form';
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### 4.2 Role Management (Custom Claims)

**Initial User Creation (Cloud Function):**

```typescript
// functions/src/onUserCreate.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Default role: visitor
  await admin.auth().setCustomUserClaims(user.uid, { role: 'visitor' });

  // Create user document in Firestore
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: 'visitor',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
  });
});
```

**Promote User to Admin (Manual Process):**

```typescript
// functions/src/promoteToAdmin.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const promoteToAdmin = functions.https.onCall(async (data, context) => {
  // Only existing admins can promote users
  if (context.auth?.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can promote users');
  }

  const { uid } = data;

  // Set custom claim
  await admin.auth().setCustomUserClaims(uid, { role: 'admin' });

  // Update Firestore
  await admin.firestore().collection('users').doc(uid).update({
    role: 'admin',
    promotedAt: admin.firestore.FieldValue.serverTimestamp(),
    promotedBy: context.auth.uid
  });

  return { success: true };
});
```

### 4.3 Protected Routes (Frontend)

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'visitor';
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

**Usage:**

```typescript
// src/App.tsx
<Routes>
  <Route path="/login" element={<Login />} />

  <Route path="/admin/*" element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />

  <Route path="/visitor/*" element={
    <ProtectedRoute requiredRole="visitor">
      <VisitorForm />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 5. Database Design

### 5.1 Firestore Collections

#### Collection: `users`

Stores all authenticated users (admins + visitors).

```typescript
interface User {
  uid: string;                    // Document ID (matches Firebase Auth UID)
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'visitor';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  promotedAt?: Timestamp;         // If upgraded to admin
  promotedBy?: string;            // Admin UID who promoted
}
```

**Example Document:**

```json
{
  "uid": "abc123xyz",
  "email": "visitor@example.com",
  "displayName": "Jane Doe",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "role": "visitor",
  "createdAt": "2025-11-22T10:00:00Z",
  "lastLoginAt": "2025-11-22T14:30:00Z"
}
```

#### Collection: `policies`

Stores insurance policy criteria extracted from PDFs.

```typescript
interface Policy {
  id: string;                           // Auto-generated
  state: string;                        // e.g., "California", "Texas"
  payer: 'UHC' | 'Evicore' | 'BCBS' | 'Aetna' | 'Regence' | 'Carelon';
  version: string;                      // e.g., "2025-v1"
  effectiveDate: Timestamp;
  expirationDate?: Timestamp;
  status: 'draft' | 'active' | 'archived';

  // Extracted criteria
  criteria: Criterion[];

  // Metadata
  pdfUrl: string;                       // Firebase Storage URL
  pdfFileName: string;
  uploadedBy: string;                   // Admin UID
  uploadedAt: Timestamp;
  processedAt?: Timestamp;
  approvedBy?: string;
  approvedAt?: Timestamp;

  // Raw data for debugging
  rawText?: string;                     // OCR output
  geminiResponse?: string;              // AI extraction output
}

interface Criterion {
  id: string;
  category: 'personal_history' | 'family_history' | 'ancestry' | 'other';
  description: string;

  // Personal history fields
  cancerTypes?: string[];               // ['breast', 'ovarian']
  ageThreshold?: number;                // e.g., 45
  ageOperator?: '<=' | '>=' | '=' | 'any';

  // Family history fields
  relationshipDegree?: 'first' | 'second' | 'third' | 'any';
  relationshipTypes?: string[];         // ['mother', 'sister', 'daughter']
  familyCancerTypes?: string[];
  familyAgeThreshold?: number;

  // Ancestry
  ancestryRequirement?: string;         // e.g., "Ashkenazi Jewish"

  // Scoring
  weight: number;                       // 1-10 (importance)
  originalText?: string;                // Exact quote from PDF
}
```

**Example Document:**

```json
{
  "id": "ca_uhc_2025_v1",
  "state": "California",
  "payer": "UHC",
  "version": "2025-v1",
  "effectiveDate": "2025-01-01T00:00:00Z",
  "status": "active",
  "criteria": [
    {
      "id": "ca_uhc_001",
      "category": "personal_history",
      "description": "Personal history of breast cancer diagnosed at age 45 or younger",
      "cancerTypes": ["breast"],
      "ageThreshold": 45,
      "ageOperator": "<=",
      "weight": 10,
      "originalText": "Individuals with breast cancer diagnosed at ≤45 years"
    },
    {
      "id": "ca_uhc_002",
      "category": "family_history",
      "description": "First-degree relative with ovarian cancer at any age",
      "relationshipDegree": "first",
      "familyCancerTypes": ["ovarian"],
      "weight": 8,
      "originalText": "One or more first-degree relatives with ovarian cancer"
    }
  ],
  "pdfUrl": "gs://brca-medminds.appspot.com/policies/ca_uhc_2025_v1.pdf",
  "pdfFileName": "UHC_California_2025.pdf",
  "uploadedBy": "admin_uid_123",
  "uploadedAt": "2025-11-20T08:00:00Z",
  "processedAt": "2025-11-20T08:02:15Z",
  "approvedBy": "admin_uid_123",
  "approvedAt": "2025-11-20T10:00:00Z"
}
```

**Indexing Strategy:**

```javascript
// Composite indexes (created via Firebase Console or firestore.indexes.json)
- state ASC, status ASC, effectiveDate DESC
- payer ASC, status ASC, effectiveDate DESC
- uploadedBy ASC, uploadedAt DESC
```

#### Collection: `submissions`

Stores visitor form submissions and evaluation results.

```typescript
interface Submission {
  id: string;                           // Auto-generated
  visitorUid: string;                   // User UID
  submittedAt: Timestamp;

  // Patient data
  patientInfo: {
    state: string;
    age: number;
    sex: 'F' | 'M';
    isAshkenaziJewish: boolean;
  };

  personalHistory: {
    hasPersonalHistory: boolean;
    cancerTypes: {
      type: string;
      ageAtDiagnosis: number;
      isTripleNegative?: boolean;
      isMetastatic?: boolean;
    }[];
  };

  familyHistory: FamilyMember[];

  // Evaluation results
  evaluationResults: {
    payer: string;
    verdict: 'approved' | 'likely_approved' | 'requires_review' | 'denied';
    matchedCriteria: string[];          // Criterion IDs
    confidence: number;                 // 0-100
  }[];

  // Metadata
  policyVersionsUsed: string[];         // Policy IDs used for evaluation
  expiresAt: Timestamp;                 // Auto-delete after 30 days
}

interface FamilyMember {
  relationship: string;                 // 'mother', 'father', etc.
  degree: 1 | 2 | 3;
  side: 'maternal' | 'paternal';
  cancerHistory: {
    type: string;
    ageAtDiagnosis: number;
  }[];
}
```

**Example Document:**

```json
{
  "id": "sub_xyz789",
  "visitorUid": "visitor_uid_456",
  "submittedAt": "2025-11-22T15:00:00Z",
  "patientInfo": {
    "state": "California",
    "age": 40,
    "sex": "F",
    "isAshkenaziJewish": false
  },
  "personalHistory": {
    "hasPersonalHistory": true,
    "cancerTypes": [
      {
        "type": "breast",
        "ageAtDiagnosis": 43,
        "isTripleNegative": false
      }
    ]
  },
  "familyHistory": [
    {
      "relationship": "mother",
      "degree": 1,
      "side": "maternal",
      "cancerHistory": [
        {
          "type": "ovarian",
          "ageAtDiagnosis": 55
        }
      ]
    }
  ],
  "evaluationResults": [
    {
      "payer": "UHC",
      "verdict": "approved",
      "matchedCriteria": ["ca_uhc_001", "ca_uhc_002"],
      "confidence": 95
    }
  ],
  "policyVersionsUsed": ["ca_uhc_2025_v1", "ca_bcbs_2025_v1"],
  "expiresAt": "2025-12-22T15:00:00Z"
}
```

**Auto-Delete Setup (TTL):**

```javascript
// Use Firebase Extensions: Delete Collections
// Or Cloud Scheduler + Cloud Function to delete expired submissions
```

#### Collection: `audit_logs`

Tracks all critical actions for compliance.

```typescript
interface AuditLog {
  id: string;
  timestamp: Timestamp;
  userId: string;
  userRole: 'admin' | 'visitor';
  action: 'pdf_upload' | 'policy_approve' | 'policy_archive' | 'user_promote' | 'form_submit';
  resourceType: 'policy' | 'user' | 'submission';
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
}
```

**Example Document:**

```json
{
  "id": "audit_abc123",
  "timestamp": "2025-11-22T10:00:00Z",
  "userId": "admin_uid_123",
  "userRole": "admin",
  "action": "pdf_upload",
  "resourceType": "policy",
  "resourceId": "ca_uhc_2025_v1",
  "details": {
    "state": "California",
    "payer": "UHC",
    "fileName": "UHC_California_2025.pdf"
  },
  "ipAddress": "192.168.1.1"
}
```

### 5.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }

    function isVisitor() {
      return isAuthenticated() && request.auth.token.role == 'visitor';
    }

    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Policies collection
    match /policies/{policyId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // Submissions collection
    match /submissions/{submissionId} {
      allow read: if isAuthenticated() &&
                     (isOwner(resource.data.visitorUid) || isAdmin());
      allow create: if isVisitor() && isOwner(request.resource.data.visitorUid);
      allow update, delete: if isAdmin();
    }

    // Audit logs (read-only for admins)
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

---

## 6. PDF Processing Pipeline

### 6.1 Document AI + Gemini Integration

**Cloud Function: processPDF**

```typescript
// functions/src/processPDF.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const documentAI = new DocumentProcessorServiceClient();
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const processPDF = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name!; // e.g., "policies/ca_uhc_2025_v1.pdf"

  // Only process files in "policies/" folder
  if (!filePath.startsWith('policies/')) return;

  console.log(`Processing PDF: ${filePath}`);

  // Step 1: Extract metadata from file path
  const fileName = filePath.split('/').pop()!;
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);

  // Get custom metadata (state, payer, etc. - set during upload)
  const [metadata] = await file.getMetadata();
  const customMetadata = metadata.metadata || {};

  const state = customMetadata.state;
  const payer = customMetadata.payer;
  const version = customMetadata.version || 'v1';
  const uploadedBy = customMetadata.uploadedBy;

  if (!state || !payer) {
    console.error('Missing state or payer metadata');
    return;
  }

  // Step 2: Download PDF
  const [pdfBuffer] = await file.download();

  // Step 3: Document AI OCR
  console.log('Running Document AI OCR...');
  const text = await extractTextWithDocumentAI(pdfBuffer);

  // Step 4: Gemini criteria extraction
  console.log('Extracting criteria with Gemini...');
  const criteria = await extractCriteriaWithGemini(text, payer);

  // Step 5: Store in Firestore
  const policyId = `${state.toLowerCase().replace(/\s+/g, '_')}_${payer.toLowerCase()}_${Date.now()}`;

  await admin.firestore().collection('policies').doc(policyId).set({
    id: policyId,
    state,
    payer,
    version,
    effectiveDate: admin.firestore.Timestamp.now(),
    status: 'draft', // Admin must approve
    criteria,
    pdfUrl: `gs://${bucket.name}/${filePath}`,
    pdfFileName: fileName,
    uploadedBy,
    uploadedAt: admin.firestore.Timestamp.now(),
    processedAt: admin.firestore.Timestamp.now(),
    rawText: text
  });

  // Step 6: Audit log
  await admin.firestore().collection('audit_logs').add({
    timestamp: admin.firestore.Timestamp.now(),
    userId: uploadedBy,
    userRole: 'admin',
    action: 'pdf_upload',
    resourceType: 'policy',
    resourceId: policyId,
    details: { state, payer, fileName }
  });

  console.log(`Policy created: ${policyId}`);
});

async function extractTextWithDocumentAI(pdfBuffer: Buffer): Promise<string> {
  const projectId = process.env.GCP_PROJECT_ID!;
  const location = 'us'; // or 'eu'
  const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID!;

  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const request = {
    name,
    rawDocument: {
      content: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf'
    }
  };

  const [result] = await documentAI.processDocument(request);
  return result.document?.text || '';
}

async function extractCriteriaWithGemini(text: string, payer: string): Promise<any[]> {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
You are a medical policy analyst extracting BRCA genetic testing eligibility criteria.

Extract all criteria from this ${payer} insurance policy and return ONLY valid JSON (no markdown, no explanation).

Policy Text:
${text.substring(0, 50000)} // Limit to avoid token limits

Return format:
[
  {
    "id": "auto_001",
    "category": "personal_history" | "family_history" | "ancestry" | "other",
    "description": "Clear summary of this criterion",
    "cancerTypes": ["breast", "ovarian"] or null,
    "ageThreshold": 45 or null,
    "ageOperator": "<=" | ">=" | "=" | "any" or null,
    "relationshipDegree": "first" | "second" | "third" | "any" or null,
    "relationshipTypes": ["mother", "sister"] or null,
    "familyCancerTypes": ["breast"] or null,
    "ancestryRequirement": "Ashkenazi Jewish" or null,
    "weight": 1-10,
    "originalText": "Exact quote from policy"
  }
]

Focus on:
- Personal cancer history (breast, ovarian, pancreatic, prostate)
- Family history (which relatives, which cancers, age requirements)
- Ancestry requirements
- Age thresholds
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Clean response (remove markdown code blocks if present)
  const jsonText = response
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const criteria = JSON.parse(jsonText);

  // Add payer-specific IDs
  return criteria.map((c: any, idx: number) => ({
    ...c,
    id: `${payer.toLowerCase()}_${String(idx + 1).padStart(3, '0')}`
  }));
}
```

### 6.2 Setting Up Document AI

**Manual Setup (One-Time):**

1. Enable Document AI API in GCP Console
2. Create a processor:
   - Type: **Form Parser** (best for insurance policies)
   - Location: `us` or `eu`
3. Copy Processor ID → Environment variable `DOCUMENT_AI_PROCESSOR_ID`

**Alternative (Free Tier Option):**

If Document AI free tier is exhausted, use **pdf-parse** library for text-based PDFs:

```typescript
import pdfParse from 'pdf-parse';

async function extractTextWithPdfParse(pdfBuffer: Buffer): Promise<string> {
  const data = await pdfParse(pdfBuffer);
  return data.text;
}
```

**Trade-off:**
- Document AI: Better OCR for scanned documents, handles complex layouts
- pdf-parse: Free unlimited usage, only works on text-based PDFs (not scanned images)

**Recommendation:** Start with Document AI (1,000 pages/month free). If you exceed, fall back to pdf-parse.

---

## 7. Admin Workflow

### 7.1 Admin Dashboard Components

**Pages:**

1. **Login** (`/admin/login`) - Google SSO
2. **Dashboard** (`/admin/dashboard`) - Overview stats
3. **Upload Policy** (`/admin/upload`) - PDF upload form
4. **Manage Policies** (`/admin/policies`) - View/edit/archive policies
5. **Users** (`/admin/users`) - Promote users to admin

### 7.2 PDF Upload Flow (Frontend)

```typescript
// src/pages/admin/UploadPolicy.tsx
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase.config';
import { useAuth } from '../../hooks/useAuth';

export function UploadPolicy() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState('');
  const [payer, setPayer] = useState('');
  const [version, setVersion] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!file || !state || !payer) {
      alert('Please fill all required fields');
      return;
    }

    // Create storage reference
    const fileName = `policies/${state}_${payer}_${Date.now()}.pdf`;
    const storageRef = ref(storage, fileName);

    // Set custom metadata (used by Cloud Function)
    const metadata = {
      customMetadata: {
        state,
        payer,
        version,
        effectiveDate,
        uploadedBy: user!.uid
      }
    };

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed');
      },
      async () => {
        // Upload complete
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File uploaded:', downloadURL);
        alert('PDF uploaded successfully! Processing will begin shortly.');

        // Reset form
        setFile(null);
        setState('');
        setPayer('');
        setVersion('');
        setEffectiveDate('');
        setUploadProgress(0);
      }
    );
  };

  return (
    <div className="upload-policy">
      <h2>Upload Insurance Policy PDF</h2>

      <div className="form-group">
        <label>State *</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select state...</option>
          <option value="California">California</option>
          <option value="Texas">Texas</option>
          <option value="New York">New York</option>
          {/* Add all 50 states */}
        </select>
      </div>

      <div className="form-group">
        <label>Payer *</label>
        <select value={payer} onChange={(e) => setPayer(e.target.value)}>
          <option value="">Select payer...</option>
          <option value="UHC">UnitedHealthcare</option>
          <option value="Evicore">Evicore</option>
          <option value="BCBS">Blue Cross Blue Shield</option>
          <option value="Aetna">Aetna</option>
          <option value="Regence">Regence</option>
          <option value="Carelon">Carelon</option>
        </select>
      </div>

      <div className="form-group">
        <label>Version</label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="e.g., 2025-v1"
        />
      </div>

      <div className="form-group">
        <label>Effective Date</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>PDF File *</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${uploadProgress}%` }}>{uploadProgress.toFixed(0)}%</div>
        </div>
      )}

      <button onClick={handleUpload} disabled={uploadProgress > 0}>
        Upload PDF
      </button>
    </div>
  );
}
```

### 7.3 Policy Review & Approval

After PDF processing, admin reviews extracted criteria:

```typescript
// src/pages/admin/ReviewPolicy.tsx
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

export function ReviewPolicy({ policyId }: { policyId: string }) {
  const [policy, setPolicy] = useState<any>(null);
  const [editedCriteria, setEditedCriteria] = useState<any[]>([]);

  useEffect(() => {
    loadPolicy();
  }, [policyId]);

  const loadPolicy = async () => {
    const docRef = doc(db, 'policies', policyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setPolicy(data);
      setEditedCriteria(data.criteria || []);
    }
  };

  const approvePolicy = async () => {
    const docRef = doc(db, 'policies', policyId);

    await updateDoc(docRef, {
      status: 'active',
      criteria: editedCriteria,
      approvedBy: user!.uid,
      approvedAt: serverTimestamp()
    });

    alert('Policy approved and activated!');
  };

  return (
    <div>
      <h2>Review Policy: {policy?.state} - {policy?.payer}</h2>

      <div className="metadata">
        <p><strong>Uploaded:</strong> {policy?.uploadedAt?.toDate().toLocaleString()}</p>
        <p><strong>Status:</strong> {policy?.status}</p>
      </div>

      <h3>Extracted Criteria ({editedCriteria.length})</h3>

      {editedCriteria.map((criterion, idx) => (
        <div key={idx} className="criterion-card">
          <p><strong>{criterion.category}</strong></p>
          <p>{criterion.description}</p>
          <p className="small">Weight: {criterion.weight}</p>

          {/* Admin can edit inline */}
          <button onClick={() => editCriterion(idx)}>Edit</button>
          <button onClick={() => deleteCriterion(idx)}>Delete</button>
        </div>
      ))}

      <div className="actions">
        <button onClick={approvePolicy} className="btn-primary">
          Approve & Activate
        </button>
        <button onClick={archivePolicy} className="btn-secondary">
          Archive
        </button>
      </div>
    </div>
  );
}
```

### 7.4 Replacing State-Specific Policies

**When admin uploads a new PDF for an existing state/payer:**

1. New policy created with status `draft`
2. Previous policy remains `active` until new one is approved
3. Admin reviews new policy
4. Admin clicks "Approve & Replace"
5. Cloud Function:
   - Sets new policy to `active`
   - Sets previous policy to `archived`
   - Updates `expirationDate` on old policy

**No data loss:**
- Old policies remain in Firestore (archived)
- Submissions reference policy IDs, so historical data is preserved
- Admin can view archived policies anytime

---

## 8. Visitor Workflow

### 8.1 Visitor Pages

1. **Landing Page** (`/`) - Public homepage
2. **Login** (`/login`) - Google SSO
3. **Patient Form** (`/visitor/form`) - Multi-step form
4. **Results** (`/visitor/results`) - Evaluation results
5. **History** (`/visitor/history`) - Past submissions

### 8.2 Patient Form (Multi-Step)

**Step 1: State Selection**

```typescript
// src/pages/visitor/FormStep1.tsx
export function FormStep1({ onNext }: { onNext: (data: any) => void }) {
  const [state, setState] = useState('');

  return (
    <div>
      <h2>Select Your State</h2>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        <option value="">Choose...</option>
        <option value="California">California</option>
        <option value="Texas">Texas</option>
        {/* All states */}
      </select>

      <button onClick={() => onNext({ state })} disabled={!state}>
        Next
      </button>
    </div>
  );
}
```

**Step 2: Personal History**

```typescript
// src/pages/visitor/FormStep2.tsx
export function FormStep2({ onNext, onBack }: any) {
  const [hasHistory, setHasHistory] = useState(false);
  const [cancers, setCancers] = useState<any[]>([]);

  const addCancer = () => {
    setCancers([...cancers, { type: '', ageAtDiagnosis: null }]);
  };

  return (
    <div>
      <h2>Personal Cancer History</h2>

      <label>
        <input
          type="checkbox"
          checked={hasHistory}
          onChange={(e) => setHasHistory(e.target.checked)}
        />
        I have a personal history of cancer
      </label>

      {hasHistory && (
        <>
          {cancers.map((cancer, idx) => (
            <div key={idx}>
              <select
                value={cancer.type}
                onChange={(e) => updateCancer(idx, 'type', e.target.value)}
              >
                <option value="">Select cancer type...</option>
                <option value="breast">Breast</option>
                <option value="ovarian">Ovarian</option>
                <option value="pancreatic">Pancreatic</option>
                {/* More types */}
              </select>

              <input
                type="number"
                placeholder="Age at diagnosis"
                value={cancer.ageAtDiagnosis || ''}
                onChange={(e) => updateCancer(idx, 'ageAtDiagnosis', parseInt(e.target.value))}
              />
            </div>
          ))}

          <button onClick={addCancer}>Add Cancer</button>
        </>
      )}

      <div className="form-actions">
        <button onClick={onBack}>Back</button>
        <button onClick={() => onNext({ hasHistory, cancers })}>Next</button>
      </div>
    </div>
  );
}
```

**Step 3: Family History**

```typescript
// src/pages/visitor/FormStep3.tsx
export function FormStep3({ onNext, onBack }: any) {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      relationship: '',
      degree: 1,
      side: 'maternal',
      cancerHistory: []
    }]);
  };

  return (
    <div>
      <h2>Family Cancer History</h2>

      {familyMembers.map((member, idx) => (
        <div key={idx} className="family-member-card">
          <select
            value={member.relationship}
            onChange={(e) => updateMember(idx, 'relationship', e.target.value)}
          >
            <option value="">Relationship...</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="sister">Sister</option>
            {/* More relationships */}
          </select>

          <select
            value={member.side}
            onChange={(e) => updateMember(idx, 'side', e.target.value)}
          >
            <option value="maternal">Maternal</option>
            <option value="paternal">Paternal</option>
          </select>

          {/* Add cancer history for this member */}
          <button onClick={() => addCancerToMember(idx)}>Add Cancer</button>
          <button onClick={() => removeMember(idx)}>Remove</button>
        </div>
      ))}

      <button onClick={addFamilyMember}>Add Family Member</button>

      <div className="form-actions">
        <button onClick={onBack}>Back</button>
        <button onClick={() => onNext({ familyMembers })}>Next</button>
      </div>
    </div>
  );
}
```

**Step 4: Submit & Evaluate**

```typescript
// src/pages/visitor/FormStep4.tsx
export function FormStep4({ formData, onBack }: any) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Call Cloud Function
      const matchPolicyFunc = httpsCallable(functions, 'matchPolicy');
      const response = await matchPolicyFunc({
        visitorUid: user!.uid,
        patientInfo: formData.step1,
        personalHistory: formData.step2,
        familyHistory: formData.step3
      });

      setResults(response.data);
    } catch (error) {
      console.error('Evaluation failed:', error);
      alert('Failed to evaluate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Review & Submit</h2>

      <div className="summary">
        <h3>Your Information</h3>
        <p><strong>State:</strong> {formData.step1.state}</p>
        <p><strong>Personal History:</strong> {formData.step2.hasHistory ? 'Yes' : 'No'}</p>
        <p><strong>Family Members:</strong> {formData.step3.familyMembers.length}</p>
      </div>

      {loading && <LoadingSpinner />}

      {results && (
        <div className="results">
          <h3>Evaluation Results</h3>
          {results.evaluationResults.map((result: any, idx: number) => (
            <div key={idx} className={`result-card ${result.verdict}`}>
              <h4>{result.payer}</h4>
              <p className="verdict">{result.verdict.toUpperCase()}</p>
              <p className="confidence">Confidence: {result.confidence}%</p>

              <div className="matched-criteria">
                <h5>Matched Criteria:</h5>
                <ul>
                  {result.matchedCriteriaDescriptions.map((desc: string, i: number) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button onClick={onBack} disabled={loading}>Back</button>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Evaluating...' : 'Evaluate Coverage'}
        </button>
      </div>
    </div>
  );
}
```

### 8.3 Policy Matching Logic (Cloud Function)

```typescript
// functions/src/matchPolicy.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const matchPolicy = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { visitorUid, patientInfo, personalHistory, familyHistory } = data;

  // Step 1: Query active policies for the visitor's state
  const policiesSnapshot = await admin.firestore()
    .collection('policies')
    .where('state', '==', patientInfo.state)
    .where('status', '==', 'active')
    .get();

  if (policiesSnapshot.empty) {
    throw new functions.https.HttpsError('not-found', 'No policies found for this state');
  }

  // Step 2: Evaluate against each payer's criteria
  const evaluationResults = [];
  const policyVersionsUsed = [];

  for (const policyDoc of policiesSnapshot.docs) {
    const policy = policyDoc.data();
    policyVersionsUsed.push(policy.id);

    const matchedCriteria: string[] = [];
    const matchedDescriptions: string[] = [];

    for (const criterion of policy.criteria) {
      if (evaluateCriterion(criterion, patientInfo, personalHistory, familyHistory)) {
        matchedCriteria.push(criterion.id);
        matchedDescriptions.push(criterion.description);
      }
    }

    // Calculate verdict
    const totalWeight = policy.criteria.reduce((sum: number, c: any) => sum + c.weight, 0);
    const matchedWeight = matchedCriteria.reduce((sum: number, id: string) => {
      const c = policy.criteria.find((cr: any) => cr.id === id);
      return sum + (c?.weight || 0);
    }, 0);

    const confidence = (matchedWeight / totalWeight) * 100;

    let verdict: string;
    if (confidence >= 80) verdict = 'approved';
    else if (confidence >= 50) verdict = 'likely_approved';
    else if (confidence >= 30) verdict = 'requires_review';
    else verdict = 'denied';

    evaluationResults.push({
      payer: policy.payer,
      verdict,
      matchedCriteria,
      matchedCriteriaDescriptions: matchedDescriptions,
      confidence: Math.round(confidence)
    });
  }

  // Step 3: Store submission in Firestore
  const submissionRef = await admin.firestore().collection('submissions').add({
    visitorUid,
    submittedAt: admin.firestore.Timestamp.now(),
    patientInfo,
    personalHistory,
    familyHistory,
    evaluationResults,
    policyVersionsUsed,
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    )
  });

  // Step 4: Audit log
  await admin.firestore().collection('audit_logs').add({
    timestamp: admin.firestore.Timestamp.now(),
    userId: visitorUid,
    userRole: 'visitor',
    action: 'form_submit',
    resourceType: 'submission',
    resourceId: submissionRef.id,
    details: { state: patientInfo.state, policyCount: policiesSnapshot.size }
  });

  return {
    submissionId: submissionRef.id,
    evaluationResults
  };
});

function evaluateCriterion(
  criterion: any,
  patientInfo: any,
  personalHistory: any,
  familyHistory: any
): boolean {
  switch (criterion.category) {
    case 'personal_history':
      return evaluatePersonalHistory(criterion, personalHistory);
    case 'family_history':
      return evaluateFamilyHistory(criterion, familyHistory);
    case 'ancestry':
      return evaluateAncestry(criterion, patientInfo);
    default:
      return false;
  }
}

function evaluatePersonalHistory(criterion: any, personalHistory: any): boolean {
  if (!personalHistory.hasPersonalHistory) return false;

  for (const cancer of personalHistory.cancerTypes) {
    // Check cancer type match
    if (criterion.cancerTypes && !criterion.cancerTypes.includes(cancer.type)) {
      continue;
    }

    // Check age threshold
    if (criterion.ageThreshold) {
      const meetsAge = compareAge(
        cancer.ageAtDiagnosis,
        criterion.ageThreshold,
        criterion.ageOperator || '<='
      );
      if (!meetsAge) continue;
    }

    return true; // Found matching cancer
  }

  return false;
}

function evaluateFamilyHistory(criterion: any, familyHistory: any): boolean {
  const matchingMembers = familyHistory.filter((member: any) => {
    // Check relationship degree
    if (criterion.relationshipDegree && criterion.relationshipDegree !== 'any') {
      if (member.degree !== parseInt(criterion.relationshipDegree)) {
        return false;
      }
    }

    // Check relationship type
    if (criterion.relationshipTypes && criterion.relationshipTypes.length > 0) {
      if (!criterion.relationshipTypes.includes(member.relationship)) {
        return false;
      }
    }

    // Check cancer types
    for (const cancer of member.cancerHistory) {
      if (criterion.familyCancerTypes && !criterion.familyCancerTypes.includes(cancer.type)) {
        continue;
      }

      // Check age threshold
      if (criterion.familyAgeThreshold) {
        const meetsAge = compareAge(
          cancer.ageAtDiagnosis,
          criterion.familyAgeThreshold,
          criterion.ageOperator || '<='
        );
        if (!meetsAge) continue;
      }

      return true; // This family member matches
    }

    return false;
  });

  return matchingMembers.length > 0;
}

function evaluateAncestry(criterion: any, patientInfo: any): boolean {
  if (criterion.ancestryRequirement === 'Ashkenazi Jewish') {
    return patientInfo.isAshkenaziJewish === true;
  }
  return false;
}

function compareAge(actualAge: number, threshold: number, operator: string): boolean {
  switch (operator) {
    case '<=': return actualAge <= threshold;
    case '>=': return actualAge >= threshold;
    case '=': return actualAge === threshold;
    case 'any': return true;
    default: return false;
  }
}
```

---

## 9. Free Tier Analysis

### 9.1 Detailed Free Tier Limits

| Service | Free Tier Limit | Your Expected Usage | % Used |
|---------|-----------------|---------------------|--------|
| **Firebase Hosting** | 10GB storage, 360MB/day transfer | React app ~5MB, traffic ~50MB/day | 14% |
| **Firebase Authentication** | 50,000 MAU | ~100 MAU (admins + visitors) | 0.2% |
| **Firestore** | 1GB storage, 50K reads/day, 20K writes/day | ~50MB storage, ~500 reads/day, ~50 writes/day | 1% reads, 0.25% writes |
| **Firebase Storage** | 5GB storage, 1GB/day downloads | ~500MB PDFs, ~10MB/day downloads | 10% storage, 1% downloads |
| **Cloud Functions** | 2M invocations/month, 400K GB-seconds | ~1,000 invocations/month (PDF + API) | 0.05% |
| **Document AI** | 1,000 pages/month | ~100-200 pages/month (2-4 PDFs/week × 50 pages) | 20% |
| **Gemini 2.0 Flash** | 1,500 requests/day (free tier) | ~10 requests/day (PDF processing) | 0.67% |

### 9.2 Usage Scenarios

**Scenario 1: Low Traffic (10 visitors/day)**

| Metric | Daily | Monthly | Free Tier | Status |
|--------|-------|---------|-----------|--------|
| Visitor logins | 10 | 300 | 50,000 MAU | ✅ Free |
| Form submissions | 10 | 300 | - | ✅ Free |
| Firestore reads | 100 | 3,000 | 1.5M/month | ✅ Free |
| Firestore writes | 20 | 600 | 600K/month | ✅ Free |
| Cloud Functions | 30 | 900 | 2M/month | ✅ Free |
| PDF uploads (admin) | 0.5 | 15 PDFs | - | ✅ Free |
| Document AI pages | 25 | 750 pages | 1,000/month | ✅ Free |

**Total Cost: $0.00/month**

**Scenario 2: Medium Traffic (50 visitors/day)**

| Metric | Daily | Monthly | Free Tier | Status |
|--------|-------|---------|-----------|--------|
| Visitor logins | 50 | 1,500 | 50,000 MAU | ✅ Free |
| Form submissions | 50 | 1,500 | - | ✅ Free |
| Firestore reads | 500 | 15,000 | 1.5M/month | ✅ Free |
| Firestore writes | 100 | 3,000 | 600K/month | ✅ Free |
| Cloud Functions | 150 | 4,500 | 2M/month | ✅ Free |
| PDF uploads (admin) | 1 | 30 PDFs | - | ✅ Free |
| Document AI pages | 50 | 1,500 pages | 1,000/month | ⚠️ Exceeds by 500 pages |

**Estimated Cost:** $0.75/month (500 pages × $1.50/1000 pages)

**Solution:** Use pdf-parse for simple PDFs, reserve Document AI for complex/scanned documents.

**Scenario 3: High Traffic (200 visitors/day)**

| Metric | Daily | Monthly | Free Tier | Status |
|--------|-------|---------|-----------|--------|
| Visitor logins | 200 | 6,000 | 50,000 MAU | ✅ Free |
| Form submissions | 200 | 6,000 | - | ✅ Free |
| Firestore reads | 2,000 | 60,000 | 1.5M/month | ✅ Free |
| Firestore writes | 400 | 12,000 | 600K/month | ✅ Free |
| Cloud Functions | 600 | 18,000 | 2M/month | ✅ Free |
| Hosting traffic | 500MB | 15GB | 10GB/month | ⚠️ Exceeds by 5GB |
| PDF uploads (admin) | 2 | 60 PDFs | - | ✅ Free |
| Document AI pages | 100 | 3,000 pages | 1,000/month | ⚠️ Exceeds by 2,000 pages |

**Estimated Cost:** $3.00/month (Document AI) + $1.00/month (Hosting egress) = **$4.00/month**

### 9.3 Cost Monitoring Setup

**Enable Budget Alerts:**

1. Go to GCP Console → Billing → Budgets & Alerts
2. Create budget: $10/month threshold
3. Alert at: 50%, 90%, 100%
4. Notification email: admin@medminds.com

**Monitor Usage:**

```typescript
// Cloud Function: Daily usage report (Cloud Scheduler trigger)
export const dailyUsageReport = functions.pubsub
  .schedule('0 9 * * *') // 9 AM daily
  .onRun(async (context) => {
    const firestore = admin.firestore();

    // Count submissions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissionsSnapshot = await firestore
      .collection('submissions')
      .where('submittedAt', '>=', admin.firestore.Timestamp.fromDate(today))
      .get();

    const usageReport = {
      date: today.toISOString(),
      submissions: submissionsSnapshot.size,
      // Add more metrics
    };

    console.log('Daily usage:', usageReport);

    // Optionally send email to admin
  });
```

### 9.4 Staying Within Free Tier

**Optimization Strategies:**

1. **Firestore Reads:**
   - Cache active policies in Cloud Functions memory (TTL: 1 hour)
   - Reduces repeated queries for the same state

2. **Document AI:**
   - Use pdf-parse for text-based PDFs (free unlimited)
   - Reserve Document AI for scanned/complex PDFs
   - Implement admin toggle: "Use OCR?" (default: No)

3. **Cloud Functions:**
   - Set `minInstances: 0` (scale to zero when idle)
   - Use lightweight function deployments (Node.js 20, not Python)

4. **Hosting:**
   - Enable aggressive caching (Cache-Control: max-age=31536000 for assets)
   - Use Brotli compression (reduces transfer by ~20%)
   - Serve images from Firebase Storage (not hosting)

5. **Storage:**
   - Delete draft policies after 30 days (Cloud Scheduler cleanup function)
   - Archive old PDFs to Nearline storage (cheaper)

---

## 10. Implementation Phases

### Phase 1: Firebase Setup & Authentication (Week 1)

**Tasks:**

- [ ] Create Firebase project
- [ ] Enable Firebase Authentication (Google provider)
- [ ] Configure Firebase Hosting
- [ ] Set up Firestore database
- [ ] Create Firestore security rules
- [ ] Deploy initial frontend (login page)
- [ ] Implement Google SSO login flow
- [ ] Create `onUserCreate` Cloud Function (assign default role)
- [ ] Test admin promotion flow

**Deliverables:**

- Working SSO login
- Role-based routing (admin vs visitor)
- User profile creation in Firestore

### Phase 2: Admin Portal & PDF Pipeline (Week 2-3)

**Tasks:**

- [ ] Build admin dashboard UI
- [ ] Implement PDF upload form
- [ ] Set up Firebase Storage (policies bucket)
- [ ] Enable Document AI API
- [ ] Create Document AI processor
- [ ] Set up Gemini API key
- [ ] Deploy `processPDF` Cloud Function
- [ ] Build policy review/approval UI
- [ ] Implement policy activation workflow
- [ ] Create policy versioning logic
- [ ] Test PDF upload → processing → approval flow

**Deliverables:**

- Admin can upload PDFs
- PDFs are automatically processed
- Extracted criteria appear in Firestore
- Admin can review and approve policies

### Phase 3: Visitor Portal & Matching Engine (Week 4-5)

**Tasks:**

- [ ] Build visitor landing page
- [ ] Implement multi-step form (4 steps)
- [ ] Create form validation logic
- [ ] Deploy `matchPolicy` Cloud Function
- [ ] Implement policy matching algorithm
- [ ] Build results display UI
- [ ] Add export results as PDF
- [ ] Create visitor history page
- [ ] Test end-to-end visitor flow

**Deliverables:**

- Visitors can register and log in
- Visitors can submit patient information
- System matches against active policies
- Results displayed with verdicts

### Phase 4: Testing & Deployment (Week 6)

**Tasks:**

- [ ] Write unit tests (Cloud Functions)
- [ ] Write integration tests (end-to-end flows)
- [ ] Load testing (simulate 100 concurrent visitors)
- [ ] Security audit (Firestore rules, IAM)
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization (Lighthouse score >90)
- [ ] Documentation (user guides for admins/visitors)
- [ ] Deploy to production
- [ ] Set up monitoring and alerts

**Deliverables:**

- Fully tested application
- Production deployment
- User documentation
- Monitoring dashboard

---

## 11. Security & Compliance

### 11.1 Data Privacy

**No PHI Storage:**

- Visitor submissions auto-delete after 30 days (Firestore TTL)
- No personally identifiable information stored long-term
- Results are session-based (can be exported, not stored)

**Encryption:**

- HTTPS enforced (Firebase Hosting automatic SSL)
- Firestore: Automatic encryption at rest
- Firebase Storage: Automatic encryption at rest
- Cloud Functions: Environment variables for secrets

### 11.2 Authentication Security

**Firebase Auth Best Practices:**

- Google SSO only (no password-based auth)
- Custom claims for role-based access
- Token expiration: 1 hour (default)
- Refresh tokens managed by Firebase SDK

**Firestore Security Rules:**

- Strict read/write permissions
- Role-based access (admin/visitor)
- No public writes
- Audit logs write-protected (only Cloud Functions)

### 11.3 HIPAA Considerations

**Is This Application HIPAA-Compliant?**

**Current Status:** No (but can be made compliant)

**Why Not:**

- No Business Associate Agreement (BAA) with Google
- 30-day data retention may not be sufficient
- No encryption of data in transit beyond HTTPS
- No audit trail of data access

**To Make HIPAA-Compliant:**

1. **Sign BAA with Google** (requires paid plan, but still cheap)
2. **Use eligible services only:**
   - ✅ Firestore (eligible)
   - ✅ Cloud Functions (eligible)
   - ✅ Cloud Storage (eligible)
   - ❌ Firebase Hosting (not eligible → use Cloud Run instead)
3. **Enable audit logging** (Cloud Logging + Cloud Audit Logs)
4. **Implement access controls** (already done via security rules)
5. **Add data encryption** (use client-side encryption before storing PHI)

**Recommendation for Demo App:**

Since this is a **prospect demo tool** (not production healthcare app), full HIPAA compliance is not required. Add disclaimer:

> "This tool is for demonstration purposes only and should not be used for actual patient data. For HIPAA-compliant solutions, contact MedMinds directly."

---

## 12. Next Steps

### Immediate Actions

1. **Create Firebase Project:**
   ```bash
   firebase login
   firebase projects:create brca-medminds
   firebase use brca-medminds
   ```

2. **Enable Required APIs:**
   ```bash
   gcloud services enable firestore.googleapis.com
   gcloud services enable storage.googleapis.com
   gcloud services enable cloudfunctions.googleapis.com
   gcloud services enable documentai.googleapis.com
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Initialize Firebase in Existing Project:**
   ```bash
   cd /home/karthik/Development/Applications/BRCA
   firebase init hosting
   firebase init firestore
   firebase init functions
   firebase init storage
   ```

4. **Set Up Environment Variables:**
   ```bash
   # .env.local (Frontend)
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=brca-medminds.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=brca-medminds

   # functions/.env (Backend)
   GEMINI_API_KEY=your_gemini_key
   DOCUMENT_AI_PROCESSOR_ID=your_processor_id
   ```

5. **Deploy Initial Setup:**
   ```bash
   npm run build
   firebase deploy --only hosting
   firebase deploy --only firestore:rules
   firebase deploy --only functions
   ```

---

## Appendix A: Technology Comparison

**Why Firebase/GCP Over Alternatives?**

| Requirement | AWS Solution | Azure Solution | Firebase/GCP Solution | Winner |
|-------------|--------------|----------------|----------------------|--------|
| SSO Auth | Cognito ($) | Azure AD B2C ($) | Firebase Auth (free) | ✅ Firebase |
| Database | DynamoDB (free tier limited) | Cosmos DB ($$$) | Firestore (generous free tier) | ✅ Firebase |
| PDF Storage | S3 (5GB free) | Blob Storage (5GB free) | Firebase Storage (5GB free) | 🟰 Tie |
| Serverless | Lambda (1M free) | Functions (1M free) | Cloud Functions (2M free) | ✅ Firebase |
| AI/ML | Textract ($$) + Bedrock ($$$) | Document Intelligence ($$) + OpenAI ($$$) | Document AI ($) + Gemini (free tier) | ✅ Firebase |
| Hosting | S3 + CloudFront ($$) | Static Web Apps (free tier) | Firebase Hosting (free tier) | ✅ Firebase |
| **Total Free Tier Cost** | ~$5-10/month | ~$10-20/month | ~$0-2/month | ✅ Firebase |

**Conclusion:** Firebase/GCP is the clear winner for free-tier optimization and ecosystem integration.

---

## Appendix B: File Structure

```
BRCA/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginButton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── admin/
│   │   │   ├── UploadPolicy.tsx
│   │   │   ├── ReviewPolicy.tsx
│   │   │   └── ManagePolicies.tsx
│   │   ├── visitor/
│   │   │   ├── FormStep1.tsx (State selection)
│   │   │   ├── FormStep2.tsx (Personal history)
│   │   │   ├── FormStep3.tsx (Family history)
│   │   │   ├── FormStep4.tsx (Submit & results)
│   │   │   └── ResultsDisplay.tsx
│   │   └── shared/
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useFirestore.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Users.tsx
│   │   ├── visitor/
│   │   │   ├── PatientForm.tsx
│   │   │   └── History.tsx
│   │   ├── Login.tsx
│   │   └── Landing.tsx
│   ├── types/
│   │   ├── user.ts
│   │   ├── policy.ts
│   │   └── submission.ts
│   ├── firebase.config.ts
│   └── App.tsx
├── functions/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── onUserCreate.ts
│   │   │   └── promoteToAdmin.ts
│   │   ├── pdf/
│   │   │   ├── processPDF.ts
│   │   │   └── helpers/
│   │   │       ├── documentAI.ts
│   │   │       └── gemini.ts
│   │   ├── api/
│   │   │   └── matchPolicy.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── .firebaserc
└── docs/
    └── plan/
        └── TECHNICAL_PLAN.md (this document)
```

---

**End of Document**

**Version:** 1.0
**Last Updated:** 2025-11-22
**Author:** MedMinds Development Team
**Status:** ✅ Ready for Implementation

**Questions?** Contact: dev@medminds.com
