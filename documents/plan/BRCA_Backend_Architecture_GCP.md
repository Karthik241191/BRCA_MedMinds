# BRCA Medical-Necessity Tool
## Backend Architecture & Database Requirements (GCP)

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [PDF Processing Requirements](#2-pdf-processing-requirements)
3. [GCP Services Stack](#3-gcp-services-stack)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Cost Estimation](#6-cost-estimation)
7. [Free Tier & Cost Optimization](#7-free-tier--cost-optimization)
8. [Deployment Strategy](#8-deployment-strategy)

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TS)                    │
│                  Hosted on Cloud Storage                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloud Load Balancer (HTTPS)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                Cloud Run (API Backend)                       │
│        Node.js/Express or Python/FastAPI                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Patient Data API                                 │     │
│  │  • Criteria Evaluation Engine                       │     │
│  │  • PDF Processing Orchestrator                      │     │
│  │  • Document Generation                              │     │
│  └────────────────────────────────────────────────────┘     │
└─────┬──────────────┬──────────────┬────────────────┬────────┘
      │              │              │                │
      ▼              ▼              ▼                ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│ Firestore│  │  Cloud   │  │  Document AI │  │Cloud Storage │
│ Database │  │ Functions│  │  (PDF OCR)   │  │ (PDF Files)  │
└──────────┘  └──────────┘  └──────────────┘  └──────────────┘
      │              │              │                │
      │              │              ▼                │
      │              │     ┌──────────────────┐      │
      │              │     │  Vertex AI /     │      │
      │              │     │  Gemini API      │      │
      │              │     │  (NLP/Matching)  │      │
      │              │     └──────────────────┘      │
      │              │                                │
      │              ▼                                │
      │     ┌──────────────────┐                     │
      │     │  Cloud Scheduler │                     │
      │     │  (Cron Jobs)     │                     │
      │     └──────────────────┘                     │
      │                                               │
      └───────────────────┬───────────────────────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Secret Manager │
                 │   (API Keys)     │
                 └──────────────────┘
```

### 1.2 High-Level Flow

1. **Admin uploads insurance policy PDFs** → Cloud Storage
2. **Cloud Function triggered** → Processes PDF via Document AI
3. **Gemini AI extracts criteria** → Structured JSON stored in Firestore
4. **User submits patient data** → Frontend → Cloud Run API
5. **API matches patient data** → Against criteria in Firestore
6. **Return verdict** → Frontend displays results

---

## 2. PDF Processing Requirements

### 2.1 Use Case: Insurance Policy PDF Upload

**Client Requirement:**
- Admin should upload insurance policy PDFs (UHC, Evicore, BCBS, Aetna, Regence, Carelon)
- System should extract BRCA testing criteria from PDFs automatically
- When policies update, admin re-uploads new PDF
- Application uses extracted criteria for real-time patient matching

### 2.2 PDF Processing Workflow

```
┌──────────────────────────────────────────────────────────┐
│  Step 1: Admin Upload                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Admin Portal (React)                              │ │
│  │  • Select payer (e.g., UHC)                        │ │
│  │  • Upload PDF file                                 │ │
│  │  • Add metadata (version, effective date)          │ │
│  └───────────────────┬────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Step 2: Store PDF                                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Cloud Storage Bucket                              │ │
│  │  /policy-pdfs/uhc/2025-v1.pdf                      │ │
│  │  • Object metadata: payer, version, date           │ │
│  └───────────────────┬────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼ (Trigger)
┌──────────────────────────────────────────────────────────┐
│  Step 3: Cloud Function - PDF Processor                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Triggered on new PDF upload                       │ │
│  │  1. Read PDF from Cloud Storage                    │ │
│  │  2. Send to Document AI for OCR                    │ │
│  │  3. Extract text content                           │ │
│  └───────────────────┬────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Step 4: AI-Powered Criteria Extraction                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Gemini API / Vertex AI                            │ │
│  │  Prompt: "Extract BRCA testing criteria from       │ │
│  │           this insurance policy document.          │ │
│  │           Return structured JSON with:             │ │
│  │           - Personal history criteria              │ │
│  │           - Family history criteria                │ │
│  │           - Age thresholds                         │ │
│  │           - Cancer types                           │ │
│  │           - Relationship requirements"             │ │
│  └───────────────────┬────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Step 5: Store Structured Criteria                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Firestore Collection: "payer_criteria"            │ │
│  │  Document: "uhc_2025_v1"                           │ │
│  │  {                                                  │ │
│  │    payer: "UHC",                                   │ │
│  │    version: "2025-v1",                             │ │
│  │    effectiveDate: "2025-01-01",                    │ │
│  │    criteria: [                                      │ │
│  │      {                                              │ │
│  │        id: "uhc_001",                              │ │
│  │        category: "personal_history",               │ │
│  │        condition: "breast_cancer",                 │ │
│  │        ageThreshold: 45,                           │ │
│  │        description: "Personal breast cancer ≤45"  │ │
│  │      },                                             │ │
│  │      ...                                            │ │
│  │    ],                                               │ │
│  │    rawText: "...",                                 │ │
│  │    pdfUrl: "gs://bucket/policy-pdfs/uhc/..."      │ │
│  │  }                                                  │ │
│  └───────────────────┬────────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  Step 6: Human Review (Optional)                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Admin Dashboard                                   │ │
│  │  • View extracted criteria                         │ │
│  │  • Edit/correct AI extraction                      │ │
│  │  • Approve for production use                      │ │
│  │  • Mark as active version                          │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 2.3 Criteria Matching Engine

```typescript
// When user submits patient data
async function evaluatePatient(patientData: PatientData, payerId: string) {
  // 1. Fetch active criteria for payer from Firestore
  const criteria = await getCriteriaForPayer(payerId);

  // 2. Evaluate each criterion against patient data
  const results = criteria.map(rule => ({
    ruleId: rule.id,
    matched: evaluateRule(rule, patientData),
    description: rule.description,
    weight: rule.weight
  }));

  // 3. Calculate overall verdict
  const matchedRules = results.filter(r => r.matched);
  const totalWeight = matchedRules.reduce((sum, r) => sum + r.weight, 0);

  const verdict = determineVerdict(totalWeight, criteria.length);

  return {
    payer: payerId,
    verdict: verdict, // 'approved', 'likely_approved', 'denied'
    matchedCriteria: matchedRules,
    confidence: calculateConfidence(matchedRules, criteria)
  };
}
```

---

## 3. GCP Services Stack

### 3.1 Recommended Services

#### Frontend Hosting
**Service**: Cloud Storage + Cloud CDN
- **Purpose**: Host static React build
- **Cost**: ~$0.026/GB storage + $0.08-0.20/GB egress
- **Free Tier**: 5GB storage, 1GB egress/month

#### Backend API
**Service**: Cloud Run
- **Purpose**: Serverless container for Node.js/Python API
- **Cost**: $0.00002400/vCPU-second, $0.00000250/GiB-second
- **Free Tier**: 2M requests/month, 360k vCPU-seconds, 180k GiB-seconds

#### Database
**Service**: Firestore (Native Mode)
- **Purpose**: Store patient data, criteria, verdicts
- **Cost**: $0.18/GB storage, $0.06/100k reads, $0.18/100k writes
- **Free Tier**: 1GB storage, 50k reads/day, 20k writes/day, 20k deletes/day

#### PDF Storage
**Service**: Cloud Storage
- **Purpose**: Store uploaded policy PDFs
- **Cost**: $0.020/GB/month (Standard), $0.010/GB (Nearline for archives)
- **Free Tier**: 5GB Standard storage

#### PDF Processing
**Service**: Document AI
- **Purpose**: OCR and text extraction from PDFs
- **Cost**: $1.50 per 1,000 pages (General Form Parser)
- **Free Tier**: 1,000 pages/month

#### AI Criteria Extraction
**Service**: Gemini API (Vertex AI)
- **Purpose**: Extract structured criteria from PDF text
- **Cost**:
  - Gemini 1.5 Flash: $0.075/1M input tokens, $0.30/1M output tokens
  - Gemini 1.5 Pro: $1.25/1M input tokens, $5.00/1M output tokens
- **Free Tier**: Gemini Flash has generous free tier via AI Studio

#### Background Jobs
**Service**: Cloud Functions (2nd Gen)
- **Purpose**: Triggered PDF processing on upload
- **Cost**: $0.40/million invocations, compute pricing similar to Cloud Run
- **Free Tier**: 2M invocations/month

#### Secrets Management
**Service**: Secret Manager
- **Purpose**: Store API keys, credentials
- **Cost**: $0.06/secret/month
- **Free Tier**: 6 secret versions free

#### Scheduling
**Service**: Cloud Scheduler
- **Purpose**: Periodic tasks (cleanup, reminders)
- **Cost**: $0.10/job/month
- **Free Tier**: 3 jobs free

---

## 4. Database Schema

### 4.1 Firestore Collections

#### Collection: `payer_criteria`
Stores extracted criteria from insurance policy PDFs

```typescript
interface PayerCriteria {
  id: string; // e.g., "uhc_2025_v1"
  payer: PayerType;
  version: string;
  effectiveDate: Date;
  expirationDate?: Date;
  status: 'draft' | 'active' | 'archived';

  criteria: Criterion[];

  metadata: {
    pdfUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    rawText: string; // Full OCR text
  };
}

interface Criterion {
  id: string;
  category: 'personal_history' | 'family_history' | 'ancestry' | 'other';
  condition: string; // e.g., "breast_cancer"
  ageThreshold?: number;
  ageOperator?: '<=' | '>=' | '=' | 'any';
  relationshipDegree?: 'first' | 'second' | 'third' | 'any';
  relationshipTypes?: string[]; // ['mother', 'sister', etc.]
  cancerTypes?: string[];
  additionalConditions?: Record<string, any>;
  weight: number; // Importance score
  description: string;
  originalText?: string; // Exact text from PDF
}
```

**Example Document:**
```json
{
  "id": "uhc_2025_v1",
  "payer": "UHC",
  "version": "2025-v1",
  "effectiveDate": "2025-01-01T00:00:00Z",
  "status": "active",
  "criteria": [
    {
      "id": "uhc_001",
      "category": "personal_history",
      "condition": "breast_cancer",
      "ageThreshold": 45,
      "ageOperator": "<=",
      "weight": 10,
      "description": "Personal history of breast cancer diagnosed at age 45 or younger",
      "originalText": "Individuals with a personal history of breast cancer diagnosed at age 45 years or younger"
    },
    {
      "id": "uhc_002",
      "category": "family_history",
      "condition": "ovarian_cancer",
      "relationshipDegree": "first",
      "relationshipTypes": ["mother", "sister", "daughter"],
      "weight": 8,
      "description": "First-degree relative with ovarian cancer at any age",
      "originalText": "One or more first-degree relatives with ovarian cancer"
    }
  ],
  "metadata": {
    "pdfUrl": "gs://brca-tool/policy-pdfs/uhc/2025-v1.pdf",
    "uploadedBy": "admin@example.com",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "approvedBy": "reviewer@example.com",
    "approvedAt": "2025-01-16T14:00:00Z",
    "rawText": "..."
  }
}
```

#### Collection: `patients` (Optional - if storing patient data)
Stores patient evaluations (if persistence needed)

```typescript
interface PatientEvaluation {
  id: string;
  patientInfo: {
    firstName: string; // Encrypted or hashed
    lastName: string; // Encrypted or hashed
    dateOfBirth: Date; // Encrypted
    memberId: string; // Encrypted
  };

  personalHistory: PersonalHistory;
  familyHistory: FamilyMember[];

  evaluationResults: EvaluationResult[];

  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // Auto-delete after 30 days (HIPAA compliance)

  userId?: string; // If user authentication added
}
```

**Note:** For maximum privacy, consider client-side-only storage (no backend persistence) or end-to-end encryption.

#### Collection: `users` (Optional - for admin portal)
Admin users who can upload PDFs

```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'reviewer' | 'viewer';
  name: string;
  createdAt: Date;
  lastLoginAt?: Date;
}
```

#### Collection: `audit_logs`
Track all PDF uploads and criteria changes

```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'pdf_upload' | 'criteria_approve' | 'criteria_edit' | 'evaluation_run';
  resource: string;
  details: Record<string, any>;
}
```

---

## 5. API Endpoints

### 5.1 Patient Evaluation API

#### `POST /api/evaluate`
Evaluate patient eligibility for BRCA testing

**Request:**
```typescript
{
  patientInfo: PatientInfo;
  personalHistory: PersonalHistory;
  familyHistory: FamilyMember[];
  payerId: string; // or array for multi-payer evaluation
}
```

**Response:**
```typescript
{
  evaluationId: string;
  results: EvaluationResult[];
  generatedAt: Date;
}
```

#### `GET /api/payers`
Get list of available payers and their active criteria versions

**Response:**
```typescript
{
  payers: Array<{
    id: string;
    name: string;
    activeVersion: string;
    lastUpdated: Date;
  }>;
}
```

### 5.2 Admin API (PDF Management)

#### `POST /api/admin/upload-policy`
Upload new insurance policy PDF

**Request:** Multipart form-data
- `file`: PDF file
- `payer`: PayerType
- `version`: string
- `effectiveDate`: Date

**Response:**
```typescript
{
  uploadId: string;
  status: 'processing' | 'completed' | 'failed';
  criteriaId?: string; // When completed
}
```

#### `GET /api/admin/upload-status/:uploadId`
Check status of PDF processing

**Response:**
```typescript
{
  uploadId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  extractedCriteria?: Criterion[];
  error?: string;
}
```

#### `POST /api/admin/approve-criteria/:criteriaId`
Approve extracted criteria for production use

**Request:**
```typescript
{
  criteriaId: string;
  editedCriteria?: Criterion[]; // If admin made corrections
}
```

#### `GET /api/admin/criteria/:criteriaId`
Get criteria details for review

**Response:**
```typescript
{
  criteria: PayerCriteria;
  comparisonToPrevious?: {
    added: Criterion[];
    removed: Criterion[];
    modified: Criterion[];
  };
}
```

---

## 6. Cost Estimation

### 6.1 Monthly Usage Assumptions

- **Users**: 100 evaluations/month (low initial volume)
- **PDF Uploads**: 6 payers × 1 update/quarter = 2 PDFs/month average
- **PDF Size**: ~50 pages/PDF average
- **API Requests**: ~300 requests/month (100 evaluations × 3 requests each)
- **Database**: ~1GB storage, 50k reads/month, 5k writes/month

### 6.2 Cost Breakdown (Monthly)

| Service | Usage | Cost | Free Tier | Actual Cost |
|---------|-------|------|-----------|-------------|
| **Cloud Run** | 300 requests, minimal compute | $0.05 | 2M req free | $0.00 |
| **Firestore** | 1GB storage, 50k reads, 5k writes | $0.18 + $0.03 + $0.01 | Mostly free | $0.00 |
| **Cloud Storage** | 5GB PDFs + frontend | $0.13 | 5GB free | $0.00 |
| **Cloud CDN** | 10GB egress | $1.20 | 1GB free | $0.90 |
| **Document AI** | 100 pages | $0.15 | 1k pages free | $0.00 |
| **Gemini API** | ~500k tokens | $0.04 | Generous free | $0.00 |
| **Cloud Functions** | 10 invocations | $0.004 | 2M free | $0.00 |
| **Secret Manager** | 3 secrets | $0.18 | 6 free | $0.00 |
| **Cloud Scheduler** | 2 jobs | $0.20 | 3 free | $0.00 |

**Total Estimated Cost: $0.90 - $5.00/month** (mostly within free tier!)

### 6.3 Cost at Scale (1,000 evaluations/month)

| Service | Usage | Cost |
|---------|-------|------|
| Cloud Run | 3,000 requests | $0.50 |
| Firestore | 5GB storage, 500k reads, 50k writes | $1.20 |
| Cloud Storage | 10GB | $0.26 |
| Cloud CDN | 100GB egress | $10.00 |
| Document AI | 100 pages | $0.15 |
| Gemini API | 5M tokens | $0.40 |

**Total at Scale: ~$12-15/month**

---

## 7. Free Tier & Cost Optimization

### 7.1 Maximizing Free Tier

#### Strategy 1: Use Gemini Flash (Free Tier)
- Gemini 1.5 Flash has generous free tier via AI Studio
- Suitable for criteria extraction
- If exceeding free tier, switch to Gemini 2.0 Flash (cheaper than Pro)

#### Strategy 2: Minimize Firestore Reads
- Cache active criteria in Cloud Run memory
- Use Firestore snapshots with TTL
- Batch reads where possible

#### Strategy 3: Optimize CDN Usage
- Aggressive browser caching (1 year for static assets)
- Compress all assets (gzip/brotli)
- Use Cloud Storage directly for infrequent access

#### Strategy 4: Cloud Run Optimization
- Set min instances to 0 (scale to zero)
- Optimize container size (use Alpine Linux base)
- Use request batching where applicable

#### Strategy 5: Document AI Alternatives
- For simple PDFs, use open-source PDF.js + Tesseract.js
- Only use Document AI for complex/scanned documents
- Pre-process PDFs to reduce page count (extract relevant sections)

### 7.2 Alternative: Self-Hosted OCR

If Document AI costs become prohibitive:

**Option A: Cloud Run with Tesseract**
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache tesseract-ocr
# Your app code
```
- **Cost**: Only Cloud Run compute (~$0.00 in free tier)
- **Trade-off**: Lower OCR accuracy than Document AI

**Option B: Use pdf-parse (text-based PDFs only)**
```javascript
const pdfParse = require('pdf-parse');
// Extract text from text-based PDFs (no OCR needed)
```
- **Cost**: $0.00
- **Trade-off**: Only works if PDF has embedded text

### 7.3 Staying Within $5/month Budget

**Configuration:**
1. Use Gemini Flash free tier for AI extraction
2. Self-hosted OCR (Tesseract) instead of Document AI
3. Cloud Run min instances = 0
4. Firestore native mode (not Datastore)
5. Cloud Storage Standard tier
6. No Cloud CDN (serve from Cloud Storage directly)
7. Use Firebase Hosting (free tier: 10GB/month)

**Expected Cost: $0.00 - $2.00/month**

---

## 8. Deployment Strategy

### 8.1 Infrastructure as Code (Terraform)

```hcl
# terraform/main.tf

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "cloudfunctions.googleapis.com",
    "documentai.googleapis.com",
    "aiplatform.googleapis.com",
    "secretmanager.googleapis.com"
  ])
  service = each.key
}

# Firestore Database
resource "google_firestore_database" "brca_db" {
  name     = "(default)"
  location_id = "us-central1"
  type     = "FIRESTORE_NATIVE"
}

# Cloud Storage Buckets
resource "google_storage_bucket" "frontend" {
  name     = "brca-tool-frontend"
  location = "US"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket" "policy_pdfs" {
  name     = "brca-tool-policy-pdfs"
  location = "US"

  lifecycle_rule {
    condition {
      age = 365 # Move to Nearline after 1 year
    }
    action {
      type = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

# Cloud Run Service
resource "google_cloud_run_service" "api" {
  name     = "brca-api"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/PROJECT_ID/brca-api:latest"

        env {
          name = "FIRESTORE_PROJECT_ID"
          value = var.project_id
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }

      container_concurrency = 80
      timeout_seconds       = 300
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Cloud Function for PDF Processing
resource "google_cloudfunctions2_function" "pdf_processor" {
  name     = "pdf-processor"
  location = "us-central1"

  build_config {
    runtime     = "nodejs20"
    entry_point = "processPDF"
    source {
      storage_source {
        bucket = google_storage_bucket.policy_pdfs.name
        object = "function-source.zip"
      }
    }
  }

  service_config {
    max_instance_count = 10
    available_memory   = "1Gi"
    timeout_seconds    = 540

    environment_variables = {
      GEMINI_API_KEY = google_secret_manager_secret_version.gemini_key.secret_data
    }
  }

  event_trigger {
    trigger_region = "us-central1"
    event_type     = "google.cloud.storage.object.v1.finalized"
    retry_policy   = "RETRY_POLICY_RETRY"

    event_filters {
      attribute = "bucket"
      value     = google_storage_bucket.policy_pdfs.name
    }
  }
}

# Secret Manager for API Keys
resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "gemini-api-key"

  replication {
    auto {}
  }
}
```

### 8.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Upload to Cloud Storage
        run: |
          gsutil -m rsync -r -d dist/ gs://brca-tool-frontend/

      - name: Set public access
        run: |
          gsutil iam ch allUsers:objectViewer gs://brca-tool-frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Build and push Docker image
        run: |
          gcloud builds submit \
            --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/brca-api:latest \
            ./backend

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy brca-api \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/brca-api:latest \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
```

### 8.3 Backend Application Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── evaluation.controller.ts
│   │   ├── admin.controller.ts
│   │   └── payer.controller.ts
│   ├── services/
│   │   ├── criteria-evaluation.service.ts
│   │   ├── pdf-processor.service.ts
│   │   ├── gemini.service.ts
│   │   └── firestore.service.ts
│   ├── models/
│   │   ├── patient.model.ts
│   │   ├── criteria.model.ts
│   │   └── evaluation.model.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── evaluation.routes.ts
│   │   ├── admin.routes.ts
│   │   └── payer.routes.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   └── validation.ts
│   └── app.ts
├── functions/
│   └── pdf-processor/
│       ├── index.ts
│       ├── ocr.ts
│       ├── criteria-extractor.ts
│       └── package.json
├── Dockerfile
├── package.json
└── tsconfig.json
```

### 8.4 Key Backend Implementation

#### Gemini Criteria Extraction Service

```typescript
// backend/src/services/gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractCriteriaFromText(
  pdfText: string,
  payer: string
): Promise<Criterion[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a medical policy analyst. Extract BRCA genetic testing eligibility criteria from this insurance policy document.

Policy Text:
${pdfText}

Extract all criteria and return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "category": "personal_history" | "family_history" | "ancestry" | "other",
    "condition": "cancer_type",
    "ageThreshold": number or null,
    "ageOperator": "<=" | ">=" | "=" | "any" or null,
    "relationshipDegree": "first" | "second" | "third" | "any" or null,
    "relationshipTypes": ["mother", "sister"] or null,
    "cancerTypes": ["breast", "ovarian"] or null,
    "weight": number (1-10, importance),
    "description": "clear description",
    "originalText": "exact quote from policy"
  }
]

Focus on:
- Personal cancer history requirements (breast, ovarian, pancreatic, prostate, etc.)
- Family history requirements (which relatives, which cancers, age requirements)
- Ancestry requirements (Ashkenazi Jewish, etc.)
- Age thresholds for diagnosis
- Number of relatives required

Return ONLY the JSON array, no markdown, no explanation.
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Remove markdown code blocks if present
  const jsonText = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const criteria: Criterion[] = JSON.parse(jsonText);

  // Add payer-specific ID prefix
  return criteria.map((c, idx) => ({
    ...c,
    id: `${payer.toLowerCase()}_${String(idx + 1).padStart(3, '0')}`
  }));
}
```

#### Criteria Evaluation Engine

```typescript
// backend/src/services/criteria-evaluation.service.ts
export function evaluatePatientAgainstCriteria(
  patient: PatientData,
  criteria: Criterion[]
): EvaluationResult {
  const matchedCriteria: Criterion[] = [];

  for (const criterion of criteria) {
    if (evaluateSingleCriterion(patient, criterion)) {
      matchedCriteria.push(criterion);
    }
  }

  const totalWeight = matchedCriteria.reduce((sum, c) => sum + c.weight, 0);
  const maxWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const confidence = (totalWeight / maxWeight) * 100;

  let verdict: Verdict;
  if (confidence >= 80) verdict = 'approved';
  else if (confidence >= 50) verdict = 'likely_approved';
  else if (confidence >= 30) verdict = 'requires_review';
  else verdict = 'denied';

  return {
    verdict,
    matchedCriteria,
    unmatchedCriteria: criteria.filter(c => !matchedCriteria.includes(c)),
    confidence,
    totalWeight,
    maxWeight
  };
}

function evaluateSingleCriterion(
  patient: PatientData,
  criterion: Criterion
): boolean {
  switch (criterion.category) {
    case 'personal_history':
      return evaluatePersonalHistory(patient.personalHistory, criterion);
    case 'family_history':
      return evaluateFamilyHistory(patient.familyHistory, criterion);
    case 'ancestry':
      return evaluateAncestry(patient, criterion);
    default:
      return false;
  }
}

function evaluatePersonalHistory(
  history: PersonalHistory,
  criterion: Criterion
): boolean {
  if (!history.hasPersonalHistory) return false;

  for (const cancer of history.cancerTypes) {
    if (criterion.cancerTypes && !criterion.cancerTypes.includes(cancer.type)) {
      continue;
    }

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

function evaluateFamilyHistory(
  familyMembers: FamilyMember[],
  criterion: Criterion
): boolean {
  const matchingMembers = familyMembers.filter(member => {
    // Check relationship type
    if (criterion.relationshipTypes) {
      if (!criterion.relationshipTypes.includes(member.relationship)) {
        return false;
      }
    }

    // Check cancer types
    for (const cancer of member.cancerHistory) {
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

      return true; // This family member matches
    }

    return false;
  });

  return matchingMembers.length > 0;
}

function compareAge(
  actualAge: number,
  threshold: number,
  operator: string
): boolean {
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

## 9. Security Considerations

### 9.1 PHI/PII Protection

1. **Client-Side Encryption** (Optional)
   - Encrypt patient data before sending to backend
   - Use Web Crypto API
   - Store keys in browser session only

2. **Transit Encryption**
   - HTTPS enforced (Cloud Run automatic)
   - TLS 1.3

3. **At-Rest Encryption**
   - Firestore automatic encryption
   - Cloud Storage automatic encryption

4. **Data Retention**
   - Auto-delete patient evaluations after 30 days
   - Use Firestore TTL (Time To Live)

5. **Access Control**
   - Firebase Authentication for admin portal
   - Cloud IAM for service-to-service
   - No authentication for evaluation API (stateless)

### 9.2 HIPAA Compliance

**GCP HIPAA Compliance:**
- Sign BAA (Business Associate Agreement) with Google
- Use eligible services only (Cloud Run, Firestore, Cloud Storage are eligible)
- Enable audit logging
- Implement access controls

**Code-Level Compliance:**
- No logging of PHI
- Anonymize audit logs
- Secure data deletion
- Encryption in transit and at rest

---

## 10. Monitoring & Observability

### 10.1 Cloud Monitoring

```yaml
# Metrics to Track
- API latency (p50, p95, p99)
- Error rate
- Request count
- Firestore read/write operations
- Cloud Storage bandwidth
- Cloud Run instance count
- Gemini API token usage
- PDF processing duration
```

### 10.2 Alerts

```yaml
# Alert Policies
- API error rate > 5%
- API latency p95 > 2s
- Cloud Run instance count > 5
- Gemini API quota exceeded
- Firestore reads exceeding free tier
```

### 10.3 Logging

```typescript
// Structured logging with Cloud Logging
import { Logging } from '@google-cloud/logging';

const logging = new Logging();
const log = logging.log('brca-api');

function logEvaluation(evaluation: EvaluationResult) {
  const metadata = {
    severity: 'INFO',
    resource: {
      type: 'cloud_run_revision',
    },
  };

  const entry = log.entry(metadata, {
    event: 'evaluation_completed',
    payer: evaluation.payer,
    verdict: evaluation.verdict,
    confidence: evaluation.confidence,
    // DO NOT log patient identifiable information
  });

  log.write(entry);
}
```

---

## 11. Development Workflow

### 11.1 Local Development

```bash
# Prerequisites
- Node.js 18+
- Docker
- GCP CLI (gcloud)
- Firebase CLI

# Setup
git clone <repo>
cd brca-tool

# Frontend
cd frontend
npm install
npm run dev # http://localhost:5173

# Backend
cd backend
npm install
npm run dev # http://localhost:8080

# Use Firestore Emulator
firebase emulators:start
```

### 11.2 Environment Variables

```bash
# .env.local (Frontend)
VITE_API_URL=http://localhost:8080/api
VITE_ENV=development

# .env (Backend)
PORT=8080
FIRESTORE_EMULATOR_HOST=localhost:8081
GEMINI_API_KEY=your_key_here
GCP_PROJECT_ID=brca-tool-dev
ENVIRONMENT=development
```

---

## Summary

### ✅ **Yes, this is 100% doable within free tier (or $0-5/month)!**

**Why it works:**
1. **PDF Processing**: ~2 PDFs/month × 50 pages = 100 pages → Well within Document AI free tier (1,000 pages/month)
2. **AI Extraction**: Gemini Flash free tier is very generous for this use case
3. **Database**: Light usage fits entirely in Firestore free tier
4. **Compute**: Cloud Run free tier covers 2M requests/month
5. **Storage**: PDFs + frontend < 5GB → Free tier

**Recommended Stack:**
- ✅ Cloud Run (Backend API)
- ✅ Firestore (Database)
- ✅ Cloud Storage (Frontend + PDFs)
- ✅ Document AI (PDF OCR) or Tesseract (self-hosted)
- ✅ Gemini Flash (AI extraction)
- ✅ Cloud Functions (PDF processing trigger)

**Fallback for Cost Savings:**
- Replace Document AI with Tesseract.js (Cloud Run)
- Use Firebase Hosting instead of Cloud Storage + CDN
- Client-side-only storage (no persistence)

**Next Steps:**
1. Create GCP project
2. Enable APIs (Firestore, Cloud Run, Document AI, Vertex AI)
3. Deploy backend API to Cloud Run
4. Deploy frontend to Cloud Storage/Firebase Hosting
5. Set up Cloud Function for PDF processing
6. Configure Gemini API for criteria extraction
7. Test with sample insurance policy PDF

---

**Document Version**: 1.0
**Last Updated**: 2025-11-21
**Author**: BRCA Tool Backend Team
**Status**: Ready for Implementation
