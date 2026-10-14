# 🔍 CampusIQ — Project Discovery & Implementation Audit

**Audit Date**: October 13, 2026  
**Baseline Commit**: `implementation-production` branch  
**Environment**: Google Antigravity / Windows / Supabase PostgreSQL 17 (`cxvikyzuwnxczsbcllwh`)

---

## 1. Existing Working Features
* **Design & UI Shell**: Responsive editorial layout (`#0B2925`, `#16856B`, `#F7F6F1`) with Tailwind CSS v4, Lucide icons, and Recharts.
* **Basic Authentication**: Supabase Auth client integration with `signInWithPassword()`, `signUp()`, and `signOut()`. Route-level guard checks if `currentUser` is present.
* **Public Inquiry Submissions**: `InquiryModal` submits records to `public.inquiries` table in Supabase.
* **Data Management UI**: Basic table viewer for `inquiries` and CSV upload parser prototype.
* **Client-side Pedagogical Tutor Engine**: Pattern-matching study tutor responses for DBMS, DSA, Networks, and OS topics.
* **Client-side Scoring Engine**: Deterministic placement readiness and student success score calculators in `scoring.ts`.

---

## 2. Broken or Partially Working Features
* **Role-Based Portals Rely on In-Memory State**: `AppContext.tsx` defaults `students`, `interventions`, and `notifications` to static in-memory arrays from `mockData.ts`. Edits are not permanently bound to real database entities across browser sessions.
* **No Database Foreign-Key Integrity in Existing 4 Tables**:
  * `interventions` stores `student_id` and `student_name` as loose `TEXT` columns instead of foreign keys to a normalized `students` table.
  * `study_tasks` has no `student_id` column at all.
  * `tutor_inquiries` has no user UUID reference.
* **Route Protection Weakness**: Route permissions check client-side metadata without server-side validation against trusted user roles stored in PostgreSQL.
* **Client-side CSV Import**: Parses into local React state only; records are not validated against normalized database schema or committed to PostgreSQL tables.
* **No Test Suite**: Zero test scripts configured in `package.json` (`vitest` is not installed).

---

## 3. Mock-Data Dependencies
* `src/data/mockData.ts`: Contains `INITIAL_STUDENTS` (12 synthetic student records), `INITIAL_FACULTY`, `INITIAL_INTERVENTIONS`, `INITIAL_NOTIFICATIONS`, and `DEMO_USERS`.
* `src/pages/admin/AdminOverview.tsx`: Computes metrics by aggregating `INITIAL_STUDENTS` in memory.
* `src/pages/admin/StudentDirectory.tsx`: Lists students from mock data.
* `src/pages/admin/StudentProfile.tsx`: Reads individual dossiers from mock data.
* `src/pages/admin/PlacementIntelligence.tsx`: Aggregates placement matrix from mock data.
* `src/pages/admin/RiskSegmentation.tsx`: Segments students using mock data.
* `src/pages/faculty/FacultyOverview.tsx`: Mentee list is hardcoded to subset of mock students.
* `src/pages/student/StudentPortal.tsx`: Defaults to mock student `STU-2024-042` (Aarav Sharma).

---

## 4. Missing Database Relationships (To be fixed in Phase 2)
The existing Supabase project has only 4 disconnected tables (`inquiries`, `interventions`, `study_tasks`, `tutor_inquiries`).
Missing core academic tables:
* `institutions`, `campuses`, `departments`, `academic_programs`, `academic_terms`
* `profiles`, `user_role_assignments`, `faculty_profiles`, `student_profiles`
* `courses`, `course_offerings`, `student_enrollments`, `faculty_course_assignments`
* `attendance_sessions`, `attendance_records`
* `assessment_definitions`, `assessment_results`, `course_grades`
* `lms_activities`, `coding_assessments`, `coding_scores`
* `placement_profiles`, `mock_interviews`
* `import_batches`, `import_row_errors`
* `audit_logs`, `notifications`

---

## 5. Security Vulnerabilities & Remediation Status
* **Credential Exposure**: Database password was previously placed in `.env` and `README.md`.
  * *Remediation*:
    * `.env` added to `.gitignore`.
    * Sensitive database connection strings removed from public documentation.
    * `SUPABASE_SERVICE_ROLE_KEY` confirmed safe without `VITE_` prefix so it is not bundled into client-side JS.
* **Row-Level Security (RLS)**:
  * Existing 4 tables have basic RLS enabled, but require institution- and user-scoped isolation policies.
  * Role authorization must be resolved from a trusted `user_role_assignments` table rather than user-editable metadata.

---

## 6. Implementation Action Plan
1. **Phase 1**: Security & Backend Foundation (role assignments, authorization helper RPCs, secure environment).
2. **Phase 2**: Complete Normalized Academic Database (migrations for institutions, departments, profiles, students, courses, attendance, grades, interventions, tasks, quizzes, RLS policies, TypeScript types).
3. **Phase 3**: Real Institutional Data Ingestion (CSV/XLSX parser engine, schema validation, batch commit to Supabase, import audit logs).
4. **Phase 4**: Make Every Portal Functional (Admin, Faculty, Student, Planner, Quizzes, Career Copilot, Inquiries connecting to live DB with empty states).
5. **Phase 5**: Intelligence Engines & Server-Side AI (Deterministic risk engine, recommendations, AI tutor provider abstraction, Institutional Copilot).
6. **Phase 6**: Automated QA, Security Tests, Optimization & Deployment Verification.
